import { Injectable, inject, signal } from '@angular/core';
import { ThemeService } from './theme.service';

export interface PaletteCommand {
  readonly id: string;
  readonly labelKey: string;
  readonly run: () => void;
}

const PORTFOLIO_URL = 'https://www.andreas-kissner.cloud/#portfolio';

/**
 * Holds the command list and open/closed state for the keyboard command palette.
 */
@Injectable({ providedIn: 'root' })
export class CommandPaletteService {
  private readonly themeService = inject(ThemeService);
  readonly isOpen = signal(false);
  readonly activeIndex = signal(0);

  readonly commands: readonly PaletteCommand[] = [
    { id: 'services', labelKey: 'PALETTE.SERVICES', run: () => this.scrollTo('services') },
    { id: 'work', labelKey: 'PALETTE.WORK', run: () => this.scrollTo('work') },
    { id: 'contact', labelKey: 'PALETTE.CONTACT', run: () => this.scrollTo('contact') },
    { id: 'portfolio', labelKey: 'PALETTE.PORTFOLIO', run: () => this.openPortfolio() },
    { id: 'theme', labelKey: 'PALETTE.THEME', run: () => this.themeService.toggle() }
  ];

  /** Opens the palette and resets the highlighted command to the first one. */
  open(): void {
    this.isOpen.set(true);
    this.activeIndex.set(0);
  }

  /** Closes the palette. */
  close(): void {
    this.isOpen.set(false);
  }

  /** Toggles the palette open/closed. */
  toggle(): void {
    this.isOpen() ? this.close() : this.open();
  }

  /** Runs the currently highlighted command and closes the palette. */
  runActive(): void {
    this.commands[this.activeIndex()]?.run();
    this.close();
  }

  /** Moves the highlighted command up or down, wrapping around the list. */
  move(step: 1 | -1): void {
    const length = this.commands.length;
    this.activeIndex.update((index) => (index + step + length) % length);
  }

  private scrollTo(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }

  private openPortfolio(): void {
    window.open(PORTFOLIO_URL, '_blank', 'noopener');
  }
}
