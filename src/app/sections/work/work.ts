import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ShmDemoComponent } from '../../shared/shm-demo/shm-demo';
import { MagneticDirective } from '../../shared/magnetic.directive';

/**
 * Work section: reference projects and a link out to the full portfolio.
 */
@Component({
  selector: 'app-work',
  imports: [TranslatePipe, ShmDemoComponent, MagneticDirective],
  templateUrl: './work.html',
  styleUrl: './work.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkComponent {}
