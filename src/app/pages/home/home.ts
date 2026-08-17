import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HeroComponent } from '../../sections/hero/hero';
import { ServicesComponent } from '../../sections/services/services';
import { PricingComponent } from '../../sections/pricing/pricing';
import { QualityComponent } from '../../sections/quality/quality';
import { WorkComponent } from '../../sections/work/work';
import { ContactComponent } from '../../sections/contact/contact';
import { SeoService } from '../../core/seo.service';

/** One-pager home route: hero, services, quality, work and contact sections. */
@Component({
  selector: 'app-home',
  imports: [HeroComponent, ServicesComponent, PricingComponent, QualityComponent, WorkComponent, ContactComponent],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  constructor() {
    inject(SeoService).setPage('SEO.HOME_TITLE', 'SEO.HOME_DESCRIPTION');
  }
}
