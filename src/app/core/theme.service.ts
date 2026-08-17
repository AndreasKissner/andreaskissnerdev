import { Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { runWithViewTransition } from './view-transition';

export type ThemePreference = 'dark' | 'light' | 'system';

const STORAGE_KEY = 'theme';

/**
 * Manages the light/dark theme preference: detection, persistence and toggling.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly preference = signal<ThemePreference>(this.readStoredPreference());

  constructor() {
    effect(() => this.applyPreference(this.preference()));
  }

  /** Cycles between dark, light and system preference. */
  toggle(): void {
    const order: ThemePreference[] = ['dark', 'light', 'system'];
    const next = order[(order.indexOf(this.preference()) + 1) % order.length];
    runWithViewTransition(() => this.preference.set(next));
  }

  private applyPreference(preference: ThemePreference): void {
    if (!this.isBrowser) {
      return;
    }
    const root = document.documentElement;
    if (preference === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', preference);
    }
    localStorage.setItem(STORAGE_KEY, preference);
  }

  private readStoredPreference(): ThemePreference {
    if (!this.isBrowser) {
      return 'dark';
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'dark' || stored === 'light' || stored === 'system' ? stored : 'dark';
  }
}
