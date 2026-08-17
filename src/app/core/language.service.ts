import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { runWithViewTransition } from './view-transition';

export type AppLanguage = 'de' | 'fr' | 'it' | 'en';

const SUPPORTED_LANGUAGES: readonly AppLanguage[] = ['de', 'fr', 'it', 'en'];
const STORAGE_KEY = 'lang';
const DEFAULT_LANGUAGE: AppLanguage = 'de';

/**
 * Manages the active UI language: detection, persistence and switching.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly activeLanguage = signal<AppLanguage>(DEFAULT_LANGUAGE);

  /** Initializes the translate service with the detected or stored language. */
  init(): void {
    this.translate.addLangs([...SUPPORTED_LANGUAGES]);
    this.setLanguage(this.detectLanguage());
  }

  /** Switches the active language and persists the choice. */
  setLanguage(language: AppLanguage): void {
    this.translate.use(language);
    this.activeLanguage.set(language);
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEY, language);
    }
  }

  /** Switches the language via a View Transition, used for user-triggered switches. */
  switchLanguage(language: AppLanguage): void {
    runWithViewTransition(() => this.setLanguage(language));
  }

  private detectLanguage(): AppLanguage {
    if (!this.isBrowser) {
      return DEFAULT_LANGUAGE;
    }
    const stored = localStorage.getItem(STORAGE_KEY) as AppLanguage | null;
    if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
      return stored;
    }
    const browserLanguage = this.translate.getBrowserLang() as AppLanguage | undefined;
    return browserLanguage && SUPPORTED_LANGUAGES.includes(browserLanguage)
      ? browserLanguage
      : DEFAULT_LANGUAGE;
  }
}
