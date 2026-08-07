import { Directive, ElementRef, HostListener, inject } from '@angular/core';

/**
 * Gives the host element a calm lift-and-scale on hover — a restrained
 * alternative to a continuous cursor-follow effect.
 */
@Directive({
  selector: '[appMagnetic]'
})
export class MagneticDirective {
  private readonly element: HTMLElement = inject(ElementRef).nativeElement;

  @HostListener('mouseenter')
  protected onMouseEnter(): void {
    this.element.style.transform = 'translateY(-2px) scale(1.02)';
  }

  @HostListener('mouseleave')
  protected onMouseLeave(): void {
    this.element.style.transform = '';
  }
}
