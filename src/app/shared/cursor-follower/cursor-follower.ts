import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  signal,
  viewChild
} from '@angular/core';

const LERP_FACTOR = 0.18;
const INTERACTIVE_SELECTOR = 'a, button, input, textarea, [role="button"]';

/**
 * A soft glowing dot that trails the cursor with a slight delay and grows
 * over interactive elements. Purely decorative: hidden on touch devices and
 * for visitors who prefer reduced motion.
 */
@Component({
  selector: 'app-cursor-follower',
  templateUrl: './cursor-follower.html',
  styleUrl: './cursor-follower.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CursorFollowerComponent implements OnDestroy {
  private readonly dot = viewChild<ElementRef<HTMLElement>>('dot');
  protected readonly enabled = this.supportsCursorFollower();
  protected readonly isHovering = signal(false);
  protected readonly hasMoved = signal(false);

  private targetX = 0;
  private targetY = 0;
  private currentX = 0;
  private currentY = 0;
  private frameId: number | null = null;

  constructor() {
    if (this.enabled) {
      this.frameId = requestAnimationFrame(() => this.tick());
    }
  }

  ngOnDestroy(): void {
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  /** Tracks the latest cursor position and whether it sits over something clickable. */
  @HostListener('document:mousemove', ['$event'])
  protected onMouseMove(event: MouseEvent): void {
    if (!this.enabled) {
      return;
    }
    this.targetX = event.clientX;
    this.targetY = event.clientY;
    this.hasMoved.set(true);
    const target = event.target as HTMLElement;
    this.isHovering.set(target.closest(INTERACTIVE_SELECTOR) !== null);
  }

  /** Eases the dot toward the cursor each frame, without triggering change detection. */
  private tick(): void {
    if (this.hasMoved()) {
      this.currentX += (this.targetX - this.currentX) * LERP_FACTOR;
      this.currentY += (this.targetY - this.currentY) * LERP_FACTOR;
      const element = this.dot()?.nativeElement;
      if (element) {
        element.style.transform = `translate3d(${this.currentX}px, ${this.currentY}px, 0)`;
      }
    }
    this.frameId = requestAnimationFrame(() => this.tick());
  }

  /** Only follows the cursor for mouse users who haven't asked for reduced motion. */
  private supportsCursorFollower(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    const hasPreciseHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return hasPreciseHover && !reducedMotion;
  }
}
