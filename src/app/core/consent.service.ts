import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ConsentStatus = 'granted' | 'denied' | null;

const STORAGE_KEY = 'analytics-consent';

/**
 * Tracks the visitor's decision on analytics cookies. Nothing is loaded
 * until this is explicitly 'granted' — the default is null (undecided).
 */
@Injectable({ providedIn: 'root' })
export class ConsentService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly status = signal<ConsentStatus>(this.readStored());

  /** Records the visitor's choice and persists it for future visits. */
  setStatus(status: 'granted' | 'denied'): void {
    this.status.set(status);
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEY, status);
    }
  }

  /** Clears the stored decision so the banner can be shown again. */
  reset(): void {
    this.status.set(null);
    if (this.isBrowser) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  private readStored(): ConsentStatus {
    if (!this.isBrowser) {
      return null;
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'granted' || stored === 'denied' ? stored : null;
  }
}
