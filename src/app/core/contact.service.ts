import { Injectable } from '@angular/core';

export interface ContactPayload {
  readonly name: string;
  readonly email: string;
  readonly message: string;
  readonly honeypot: string;
}

const CONTACT_ENDPOINT = '/contact.php';

/**
 * Sends contact form submissions to the server-side PHP endpoint.
 */
@Injectable({ providedIn: 'root' })
export class ContactService {
  /** Posts the contact payload and resolves once the server has accepted it. */
  async send(payload: ContactPayload): Promise<void> {
    const response = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Contact request failed with status ${response.status}`);
    }
  }
}
