import { Component, effect, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { HeaderComponent } from './sections/header/header';
import { HeroComponent } from './sections/hero/hero';
import { ServicesComponent } from './sections/services/services';
import { QualityComponent } from './sections/quality/quality';
import { WorkComponent } from './sections/work/work';
import { ContactComponent } from './sections/contact/contact';
import { FooterComponent } from './sections/footer/footer';
import { CommandPaletteComponent } from './shared/command-palette/command-palette';
import { StickyBarComponent } from './shared/sticky-bar/sticky-bar';
import { EasterEggComponent } from './shared/easter-egg/easter-egg';
import { LanguageService } from './core/language.service';

@Component({
  selector: 'app-root',
  imports: [
    TranslatePipe,
    HeaderComponent,
    HeroComponent,
    ServicesComponent,
    QualityComponent,
    WorkComponent,
    ContactComponent,
    FooterComponent,
    CommandPaletteComponent,
    StickyBarComponent,
    EasterEggComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly languageService = inject(LanguageService);

  constructor() {
    this.languageService.init();
    effect(() => {
      document.documentElement.lang = this.languageService.activeLanguage();
    });
  }
}
