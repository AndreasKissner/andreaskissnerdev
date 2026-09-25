import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  PLATFORM_ID,
  effect,
  inject,
  signal,
  viewChild,
  viewChildren
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService, type AppLanguage } from '../../core/language.service';
import { ThemeService } from '../../core/theme.service';
import { CommandPaletteService } from '../../core/command-palette.service';
import { ScrollStateService } from '../../core/scroll-state.service';
import { AccentColorService, type AccentId } from '../../core/accent-color.service';
import { LogoMarkComponent } from '../../shared/logo-mark/logo-mark';
import { MagneticDirective } from '../../shared/magnetic.directive';

const LANGUAGE_OPTIONS: readonly AppLanguage[] = ['de', 'fr', 'it', 'en'];
const ACCENT_OPTIONS: readonly AccentId[] = ['orange', 'blue', 'green'];
const SECTION_IDS = ['services', 'pricing', 'work', 'contact'] as const;

interface NavLink {
  readonly labelKey: string;
  readonly href: string;
  readonly sectionId: (typeof SECTION_IDS)[number] | null;
  readonly external: boolean;
}

const NAV_LINKS: readonly NavLink[] = [
  { labelKey: 'NAV.SERVICES', href: '#services', sectionId: 'services', external: false },
  { labelKey: 'NAV.PRICING', href: '#pricing', sectionId: 'pricing', external: false },
  { labelKey: 'NAV.WORK', href: '#work', sectionId: 'work', external: false },
  { labelKey: 'NAV.CONTACT', href: '#contact', sectionId: 'contact', external: false },
  { labelKey: 'NAV.PORTFOLIO', href: 'https://www.andreas-kissner.cloud/#portfolio', sectionId: null, external: true }
];

/**
 * Site header: animated sliding-blob navigation, a CTA button and a single
 * settings popover bundling search, theme, language and accent color.
 */
@Component({
  selector: 'app-header',
  imports: [TranslatePipe, LogoMarkComponent, MagneticDirective],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  protected readonly languageService = inject(LanguageService);
  protected readonly themeService = inject(ThemeService);
  protected readonly commandPalette = inject(CommandPaletteService);
  protected readonly scrollState = inject(ScrollStateService);
  protected readonly accentColor = inject(AccentColorService);
  protected readonly languageOptions = LANGUAGE_OPTIONS;
  protected readonly accentOptions = ACCENT_OPTIONS;
  protected readonly navLinks = NAV_LINKS;
  protected readonly isMenuOpen = signal(false);
  protected readonly isSettingsOpen = signal(false);

  private readonly hoveredNavIndex = signal<number | null>(null);
  private readonly activeSectionId = signal<string | null>(null);
  private readonly navLinkRefs = viewChildren<ElementRef<HTMLElement>>('navLink');
  private readonly navBlobRef = viewChild<ElementRef<HTMLElement>>('navBlob');
  private readonly langButtonRefs = viewChildren<ElementRef<HTMLElement>>('langBtn');
  private readonly langFillRef = viewChild<ElementRef<HTMLElement>>('langFill');
  private readonly settingsWrapRef = viewChild<ElementRef<HTMLElement>>('settingsWrap');

  constructor() {
    this.observeSections();
    effect(() => this.refreshNavBlob());
    effect(() => this.refreshLangFill());
  }

  /** Recomputes indicator positions once the DOM has applied the current menu state. */
  private scheduleIndicatorRefresh(): void {
    requestAnimationFrame(() => {
      this.refreshNavBlob();
      this.refreshLangFill();
    });
  }

  /** Recomputes indicator positions when the viewport is resized, e.g. across the nav breakpoint. */
  @HostListener('window:resize')
  protected onWindowResize(): void {
    this.refreshNavBlob();
    this.refreshLangFill();
  }

  /** Closes the settings popover when a click lands outside it. */
  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.isSettingsOpen()) {
      return;
    }
    const wrap = this.settingsWrapRef()?.nativeElement;
    if (wrap && !wrap.contains(event.target as Node)) {
      this.closeSettings();
    }
  }

  /** Closes the settings popover on Escape, wherever focus currently is. */
  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.closeSettings();
  }

  /** Toggles the mobile navigation menu. */
  protected toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
    this.closeSettings();
    this.scheduleIndicatorRefresh();
  }

  /** Closes the mobile navigation menu, used after selecting a link. */
  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  /** Toggles the settings popover (search, theme, language, accent color). */
  protected toggleSettings(): void {
    this.isSettingsOpen.update((open) => !open);
  }

  /** Closes the settings popover. */
  protected closeSettings(): void {
    this.isSettingsOpen.set(false);
  }

  /** Closes the settings popover and opens the command palette. */
  protected openSearchFromSettings(): void {
    this.closeSettings();
    this.commandPalette.open();
  }

  /** Switches the active UI language. */
  protected selectLanguage(language: AppLanguage): void {
    this.languageService.switchLanguage(language);
  }

  /** Cycles the theme preference (system → dark → light). */
  protected cycleTheme(): void {
    this.themeService.toggle();
  }

  /** Returns the swatch color shown on a given accent dot, matching the active theme. */
  protected accentDotColor(accent: AccentId): string {
    return this.accentColor.dotColor(accent);
  }

  /** Marks a nav link as hovered so the blob follows the cursor. */
  protected setHoveredNav(index: number | null): void {
    this.hoveredNavIndex.set(index);
  }

  private observeSections(): void {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) {
      return;
    }
    const observer = new IntersectionObserver((entries) => this.handleSectionIntersection(entries), {
      rootMargin: '-45% 0px -45% 0px',
      threshold: 0
    });
    for (const id of SECTION_IDS) {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    }
  }

  private handleSectionIntersection(entries: IntersectionObserverEntry[]): void {
    const visible = entries.find((entry) => entry.isIntersecting);
    if (visible) {
      this.activeSectionId.set(visible.target.id);
    }
  }

  private refreshNavBlob(): void {
    this.languageService.activeLanguage();
    const blob = this.navBlobRef()?.nativeElement;
    const links = this.navLinkRefs();
    const index = this.hoveredNavIndex() ?? this.activeNavIndex();
    if (!blob || links.length === 0 || index === null) {
      if (blob) {
        blob.style.opacity = '0';
      }
      return;
    }
    blob.style.opacity = '1';
    this.applyIndicatorPosition2d(blob, links[index].nativeElement);
  }

  private activeNavIndex(): number | null {
    const id = this.activeSectionId();
    if (id === null) {
      return null;
    }
    const index = NAV_LINKS.findIndex((link) => link.sectionId === id);
    return index === -1 ? null : index;
  }

  private refreshLangFill(): void {
    const fill = this.langFillRef()?.nativeElement;
    const buttons = this.langButtonRefs();
    const index = LANGUAGE_OPTIONS.indexOf(this.languageService.activeLanguage());
    if (!fill || buttons.length === 0 || index === -1) {
      return;
    }
    this.applyIndicatorPosition(fill, buttons[index].nativeElement);
  }

  private applyIndicatorPosition(indicator: HTMLElement, target: HTMLElement): void {
    indicator.style.transform = `translateX(${target.offsetLeft}px)`;
    indicator.style.width = `${target.offsetWidth}px`;
  }

  /** Positions an indicator on both axes, needed once the nav row can wrap onto a second line. */
  private applyIndicatorPosition2d(indicator: HTMLElement, target: HTMLElement): void {
    indicator.style.transform = `translate(${target.offsetLeft}px, ${target.offsetTop}px)`;
    indicator.style.width = `${target.offsetWidth}px`;
    indicator.style.height = `${target.offsetHeight}px`;
  }
}
