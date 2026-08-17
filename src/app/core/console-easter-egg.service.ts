import { Injectable, effect, inject } from '@angular/core';
import { ConsentService } from './consent.service';

const BRAND_STYLE = 'color:#ff5a1f;font-weight:700;font-size:14px;';
const TEXT_STYLE = 'color:inherit;font-weight:400;';
const GRANTED_STYLE = 'color:#34d399;font-weight:700;';
const DENIED_STYLE = 'color:#e05a4f;font-weight:700;';
const UNDECIDED_STYLE = 'color:#9a978f;font-weight:700;';

/**
 * Prints a small, styled console message for visiting developers, showing
 * the current Google Analytics consent state — a playful nod instead of a
 * visible on-page badge.
 */
@Injectable({ providedIn: 'root' })
export class ConsoleEasterEggService {
  private readonly consent = inject(ConsentService);

  constructor() {
    effect(() => this.logStatus(this.consent.status()));
  }

  private logStatus(status: 'granted' | 'denied' | null): void {
    const [label, style] =
      status === 'granted'
        ? ['angenommen ✓', GRANTED_STYLE]
        : status === 'denied'
          ? ['abgelehnt ✕', DENIED_STYLE]
          : ['noch nicht entschieden …', UNDECIDED_STYLE];

    console.log(
      `%cHey, Entwickler:in! 👋%c\nGoogle Analytics: %c${label}`,
      BRAND_STYLE,
      TEXT_STYLE,
      style
    );
  }
}
