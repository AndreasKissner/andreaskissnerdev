import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Small animated heartbeat-line icon used to signal "live" status,
 * replacing a plain dot with something more distinctive.
 */
@Component({
  selector: 'app-live-indicator',
  templateUrl: './live-indicator.html',
  styleUrl: './live-indicator.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LiveIndicatorComponent {}
