import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TiltDirective } from '../../shared/tilt.directive';

const SLIDER_INTERVAL_MS = 2400;
const SLIDER_IMAGE_COUNT = 4;

type ServiceIllustration = 'websites-slider' | 'redesign' | 'tools' | 'privacy';

interface ServiceItem {
  readonly titleKey: string;
  readonly textKey: string;
  readonly detailKey: string;
  readonly illustration: ServiceIllustration;
}

const SERVICE_ITEMS: readonly ServiceItem[] = [
  { titleKey: 'SERVICES.ITEM_1_TITLE', textKey: 'SERVICES.ITEM_1_TEXT', detailKey: 'SERVICES.ITEM_1_DETAIL', illustration: 'websites-slider' },
  { titleKey: 'SERVICES.ITEM_2_TITLE', textKey: 'SERVICES.ITEM_2_TEXT', detailKey: 'SERVICES.ITEM_2_DETAIL', illustration: 'redesign' },
  { titleKey: 'SERVICES.ITEM_3_TITLE', textKey: 'SERVICES.ITEM_3_TEXT', detailKey: 'SERVICES.ITEM_3_DETAIL', illustration: 'tools' },
  { titleKey: 'SERVICES.ITEM_4_TITLE', textKey: 'SERVICES.ITEM_4_TEXT', detailKey: 'SERVICES.ITEM_4_DETAIL', illustration: 'privacy' }
];

/**
 * Services section listing the offered business services as cards, each
 * revealing a more detailed explanation on hover or keyboard focus. The
 * first card cycles through placeholder slider images.
 */
@Component({
  selector: 'app-services',
  imports: [TranslatePipe, TiltDirective],
  templateUrl: './services.html',
  styleUrl: './services.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesComponent {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly items = SERVICE_ITEMS;
  protected readonly sliderImages = Array.from({ length: SLIDER_IMAGE_COUNT }, (_, i) => i);
  protected readonly sliderIndex = signal(0);
  private readonly prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  constructor() {
    if (this.prefersReducedMotion) {
      return;
    }
    const intervalId = setInterval(() => this.advanceSlider(), SLIDER_INTERVAL_MS);
    this.destroyRef.onDestroy(() => clearInterval(intervalId));
  }

  /** Advances the placeholder slider on the first service card to the next image. */
  private advanceSlider(): void {
    this.sliderIndex.update((index) => (index + 1) % SLIDER_IMAGE_COUNT);
  }
}
