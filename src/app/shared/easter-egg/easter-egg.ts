import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { EasterEggService } from '../../core/easter-egg.service';

/**
 * Playful full-screen overlay: a rocket "takes off", then reveals a
 * joke 404 page. Purely decorative, dismissible at any time.
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
}
