import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AvailabilityService } from '../../core/availability.service';

/**
 * Hero section: primary value proposition, call-to-action and live availability badge.
 */
@Component({
  selector: 'app-hero',
  imports: [TranslatePipe],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent {
  protected readonly availability = inject(AvailabilityService);
}
