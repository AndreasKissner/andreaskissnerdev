import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionDividerComponent } from '../../shared/section-divider/section-divider';
import { SeoService } from '../../core/seo.service';

/**
 * Imprint section required by Swiss law. Placeholder copy until the final
 * legal text is provided.
 */
@Component({
  selector: 'app-imprint',
  imports: [TranslatePipe, RouterLink, SectionDividerComponent],
  templateUrl: './imprint.html',
  styleUrl: './imprint.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImprintComponent {
  constructor() {
    inject(SeoService).setPage('SEO.IMPRINT_TITLE', 'SEO.IMPRINT_DESCRIPTION');
  }
}
