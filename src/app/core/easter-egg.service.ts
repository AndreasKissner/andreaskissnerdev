import { Injectable, signal } from '@angular/core';

/**
 * Tracks whether the playful "take off" Easter egg overlay is showing.
 */
@Injectable({ providedIn: 'root' })
export class EasterEggService {
  readonly isLaunched = signal(false);

  /** Shows the Easter egg overlay. */
  launch(): void {
    this.isLaunched.set(true);
  }

  /** Reloads the page for real, restoring the actual site from scratch. */
  land(): void {
    window.location.reload();
  }
}
