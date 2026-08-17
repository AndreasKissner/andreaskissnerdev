import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ConsentService } from '../../core/consent.service';
import { InfoModalComponent } from '../info-modal/info-modal';

/**
 * Cookie consent banner shown until the visitor makes a choice. Nothing is
 * tracked before 'accept' is pressed.
 */
@Component({
  selector: 'app-cookie-banner',
  imports: [TranslatePipe, InfoModalComponent],
  templateUrl: './cookie-banner.html',
  styleUrl: './cookie-banner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CookieBannerComponent {
  private readonly consent = inject(ConsentService);

  protected readonly isVisible = computed(() => this.consent.status() === null);
  protected readonly isInfoOpen = signal(false);

  /** Grants analytics consent and hides the banner. */
  protected accept(): void {
    this.consent.setStatus('granted');
  }

  /** Declines analytics consent and hides the banner. */
  protected decline(): void {
    this.consent.setStatus('denied');
  }

  /** Opens the explainer modal describing what cookies are and why the choice matters. */
  protected openInfo(): void {
    this.isInfoOpen.set(true);
  }

  /** Closes the explainer modal. */
  protected closeInfo(): void {
    this.isInfoOpen.set(false);
  }
}
