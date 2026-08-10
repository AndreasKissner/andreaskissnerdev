import { ChangeDetectionStrategy, Component } from '@angular/core';

let instanceCounter = 0;

/**
 * Animated EKG-style heartbeat-line icon used to signal "live" status,
 * with a glowing traveling pulse head instead of a plain dot.
 */
@Component({
  selector: 'app-live-indicator',
  templateUrl: './live-indicator.html',
  styleUrl: './live-indicator.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LiveIndicatorComponent {
  protected readonly glowFilterId = `live-indicator-glow-${instanceCounter++}`;
  protected readonly prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
}
