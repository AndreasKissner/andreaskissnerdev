import { Directive, ElementRef, HostListener, inject } from '@angular/core';

const MAX_TILT_DEG = 8;
const HOVER_LIFT_SCALE = 1.02;

/**
 * Tilts the host element in 3D toward the cursor position, like a card
 * catching light. Disabled on touch devices and for reduced-motion users.
 */
@Directive({
  selector: '[appTilt]'
})
export class TiltDirective {
  private readonly element: HTMLElement = inject(ElementRef).nativeElement;
  private readonly enabled = this.supportsTilt();

  @HostListener('mousemove', ['$event'])
  protected onMouseMove(event: MouseEvent): void {
    if (!this.enabled) {
      return;
    }
    const rect = this.element.getBoundingClientRect();
    const ratioX = (event.clientX - rect.left) / rect.width - 0.5;
    const ratioY = (event.clientY - rect.top) / rect.height - 0.5;
    const tiltX = ratioY * -2 * MAX_TILT_DEG;
    const tiltY = ratioX * 2 * MAX_TILT_DEG;
    this.element.style.transform =
      `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${HOVER_LIFT_SCALE})`;
  }

  @HostListener('mouseleave')
  protected onMouseLeave(): void {
    this.element.style.transform = '';
  }

  /** Only tilt for mouse users who haven't asked for reduced motion. */
  private supportsTilt(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    const hasPreciseHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return hasPreciseHover && !reducedMotion;
  }
}
