import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionDividerComponent } from '../../shared/section-divider/section-divider';
import { MagneticDirective } from '../../shared/magnetic.directive';

/** About section: a short personal introduction with a link to the full portfolio. */
@Component({
  selector: 'app-about',
  imports: [TranslatePipe, SectionDividerComponent, MagneticDirective],
  templateUrl: './about.html',
  styleUrl: './about.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {}
