import { Injectable, signal } from '@angular/core';

const REVEAL_SCROLL_PX = 480;

/**
 * Tracks whether the page has been scrolled past the hero, shared by the
 * header and the sticky replacement bar so only one scroll listener runs.
 */
@Injectable({ providedIn: 'root' })
export class ScrollStateService {
  readonly isScrolled = signal(false);

  constructor() {
    window.addEventListener(
      'scroll',
      () => this.isScrolled.set(window.scrollY > REVEAL_SCROLL_PX),
      { passive: true }
    );
  }
}
