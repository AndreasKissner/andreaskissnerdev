import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { InfoModalComponent } from '../../shared/info-modal/info-modal';
import { MagneticDirective } from '../../shared/magnetic.directive';
import { SectionDividerComponent } from '../../shared/section-divider/section-divider';

const DEMO_URL = 'https://restaurantdemo.andreaskissner.dev/';

/** Demo section: showcases the self-built restaurant demo site with its key features. */
@Component({
  selector: 'app-demo',
  imports: [TranslatePipe, InfoModalComponent, MagneticDirective, SectionDividerComponent],
  templateUrl: './demo.html',
  styleUrl: './demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoComponent {
  protected readonly demoUrl = DEMO_URL;
  protected readonly isCmsInfoOpen = signal(false);

  /** Opens the explainer modal for how a content management system works. */
  protected openCmsInfo(): void {
    this.isCmsInfoOpen.set(true);
  }

  /** Closes the CMS explainer modal. */
  protected closeCmsInfo(): void {
    this.isCmsInfoOpen.set(false);
  }
}
