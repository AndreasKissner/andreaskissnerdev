import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ScrollStateService } from '../../core/scroll-state.service';

/** Floating rocket button that smooth-scrolls back to the top once the page has been scrolled. */
@Component({
  selector: 'app-back-to-top',
  imports: [TranslatePipe],
  templateUrl: './back-to-top.html',
  styleUrl: './back-to-top.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackToTopComponent {
  protected readonly scrollState = inject(ScrollStateService);
}
