import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { EasterEggService } from '../../core/easter-egg.service';

const STAR_COUNT = 70;

/** A single star's position, size, and twinkle timing. */
interface Star {
  x: number;
  y: number;
  radius: number;
  delay: number;
  duration: number;
}

/**
 * Playful full-screen overlay: a rocket "takes off" through a starfield,
 * then reveals a joke 404 page. Purely decorative, dismissible at any time.
 */
@Component({
  selector: 'app-easter-egg',
  imports: [TranslatePipe],
  templateUrl: './easter-egg.html',
  styleUrl: './easter-egg.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EasterEggComponent {
  protected readonly easterEgg = inject(EasterEggService);
  protected readonly stars = this.generateStars();

  /** Creates a random starfield, regenerated each time the overlay opens. */
  private generateStars(): Star[] {
    return Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      radius: Math.random() * 1.2 + 0.8,
      delay: Math.random() * 4,
      duration: Math.random() * 2.5 + 2
    }));
  }
}
