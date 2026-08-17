import { Injectable, effect, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './language.service';

/**
 * Sets the document title and meta description for the current page,
 * translated keys, kept in sync when the active language changes.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly translate = inject(TranslateService);
  private readonly languageService = inject(LanguageService);

  private titleKey = '';
  private descriptionKey = '';

  constructor() {
    effect(() => {
      this.languageService.activeLanguage();
      this.applyTranslations();
    });
  }

  /** Registers the translation keys used for this page's title and meta description. */
  setPage(titleKey: string, descriptionKey: string): void {
    this.titleKey = titleKey;
    this.descriptionKey = descriptionKey;
    this.applyTranslations();
  }

  private applyTranslations(): void {
    if (!this.titleKey) {
      return;
    }
    this.title.setTitle(this.translate.instant(this.titleKey));
    this.meta.updateTag({ name: 'description', content: this.translate.instant(this.descriptionKey) });
  }
}
