import { Injectable, effect, inject } from '@angular/core';
import { ConsentService } from './consent.service';

const GA_MEASUREMENT_ID = 'G-GRVR8YTEBB';

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

/**
 * Pushes a gtag.js command onto the dataLayer. Must be a real `function` (not
 * an arrow function) so `arguments` is its own array-like object, not a rest
 * parameter — gtag.js only recognises commands pushed as `arguments`; a plain
 * array is silently ignored, which is why this needs to look exactly like
 * Google's own snippet.
 */
function gtagCommand(..._args: unknown[]): void {
  window.dataLayer = window.dataLayer ?? [];
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

/**
 * Loads Google Analytics only once the visitor has granted consent and a
 * measurement ID has been configured. Never loads anything before that.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly consent = inject(ConsentService);
  private isLoaded = false;

  constructor() {
    effect(() => {
      const status = this.consent.status();
      if (status === 'granted') {
        this.loadGoogleAnalytics();
      } else if (status === 'denied') {
        this.deleteAnalyticsCookies();
      }
    });
  }

  private loadGoogleAnalytics(): void {
    if (this.isLoaded || !GA_MEASUREMENT_ID) {
      return;
    }
    this.isLoaded = true;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    gtagCommand('js', new Date());
    gtagCommand('config', GA_MEASUREMENT_ID);
  }

  /** Removes any _ga cookies left over from a previously granted session. */
  private deleteAnalyticsCookies(): void {
    const gaCookieNames = document.cookie
      .split(';')
      .map((entry) => entry.split('=')[0].trim())
      .filter((name) => name.startsWith('_ga'));

    for (const name of gaCookieNames) {
      deleteCookieEverywhere(name);
    }
  }
}

/**
 * Deletes a cookie across every domain variant it could plausibly have been
 * set with. Clearing a cookie only works if the `domain` attribute matches
 * exactly what was used to set it, otherwise the browser just creates a new,
 * already-expired cookie alongside the untouched original.
 */
function deleteCookieEverywhere(name: string): void {
  const expired = 'expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
  const apex = location.hostname.replace(/^www\./, '');
  document.cookie = `${name}=; ${expired}`;
  document.cookie = `${name}=; ${expired}; domain=${location.hostname}`;
  document.cookie = `${name}=; ${expired}; domain=.${apex}`;
  document.cookie = `${name}=; ${expired}; domain=${apex}`;
}
