import { Directive, ElementRef, HostListener, inject } from '@angular/core';

const MAX_TILT_DEG = 16;

/**
 * Tracks cursor position over the host and exposes it as CSS custom
 * properties (--tilt-rx, --tilt-ry, --tilt-scale), so a child element can
 * tilt in 3D via CSS without the host itself moving under the cursor —
 * which would otherwise trigger a spurious mouseleave.
 */
@Directive({ selector: '[appTilt]' })
export class TiltDirective {
  private readonly element: HTMLElement = inject(ElementRef).nativeElement;
  private readonly prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  @HostListener('mousemove', ['$event'])
  protected onMouseMove(event: MouseEvent): void {
    if (this.prefersReducedMotion) {
      return;
    }
    const bounds = this.element.getBoundingClientRect();
    const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;

    this.element.style.setProperty('--tilt-rx', `${offsetY * -MAX_TILT_DEG * 2}deg`);
    this.element.style.setProperty('--tilt-ry', `${offsetX * MAX_TILT_DEG * 2}deg`);
    this.element.style.setProperty('--tilt-scale', '1.04');
  }

  @HostListener('mouseleave')
  protected onMouseLeave(): void {
    this.element.style.setProperty('--tilt-rx', '0deg');
    this.element.style.setProperty('--tilt-ry', '0deg');
    this.element.style.setProperty('--tilt-scale', '1');
  }
}
