import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionDividerComponent } from '../../shared/section-divider/section-divider';
import { MagneticDirective } from '../../shared/magnetic.directive';

/** Pricing section: transparent starting price instead of "price on request". */
@Component({
  selector: 'app-pricing',
  imports: [TranslatePipe, SectionDividerComponent, MagneticDirective],
  templateUrl: './pricing.html',
  styleUrl: './pricing.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PricingComponent {}
