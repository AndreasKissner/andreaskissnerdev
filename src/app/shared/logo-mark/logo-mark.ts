import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Small self-made monogram mark (stylised "K") used as the brand icon in
 * the header and the scroll-replacement bar.
 */
@Component({
  selector: 'app-logo-mark',
  templateUrl: './logo-mark.html',
  styleUrl: './logo-mark.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoMarkComponent {}
