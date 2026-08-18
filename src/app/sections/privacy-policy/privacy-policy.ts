import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionDividerComponent } from '../../shared/section-divider/section-divider';
import { ConsentService } from '../../core/consent.service';
import { SeoService } from '../../core/seo.service';

/**
 * Privacy policy section required under nDSG/GDPR, covering hosting,
 * the contact form and consent-gated Google Analytics.
 */
@Component({
  selector: 'app-privacy-policy',
  imports: [TranslatePipe, RouterLink, SectionDividerComponent],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivacyPolicyComponent {
  protected readonly consent = inject(ConsentService);

  constructor() {
    inject(SeoService).setPage('SEO.PRIVACY_TITLE', 'SEO.PRIVACY_DESCRIPTION');
  }

  /** Clears the stored cookie decision so the consent banner reappears. */
  protected changeCookieSettings(): void {
    this.consent.reset();
  }
}
