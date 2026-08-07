import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AvailabilityService } from '../../core/availability.service';
import { PerformanceService } from '../../core/performance.service';
import { ThemeService } from '../../core/theme.service';
import { LanguageService } from '../../core/language.service';
import { MagneticDirective } from '../../shared/magnetic.directive';
import { EasterEggService } from '../../core/easter-egg.service';
import { LiveIndicatorComponent } from '../../shared/live-indicator/live-indicator';

/**
 * Hero section: value proposition, primary call-to-action and a live status
 * panel showing real, measured data instead of a decorative second button.
 */
@Component({
  selector: 'app-hero',
  imports: [TranslatePipe, MagneticDirective, LiveIndicatorComponent],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent {
  protected readonly availability = inject(AvailabilityService);
  protected readonly performance = inject(PerformanceService);
  protected readonly themeService = inject(ThemeService);
  protected readonly languageService = inject(LanguageService);
  protected readonly easterEgg = inject(EasterEggService);
}
