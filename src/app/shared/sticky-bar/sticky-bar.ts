import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AvailabilityService } from '../../core/availability.service';
import { ScrollStateService } from '../../core/scroll-state.service';
import { MagneticDirective } from '../magnetic.directive';
import { LogoMarkComponent } from '../logo-mark/logo-mark';
import { LiveIndicatorComponent } from '../live-indicator/live-indicator';
import { WaveIconComponent } from '../wave-icon/wave-icon';

/**
 * Slim status bar that replaces the header once the hero is scrolled past,
 * keeping the live availability proof and contact CTA reachable.
 */
@Component({
  selector: 'app-sticky-bar',
  imports: [TranslatePipe, MagneticDirective, LogoMarkComponent, LiveIndicatorComponent, WaveIconComponent],
  templateUrl: './sticky-bar.html',
  styleUrl: './sticky-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StickyBarComponent {
  protected readonly availability = inject(AvailabilityService);
  protected readonly scrollState = inject(ScrollStateService);
}
