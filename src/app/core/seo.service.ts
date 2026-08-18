import { DOCUMENT, Injectable, effect, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './language.service';

const PERSON_SCHEMA_ID = 'seo-person-schema';

const PERSON_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Andreas Kissner',
  jobTitle: 'Web- und Frontend-Developer',
  url: 'https://andreaskissner.dev',
  email: 'mailto:developer@andreas-kissner.cloud',
  telephone: '+41767496713',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Rue du Champ fort 6',
    postalCode: '2853',
    addressLocality: 'Courfaivre',
    addressCountry: 'CH'
  },
  sameAs: ['https://www.linkedin.com/in/andreas-kissner-53557b347', 'https://www.andreas-kissner.cloud'],
  knowsAbout: ['Angular', 'TypeScript', 'Web Development', 'Web Accessibility (WCAG)', 'Web Performance']
};

/**
 * Sets the document title and meta description for the current page,
 * translated keys, kept in sync when the active language changes.
 * Also injects a site-wide Person JSON-LD schema for search engines.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly translate = inject(TranslateService);
  private readonly languageService = inject(LanguageService);
  private readonly document = inject(DOCUMENT);

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

  /** Injects the site-wide Person structured data once, if not already present. */
  injectPersonSchema(): void {
    if (this.document.getElementById(PERSON_SCHEMA_ID)) {
      return;
    }
    const script = this.document.createElement('script');
    script.id = PERSON_SCHEMA_ID;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(PERSON_SCHEMA);
    this.document.head.appendChild(script);
  }

  private applyTranslations(): void {
    if (!this.titleKey) {
      return;
    }
    this.title.setTitle(this.translate.instant(this.titleKey));
    this.meta.updateTag({ name: 'description', content: this.translate.instant(this.descriptionKey) });
  }
}
