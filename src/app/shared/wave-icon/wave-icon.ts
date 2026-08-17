import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Small decorative squiggle used as a playful stand-in for a plain dash
 * or middle dot wherever text is visually separated, not punctuated.
 */
@Component({
  selector: 'app-wave-icon',
  templateUrl: './wave-icon.html',
  styleUrl: './wave-icon.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WaveIconComponent {}
