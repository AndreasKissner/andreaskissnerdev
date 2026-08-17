import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PerformanceService } from '../../core/performance.service';
import { InfoModalComponent } from '../../shared/info-modal/info-modal';
import { contrastRatio } from '../../shared/contrast';
import { SectionDividerComponent } from '../../shared/section-divider/section-divider';

const AA_TEXT_THRESHOLD = 4.5;

/** A selectable vision-impairment simulation type, or 'none' for the default view. */
export type VisionFilter = 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia' | 'grayscale';

/**
 * "Quality you can see" section, presented as a page-flip book of four
 * live, honest proof points instead of marketing claims.
 */
@Component({
  selector: 'app-quality',
  imports: [TranslatePipe, InfoModalComponent, SectionDividerComponent],
  templateUrl: './quality.html',
  styleUrl: './quality.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QualityComponent {
  protected readonly performance = inject(PerformanceService);
  protected readonly isA11yInfoOpen = signal(false);
  protected readonly isWcagInfoOpen = signal(false);
  protected readonly isSpeedInfoOpen = signal(false);
  protected readonly isPrivacyInfoOpen = signal(false);
  protected readonly activeFilter = signal<VisionFilter>('none');
  protected readonly spreadIndex = signal(0);
  protected readonly spreadCount = 3;
  protected readonly textColor = signal('#ede9e2');
  protected readonly bgColor = signal('#14171c');

  protected readonly filterOptions: VisionFilter[] = [
    'none',
    'deuteranopia',
    'protanopia',
    'tritanopia',
    'grayscale'
  ];

  protected readonly ratio = computed(() => contrastRatio(this.textColor(), this.bgColor()));
  protected readonly passesAA = computed(() => this.ratio() >= AA_TEXT_THRESHOLD);

  /** Switches the active vision-impairment simulation shown on the preview card. */
  protected selectFilter(filter: VisionFilter): void {
    this.activeFilter.set(filter);
  }

  /** Flips the book to the given spread, clamped to the valid range. */
  protected goToSpread(index: number): void {
    this.spreadIndex.set(Math.min(Math.max(index, 0), this.spreadCount - 1));
  }

  protected setTextColor(value: string): void {
    this.textColor.set(value);
  }

  protected setBgColor(value: string): void {
    this.bgColor.set(value);
  }

  protected openA11yInfo(): void {
    this.isA11yInfoOpen.set(true);
  }

  protected closeA11yInfo(): void {
    this.isA11yInfoOpen.set(false);
  }

  protected openWcagInfo(): void {
    this.isWcagInfoOpen.set(true);
  }

  protected closeWcagInfo(): void {
    this.isWcagInfoOpen.set(false);
  }

  protected openSpeedInfo(): void {
    this.isSpeedInfoOpen.set(true);
  }

  protected closeSpeedInfo(): void {
    this.isSpeedInfoOpen.set(false);
  }

  protected openPrivacyInfo(): void {
    this.isPrivacyInfoOpen.set(true);
  }

  protected closePrivacyInfo(): void {
    this.isPrivacyInfoOpen.set(false);
  }
}
