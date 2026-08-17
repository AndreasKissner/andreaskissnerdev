import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Measures the page's own load time via the Navigation Timing API,
 * as a live, honest proof point instead of a marketing claim.
 */
@Injectable({ providedIn: 'root' })
export class PerformanceService {
  readonly loadTimeMs = signal<number | null>(null);

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) {
      return;
    }
    if (document.readyState === 'complete') {
      this.measure();
    } else {
      // loadEventEnd is only stamped once the load event finishes dispatching,
      // so it still reads 0 inside a synchronous 'load' listener (MDN-documented
      // quirk) — deferring one tick lets the browser finalize the timestamp first.
      window.addEventListener('load', () => setTimeout(() => this.measure()), { once: true });
    }
  }

  private measure(): void {
    const [entry] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (entry) {
      this.loadTimeMs.set(Math.round(entry.loadEventEnd));
    }
  }
}
