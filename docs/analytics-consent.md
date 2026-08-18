# Google Analytics 4 + Cookie Consent — Fehlerbericht & Fix

## Symptome (vor dem Fix)

- `gtag.js` lädt (Status 200), keine Konsolen-Fehler
- `window.dataLayer` enthält scheinbar alle Befehle (`js`, `config`)
- Die Bibliothek initialisiert sich sichtbar (kein Fehler, kein Warning)
- **Aber:** nie ein Request an `google-analytics.com/g/collect`, keine `_ga`-Cookies, GA4-Realtime-Bericht dauerhaft 0

Nicht die Ursache (einzeln ausgeschlossen): Werbeblocker, Browser-Tracking-Schutz, Consent-Mode-Signale, Service Worker, junge GA4-Property.

## Ursache 1 — der eigentliche Bug

`gtag.js` verarbeitet **nur echte `arguments`-Objekte** im `dataLayer` als Befehle. Ein normales Array wird lautlos ignoriert — kein Fehler, die Bibliothek initialisiert sich trotzdem vollständig, deshalb sah alles funktionsfähig aus.

**Vorher (kaputt), in `src/app/core/analytics.service.ts`:**

```ts
const gtag = (...args: unknown[]) => window.dataLayer.push(args);
// ...args erzeugt ein ARRAY -> jeder Befehl wird ignoriert
```

**Fix — exakt wie Googles offizielles Snippet:**

```ts
function gtagCommand(..._args: unknown[]): void {
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(arguments); // "arguments", NICHT das Array
}
```

Muss eine echte `function` sein, keine Arrow-Function — die hat kein eigenes `arguments`-Objekt.

**Wichtig fürs Testen:** Auch manuelle Konsolen-Tests wie `window.dataLayer.push(['event', 'test'])` sind Arrays und werden genauso ignoriert. Damit lässt sich die Einbindung **nicht** verifizieren.

## Ursache 2 — Cookie-Löschung beim Widerruf war wirkungslos

Beim Entfernen eines Cookies muss der `domain`-Parameter exakt zu dem passen, mit dem es gesetzt wurde — sonst legt der Browser ein zweites, sofort abgelaufenes Cookie an, während das echte unangetastet bleibt.

**Fix** in `AnalyticsService.deleteAnalyticsCookies()`: löscht jedes `_ga*`-Cookie über alle plausiblen Domain-Varianten (ohne Domain, `hostname`, `.apex-domain`, `apex-domain`), ausgelöst sobald der Consent-Status auf `'denied'` wechselt.

## Verlässliche Testkette

Reihenfolge einhalten, nicht nur Skript-Ladevorgang prüfen:

1. **DevTools → Netzwerk-Tab, Filter "collect"** → nach "Akzeptieren" muss ein Request an `region1.google-analytics.com/g/collect...` erscheinen
2. **Konsole:** `document.cookie.split(';').some(c => c.trim().startsWith('_ga'))` → muss `true` sein
3. Auf `/datenschutz` → "Cookie-Einstellungen ändern" → "Ablehnen" → Schritt 2 sofort wiederholen → muss jetzt `false` sein
4. **Google Analytics → Berichte → Echtzeit** → aktiver Nutzer erscheint (10–30s Verzögerung)

## Verifiziert am 2026-08-17 auf andreaskissner.dev

- ✅ Test 1: Request an `/g/collect` mit korrekten Page-View-Daten bestätigt (echte Produktions-URL gesehen)
- ✅ Test 2: `_ga`-Cookie nach Zustimmung vorhanden (`true`)
- ✅ Test 3: `_ga`-Cookie nach Ablehnung entfernt (`false`)
- ⏳ Test 4: Bestätigung im GA4-Realtime-Bericht — in Arbeit

## Betroffene Datei

`src/app/core/analytics.service.ts`
