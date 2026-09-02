<?php

declare(strict_types=1);

/**
 * Contact form backend for andreaskissner.dev.
 *
 * Self-written, no third-party form API. Receives a JSON payload from the
 * Angular contact form and, if it passes all checks, emails it to the
 * site owner. Deploy this file to the hosting root as /contact.php,
 * next to the Angular build output (matches the frontend's fetch target).
 */

const ALLOWED_ORIGIN = 'https://andreaskissner.dev';
const RECIPIENT_EMAIL = 'developer@andreas-kissner.cloud';
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW_SECONDS = 3600;
const RATE_LIMIT_STORE_PATH = __DIR__ . '/.contact-rate-limit.json';
const MIN_MESSAGE_LENGTH = 10;

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(405, ['error' => 'method_not_allowed']);
}

if (!originIsAllowed()) {
    sendJsonResponse(403, ['error' => 'forbidden_origin']);
}

$payload = readJsonPayload();
if ($payload === null) {
    sendJsonResponse(400, ['error' => 'invalid_json']);
}

// Honeypot: bots fill every field, humans never see this one. Pretend
// success without sending anything, so the bot has no signal to adapt to.
if (($payload['honeypot'] ?? '') !== '') {
    sendJsonResponse(200, ['status' => 'ok']);
}

$errors = validateFields($payload);
if ($errors !== []) {
    sendJsonResponse(422, ['error' => 'validation_failed', 'fields' => $errors]);
}

$clientIp = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
if (!checkAndRecordRateLimit($clientIp)) {
    sendJsonResponse(429, ['error' => 'rate_limited']);
}

$sent = sendNotificationEmail($payload);
sendJsonResponse($sent ? 200 : 502, ['status' => $sent ? 'ok' : 'send_failed']);

/** Sends a JSON response with the given status code and body, then exits. */
function sendJsonResponse(int $statusCode, array $body)
{
    http_response_code($statusCode);
    echo json_encode($body);
    exit;
}

/** Checks the request's Origin (falling back to Referer) against the allowed site origin. */
function originIsAllowed(): bool
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin !== '') {
        return $origin === ALLOWED_ORIGIN;
    }
    $referer = $_SERVER['HTTP_REFERER'] ?? '';
    return substr($referer, 0, strlen(ALLOWED_ORIGIN) + 1) === ALLOWED_ORIGIN . '/';
}

/** Reads and JSON-decodes the raw request body, returning null if it isn't a valid object. */
function readJsonPayload(): ?array
{
    $raw = file_get_contents('php://input');
    $decoded = json_decode($raw ?: '', true);
    return is_array($decoded) ? $decoded : null;
}

/** Validates the contact payload, returning a list of invalid field names. */
function validateFields(array $data): array
{
    $errors = [];
    $name = trim((string) ($data['name'] ?? ''));
    $email = trim((string) ($data['email'] ?? ''));
    $message = trim((string) ($data['message'] ?? ''));

    if ($name === '' || containsHeaderInjection($name)) {
        $errors[] = 'name';
    }
    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || containsHeaderInjection($email)) {
        $errors[] = 'email';
    }
    if (strlen($message) < MIN_MESSAGE_LENGTH) {
        $errors[] = 'message';
    }
    return $errors;
}

/** Detects CR/LF characters that could be used to inject extra mail headers. */
function containsHeaderInjection(string $value): bool
{
    return preg_match('/[\r\n]/', $value) === 1;
}

/**
 * Enforces a simple per-IP rate limit using a JSON file as storage, with an
 * exclusive lock so concurrent requests can't race past the limit.
 */
function checkAndRecordRateLimit(string $ip): bool
{
    $handle = fopen(RATE_LIMIT_STORE_PATH, 'c+');
    if ($handle === false || !flock($handle, LOCK_EX)) {
        return true;
    }
    $store = readRateLimitStore($handle);
    $allowed = recordRequestAndCheckLimit($store, $ip);
    writeRateLimitStore($handle, $store);
    flock($handle, LOCK_UN);
    fclose($handle);
    return $allowed;
}

/** Reads and decodes the rate-limit store from an already-open, locked file handle. */
function readRateLimitStore($handle): array
{
    $size = fstat($handle)['size'] ?? 0;
    $raw = $size > 0 ? fread($handle, $size) : '';
    $decoded = json_decode((string) $raw, true);
    return is_array($decoded) ? $decoded : [];
}

/** Adds the current request's timestamp for the IP and reports whether it's still within limit. */
function recordRequestAndCheckLimit(array &$store, string $ip): bool
{
    $now = time();
    $windowStart = $now - RATE_LIMIT_WINDOW_SECONDS;
    $timestamps = array_filter($store[$ip] ?? [], fn ($t) => $t > $windowStart);
    $withinLimit = count($timestamps) < RATE_LIMIT_MAX_REQUESTS;
    $timestamps[] = $now;
    $store[$ip] = array_values($timestamps);
    $store = pruneStaleIps($store, $windowStart);
    return $withinLimit;
}

/** Drops IP entries whose every timestamp has aged out of the rate-limit window. */
function pruneStaleIps(array $store, int $windowStart): array
{
    foreach ($store as $ip => $timestamps) {
        $fresh = array_filter($timestamps, fn ($t) => $t > $windowStart);
        if ($fresh === []) {
            unset($store[$ip]);
        }
    }
    return $store;
}

/** Truncates and rewrites the rate-limit store file with the current data. */
function writeRateLimitStore($handle, array $store): void
{
    rewind($handle);
    ftruncate($handle, 0);
    fwrite($handle, json_encode($store));
}

/**
 * Builds and sends the notification email for a validated contact submission,
 * authenticating directly with the mailbox's own SMTP server. Plain mail()
 * is unreliable on shared hosting (often blocked or spam-filtered), so this
 * logs in like a real mail client instead of relying on the server's sendmail.
 */
function sendNotificationEmail(array $data): bool
{
    $name = trim((string) $data['name']);
    $email = trim((string) $data['email']);
    $message = trim((string) $data['message']);

    $subject = '=?UTF-8?B?' . base64_encode('Kontaktformular: ' . $name) . '?=';
    $body = "Name: {$name}\nE-Mail: {$email}\n\nNachricht:\n{$message}\n";

    $config = require __DIR__ . '/smtp-config.php';
    return sendViaSmtp($config, $subject, $body, $email);
}

/** Opens an SMTP connection, runs the full send conversation, and closes it. */
function sendViaSmtp(array $config, string $subject, string $body, string $replyTo): bool
{
    $socket = @fsockopen($config['host'], $config['port'], $errno, $errstr, 10);
    if ($socket === false) {
        return false;
    }
    stream_set_timeout($socket, 10);
    $ok = runSmtpConversation($socket, $config, $subject, $body, $replyTo);
    fclose($socket);
    return $ok;
}

/** Runs the STARTTLS + AUTH LOGIN + message handshake against an open SMTP socket. */
function runSmtpConversation($socket, array $config, string $subject, string $body, string $replyTo): bool
{
    if (readSmtpResponse($socket) !== 220) {
        return false;
    }
    if (!negotiateStartTls($socket)) {
        return false;
    }
    if (!authenticateSmtp($socket, $config['username'], $config['password'])) {
        return false;
    }
    return sendSmtpMessage($socket, $config['username'], $subject, $body, $replyTo);
}

/** Upgrades the plaintext connection to TLS via STARTTLS, then re-greets the server. */
function negotiateStartTls($socket): bool
{
    if (sendSmtpCommand($socket, 'EHLO andreaskissner.dev') !== 250) {
        return false;
    }
    if (sendSmtpCommand($socket, 'STARTTLS') !== 220) {
        return false;
    }
    if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
        return false;
    }
    return sendSmtpCommand($socket, 'EHLO andreaskissner.dev') === 250;
}

/** Logs in with AUTH LOGIN, sending the base64-encoded username and password. */
function authenticateSmtp($socket, string $username, string $password): bool
{
    if (sendSmtpCommand($socket, 'AUTH LOGIN') !== 334) {
        return false;
    }
    if (sendSmtpCommand($socket, base64_encode($username)) !== 334) {
        return false;
    }
    return sendSmtpCommand($socket, base64_encode($password)) === 235;
}

/** Sends MAIL FROM/RCPT TO/DATA and the message itself, then QUITs. */
function sendSmtpMessage($socket, string $from, string $subject, string $body, string $replyTo): bool
{
    if (sendSmtpCommand($socket, "MAIL FROM:<{$from}>") !== 250) {
        return false;
    }
    if (sendSmtpCommand($socket, 'RCPT TO:<' . RECIPIENT_EMAIL . '>') !== 250) {
        return false;
    }
    if (sendSmtpCommand($socket, 'DATA') !== 354) {
        return false;
    }
    $message = buildSmtpMessage($from, $subject, $body, $replyTo);
    $sent = sendSmtpCommand($socket, $message . "\r\n.") === 250;
    sendSmtpCommand($socket, 'QUIT');
    return $sent;
}

/** Assembles the raw RFC 5322 message: headers, blank line, then the body. */
function buildSmtpMessage(string $from, string $subject, string $body, string $replyTo): string
{
    $escapedBody = str_replace("\n.", "\n..", $body);
    $headers = implode("\r\n", [
        'From: ' . $from,
        'To: ' . RECIPIENT_EMAIL,
        'Reply-To: ' . $replyTo,
        'Subject: ' . $subject,
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8'
    ]);
    return $headers . "\r\n\r\n" . $escapedBody;
}

/** Sends one SMTP command line (CRLF-terminated) and returns the response status code. */
function sendSmtpCommand($socket, string $command): int
{
    fwrite($socket, $command . "\r\n");
    return readSmtpResponse($socket);
}

/** Reads one full SMTP response, following multi-line continuations, and returns its status code. */
function readSmtpResponse($socket): int
{
    $code = 0;
    while (($line = fgets($socket, 515)) !== false) {
        $code = (int) substr($line, 0, 3);
        if (!isset($line[3]) || $line[3] !== '-') {
            break;
        }
    }
    return $code;
}
