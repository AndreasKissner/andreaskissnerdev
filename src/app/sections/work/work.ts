import { ChangeDetectionStrategy, Component, HostListener, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ShmDemoComponent } from '../../shared/shm-demo/shm-demo';
import { MagneticDirective } from '../../shared/magnetic.directive';
import { InfoModalComponent } from '../../shared/info-modal/info-modal';

const SWIPE_THRESHOLD_PX = 40;

/**
 * Work section: reference projects and portfolio link, presented as a
 * 3D coverflow carousel with the active card centered and neighbors
 * receding to the sides.
 */
@Component({
  selector: 'app-work',
  imports: [TranslatePipe, ShmDemoComponent, MagneticDirective, InfoModalComponent],
  templateUrl: './work.html',
  styleUrl: './work.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkComponent {
  protected readonly slideCount = 3;
  protected readonly activeIndex = signal(0);
  protected isCmsModalOpen = signal(false);

  private pointerStartX: number | null = null;

  /** Computes each slide's position offset relative to the active card, wrapping around the ends. */
  protected offsetFor(index: number): number {
    let diff = index - this.activeIndex();
    if (diff > this.slideCount / 2) {
      diff -= this.slideCount;
    } else if (diff < -this.slideCount / 2) {
      diff += this.slideCount;
    }
    return diff;
  }

  /** Moves the carousel to a specific slide index. */
  protected goToSlide(index: number): void {
    this.activeIndex.set(index);
  }

  /** Advances the carousel by one slide in the given direction, wrapping around at the ends. */
  protected step(direction: 1 | -1): void {
    const next = (this.activeIndex() + direction + this.slideCount) % this.slideCount;
    this.goToSlide(next);
  }

  @HostListener('pointerdown', ['$event'])
  protected onPointerDown(event: PointerEvent): void {
    this.pointerStartX = event.clientX;
  }

  @HostListener('pointerup', ['$event'])
  protected onPointerUp(event: PointerEvent): void {
    if (this.pointerStartX === null) {
      return;
    }
    const delta = event.clientX - this.pointerStartX;
    this.pointerStartX = null;

    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) {
      return;
    }
    this.step(delta < 0 ? 1 : -1);
  }

  protected openCmsModal(): void {
    this.isCmsModalOpen.set(true);
  }

  protected closeCmsModal(): void {
    this.isCmsModalOpen.set(false);
  }
}
