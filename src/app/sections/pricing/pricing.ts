import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { InfoModalComponent } from '../../shared/info-modal/info-modal';
import { SectionDividerComponent } from '../../shared/section-divider/section-divider';
import { MagneticDirective } from '../../shared/magnetic.directive';
import { TiltDirective } from '../../shared/tilt.directive';

/** Pricing section: transparent starting price instead of "price on request". */
@Component({
  selector: 'app-pricing',
  imports: [TranslatePipe, SectionDividerComponent, MagneticDirective, InfoModalComponent, TiltDirective],
  templateUrl: './pricing.html',
  styleUrl: './pricing.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PricingComponent {
  protected readonly isFormatsInfoOpen = signal(false);
  protected readonly isWebappExamplesOpen = signal(false);
  protected readonly isPricingExplainerOpen = signal(false);

  /** Opens the modal explaining website vs. landing page vs. webapp. */
  protected openFormatsInfo(): void {
    this.isFormatsInfoOpen.set(true);
  }

  /** Closes the formats explanation modal. */
  protected closeFormatsInfo(): void {
    this.isFormatsInfoOpen.set(false);
  }

  /** Opens the modal listing example projects for the entry-level webapp price. */
  protected openWebappExamples(): void {
    this.isWebappExamplesOpen.set(true);
  }

  /** Closes the webapp examples modal. */
  protected closeWebappExamples(): void {
    this.isWebappExamplesOpen.set(false);
  }

  /** Opens the modal explaining what factors influence the final price. */
  protected openPricingExplainer(): void {
    this.isPricingExplainerOpen.set(true);
  }

  /** Closes the pricing explainer modal. */
  protected closePricingExplainer(): void {
    this.isPricingExplainerOpen.set(false);
  }
}
