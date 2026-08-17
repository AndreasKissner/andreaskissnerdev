import { Injectable, effect, inject } from '@angular/core';
import { ConsentService } from './consent.service';

const GA_MEASUREMENT_ID = 'G-GRVR8YTEBB';

declare global {
  interface Window {
    dataLayer: unknown[];
  }
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
      if (this.consent.status() === 'granted') {
        this.loadGoogleAnalytics();
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
    const gtag = (...args: unknown[]) => window.dataLayer.push(args);
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);
  }
}
