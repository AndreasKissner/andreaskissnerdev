import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const REVEAL_SCROLL_PX = 480;

/**
 * Tracks whether the page has been scrolled past the hero, shared by the
 * header and the sticky replacement bar so only one scroll listener runs.
 */
@Injectable({ providedIn: 'root' })
export class ScrollStateService {
  readonly isScrolled = signal(false);

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) {
      return;
    }
    window.addEventListener(
      'scroll',
      () => this.isScrolled.set(window.scrollY > REVEAL_SCROLL_PX),
      { passive: true }
    );
  }
}
