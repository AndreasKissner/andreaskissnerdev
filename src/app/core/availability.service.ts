import { DestroyRef, Injectable, inject, signal } from '@angular/core';

const SWISS_TIME_FORMATTER = new Intl.DateTimeFormat('de-CH', {
  timeZone: 'Europe/Zurich',
  hour: '2-digit',
  minute: '2-digit'
});

/**
 * Exposes a live Swiss local time and a manually configured availability flag.
 */
@Injectable({ providedIn: 'root' })
export class AvailabilityService {
  private readonly destroyRef = inject(DestroyRef);
  readonly isAvailable = signal(true);
  readonly swissTime = signal(SWISS_TIME_FORMATTER.format(new Date()));

  constructor() {
    const intervalId = setInterval(() => {
      this.swissTime.set(SWISS_TIME_FORMATTER.format(new Date()));
    }, 1000);
    this.destroyRef.onDestroy(() => clearInterval(intervalId));
  }
}
