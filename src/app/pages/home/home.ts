import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HeroComponent } from '../../sections/hero/hero';
import { ServicesComponent } from '../../sections/services/services';
import { PricingComponent } from '../../sections/pricing/pricing';
import { QualityComponent } from '../../sections/quality/quality';
import { WebappComponent } from '../../sections/webapp/webapp';
import { WorkComponent } from '../../sections/work/work';
import { AboutComponent } from '../../sections/about/about';
import { ContactComponent } from '../../sections/contact/contact';
import { SeoService } from '../../core/seo.service';

/** One-pager home route: hero, services, quality, webapp, work, about and contact sections. */
@Component({
  selector: 'app-home',
  imports: [
    HeroComponent,
    ServicesComponent,
    PricingComponent,
    QualityComponent,
    WebappComponent,
    WorkComponent,
    AboutComponent,
    ContactComponent
  ],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  constructor() {
    const seo = inject(SeoService);
    seo.setPage('SEO.HOME_TITLE', 'SEO.HOME_DESCRIPTION');
    seo.injectPersonSchema();
  }
}
