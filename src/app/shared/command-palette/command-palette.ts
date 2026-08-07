import { ChangeDetectionStrategy, Component, ElementRef, HostListener, effect, inject, viewChild } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CommandPaletteService } from '../../core/command-palette.service';

const isMac = () => navigator.platform.toLowerCase().includes('mac');

/**
 * Keyboard-driven command palette (Ctrl/Cmd+K) for quick navigation and actions.
 */
@Component({
  selector: 'app-command-palette',
  imports: [TranslatePipe],
  templateUrl: './command-palette.html',
  styleUrl: './command-palette.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommandPaletteComponent {
  protected readonly palette = inject(CommandPaletteService);
  private readonly dialog = viewChild<ElementRef<HTMLElement>>('dialog');
  private lastFocusedElement: HTMLElement | null = null;

  constructor() {
    effect(() => {
      if (this.palette.isOpen()) {
        this.lastFocusedElement = document.activeElement as HTMLElement | null;
        queueMicrotask(() => this.dialog()?.nativeElement.focus());
      } else {
        this.lastFocusedElement?.focus();
      }
    });
  }

  @HostListener('window:keydown', ['$event'])
  protected handleGlobalKeydown(event: KeyboardEvent): void {
    const shortcutKey = isMac() ? event.metaKey : event.ctrlKey;
    if (shortcutKey && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.palette.toggle();
      return;
    }
    if (this.palette.isOpen()) {
      this.handleOpenKeydown(event);
    }
  }

  private handleOpenKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Escape':
        this.palette.close();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.palette.move(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.palette.move(-1);
        break;
      case 'Enter':
        this.palette.runActive();
        break;
    }
  }
}
