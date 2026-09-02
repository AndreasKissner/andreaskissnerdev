import { Injectable } from '@angular/core';

export interface ContactPayload {
  readonly name: string;
  readonly email: string;
  readonly message: string;
  readonly honeypot: string;
  readonly turnstileToken: string;
  readonly language: string;
}

export type ContactErrorCode =
  | 'rate_limited'
  | 'validation_failed'
  | 'forbidden_origin'
  | 'captcha_failed'
  | 'send_failed'
  | 'network';

/** Thrown when a contact submission fails, carrying a machine-readable reason. */
export class ContactSendError extends Error {
  constructor(readonly code: ContactErrorCode) {
    super(`Contact request failed: ${code}`);
  }
}

const CONTACT_ENDPOINT = '/contact.php';

/**
 * Sends contact form submissions to the server-side PHP endpoint.
 */
@Injectable({ providedIn: 'root' })
export class ContactService {
  /** Posts the contact payload and resolves once the server has accepted it. */
  async send(payload: ContactPayload): Promise<void> {
    const response = await this.postPayload(payload);
    if (!response.ok) {
      throw new ContactSendError(await this.readErrorCode(response));
    }
  }

  /** Performs the fetch itself, translating a network-level failure into a typed error. */
  private async postPayload(payload: ContactPayload): Promise<Response> {
    try {
      return await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch {
      throw new ContactSendError('network');
    }
  }

  /** Extracts the backend's error code from the response body, falling back to a generic one. */
  private async readErrorCode(response: Response): Promise<ContactErrorCode> {
    const knownCodes: readonly ContactErrorCode[] = [
      'rate_limited',
      'validation_failed',
      'forbidden_origin',
      'captcha_failed',
      'send_failed'
    ];
    try {
      const body: { error?: string } = await response.json();
      return knownCodes.find((code) => code === body.error) ?? 'network';
    } catch {
      return 'network';
    }
  }
}
