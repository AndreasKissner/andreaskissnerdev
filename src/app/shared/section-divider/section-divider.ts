import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Continuous wavy line used instead of a plain border to separate page
 * sections. Flattens the brand wave artwork into a thin full-width strip.
 */
@Component({
  selector: 'app-section-divider',
  templateUrl: './section-divider.html',
  styleUrl: './section-divider.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionDividerComponent {}
