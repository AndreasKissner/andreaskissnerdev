import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PwaService } from '../../core/pwa.service';
import { MagneticDirective } from '../../shared/magnetic.directive';
import { SectionDividerComponent } from '../../shared/section-divider/section-divider';

/** Result of the visitor's answer to the browser's install dialog. */
type InstallResult = 'idle' | 'accepted' | 'dismissed';

/**
 * Webapp section: demonstrates progressive web app capabilities live on this
 * page instead of describing them, using the visitor's own browser as proof.
 */
@Component({
  selector: 'app-webapp',
  imports: [TranslatePipe, MagneticDirective, SectionDividerComponent],
  templateUrl: './webapp.html',
  styleUrl: './webapp.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WebappComponent {
  private readonly pwa = inject(PwaService);

  protected readonly canInstall = this.pwa.canInstall;
  protected readonly isInstalled = this.pwa.isInstalled;
  protected readonly isOnline = this.pwa.isOnline;
  protected readonly isOfflineReady = this.pwa.isOfflineReady;
  protected readonly installResult = signal<InstallResult>('idle');

  /** Opens the browser's install dialog and records what the visitor chose. */
  protected async install(): Promise<void> {
    const accepted = await this.pwa.install();
    this.installResult.set(accepted ? 'accepted' : 'dismissed');
  }
}
