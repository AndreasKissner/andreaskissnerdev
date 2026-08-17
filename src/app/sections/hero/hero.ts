import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AvailabilityService } from '../../core/availability.service';
import { PerformanceService } from '../../core/performance.service';
import { ThemeService } from '../../core/theme.service';
import { LanguageService } from '../../core/language.service';
import { EasterEggService } from '../../core/easter-egg.service';
import { ConsentService } from '../../core/consent.service';
import { LiveIndicatorComponent } from '../../shared/live-indicator/live-indicator';
import { SectionDividerComponent } from '../../shared/section-divider/section-divider';
import { InfoModalComponent } from '../../shared/info-modal/info-modal';

const LOAD_BAR_SCALE_MS = 3000;

/**
 * Hero section: value proposition and a live status panel showing real,
 * measured data instead of a decorative second button.
 */
@Component({
  selector: 'app-hero',
  imports: [TranslatePipe, LiveIndicatorComponent, SectionDividerComponent, InfoModalComponent],
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
  protected readonly consent = inject(ConsentService);
  protected readonly isCookieInfoOpen = signal(false);

  private readonly router = inject(Router);

  /** Maps the measured load time to a 0-100 bar fill, capped at {@link LOAD_BAR_SCALE_MS}. */
  protected readonly loadBarPercent = computed(() => {
    const ms = this.performance.loadTimeMs();
    if (ms === null) {
      return 0;
    }
    return Math.min(100, Math.round((ms / LOAD_BAR_SCALE_MS) * 100));
  });

  /** Navigates to the privacy page's cookie section. */
  protected goToCookieSettings(): void {
    this.router.navigate(['/datenschutz'], { fragment: 'privacy-cookies' });
  }

  /** Opens the cookie explainer modal without triggering the card's navigation. */
  protected openCookieInfo(event: Event): void {
    event.stopPropagation();
    this.isCookieInfoOpen.set(true);
  }

  /** Closes the cookie explainer modal. */
  protected closeCookieInfo(): void {
    this.isCookieInfoOpen.set(false);
  }
}
