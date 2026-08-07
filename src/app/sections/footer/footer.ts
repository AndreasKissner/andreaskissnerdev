import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PerformanceService } from '../../core/performance.service';

/**
 * Site footer with legal links, copyright notice and a live load-time readout.
 */
@Component({
  selector: 'app-footer',
  imports: [TranslatePipe],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  protected readonly performance = inject(PerformanceService);
  protected readonly currentYear = new Date().getFullYear();
}
