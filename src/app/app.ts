import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HeaderComponent } from './sections/header/header';
import { FooterComponent } from './sections/footer/footer';
import { CommandPaletteComponent } from './shared/command-palette/command-palette';
import { StickyBarComponent } from './shared/sticky-bar/sticky-bar';
import { EasterEggComponent } from './shared/easter-egg/easter-egg';
import { CookieBannerComponent } from './shared/cookie-banner/cookie-banner';
import { LanguageService } from './core/language.service';
import { AnalyticsService } from './core/analytics.service';
import { ConsoleEasterEggService } from './core/console-easter-egg.service';

@Component({
  selector: 'app-root',
  imports: [
    TranslatePipe,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    CommandPaletteComponent,
    StickyBarComponent,
    EasterEggComponent,
    CookieBannerComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly languageService = inject(LanguageService);
  private readonly analytics = inject(AnalyticsService);
  private readonly consoleEasterEgg = inject(ConsoleEasterEggService);

  constructor() {
    this.languageService.init();
    effect(() => {
      document.documentElement.lang = this.languageService.activeLanguage();
    });
  }
}
