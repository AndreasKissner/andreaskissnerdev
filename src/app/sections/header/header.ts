import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService, type AppLanguage } from '../../core/language.service';
import { ThemeService } from '../../core/theme.service';
import { CommandPaletteService } from '../../core/command-palette.service';

const LANGUAGE_OPTIONS: readonly AppLanguage[] = ['de', 'fr', 'it', 'en'];

/**
 * Site header with anchor navigation, language switcher, theme toggle and mobile menu.
 */
@Component({
  selector: 'app-header',
  imports: [TranslatePipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  protected readonly languageService = inject(LanguageService);
  protected readonly themeService = inject(ThemeService);
  protected readonly commandPalette = inject(CommandPaletteService);
  protected readonly languageOptions = LANGUAGE_OPTIONS;
  protected readonly isMenuOpen = signal(false);

  /** Toggles the mobile navigation menu. */
  protected toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  /** Closes the mobile navigation menu, used after selecting a link. */
  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  /** Switches the active UI language. */
  protected selectLanguage(language: AppLanguage): void {
    this.languageService.switchLanguage(language);
  }

  /** Cycles the theme preference (system → dark → light). */
  protected cycleTheme(): void {
    this.themeService.toggle();
  }
}
