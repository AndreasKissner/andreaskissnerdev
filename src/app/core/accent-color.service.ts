import { Injectable, effect, inject, signal } from '@angular/core';
import { contrastRatio } from '../shared/contrast';
import { ThemeService } from './theme.service';

export type AccentId = 'orange' | 'blue' | 'green';

const STORAGE_KEY = 'accent-color';
const DEFAULT_ACCENT: AccentId = 'orange';

const ACCENT_HEX_LIGHT: Record<Exclude<AccentId, 'orange'>, string> = {
  blue: '#1db5dd',
  green: '#294013'
};

const ACCENT_HEX_DARK: Record<Exclude<AccentId, 'orange'>, string> = {
  blue: '#4da8ff',
  green: '#34d399'
};

/**
 * Lets the visitor swap the site's orange accent for blue or green. Picks a
 * theme-appropriate base shade (dark mode gets brighter, WCAG AAA-contrast
 * colors instead of the light-mode ones) and derives the hover/foreground/
 * glow/on-accent shades from it, writing them as CSS custom properties.
 */
@Injectable({ providedIn: 'root' })
export class AccentColorService {
  private readonly themeService = inject(ThemeService);
  private readonly isBrowser = typeof window !== 'undefined';
  private readonly darkMediaQuery = this.isBrowser ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  readonly accent = signal<AccentId>(this.readStored());

  constructor() {
    if (!this.isBrowser) {
      return;
    }
    effect(() => {
      this.accent();
      this.themeService.preference();
      this.applyAccent();
    });
    this.darkMediaQuery?.addEventListener('change', () => this.applyAccent());
  }

  /** Switches the active accent color and persists the choice. */
  setAccent(accent: AccentId): void {
    this.accent.set(accent);
    localStorage.setItem(STORAGE_KEY, accent);
  }

  /** Returns the swatch color for the given accent option in the currently active theme. */
  dotColor(accent: AccentId): string {
    if (accent === 'orange') {
      return '#ff5a1f';
    }
    return (this.isDark() ? ACCENT_HEX_DARK : ACCENT_HEX_LIGHT)[accent];
  }

  private applyAccent(): void {
    const accent = this.accent();
    const root = document.documentElement.style;
    if (accent === 'orange') {
      for (const prop of ['--color-accent', '--color-accent-strong', '--color-accent-fg', '--color-accent-glow', '--color-on-accent']) {
        root.removeProperty(prop);
      }
      return;
    }
    const base = (this.isDark() ? ACCENT_HEX_DARK : ACCENT_HEX_LIGHT)[accent];
    root.setProperty('--color-accent', base);
    root.setProperty('--color-accent-strong', mix(base, '#000000', 0.15));
    root.setProperty('--color-accent-fg', readableForeground(base));
    root.setProperty('--color-accent-glow', hexToRgba(base, 0.35));
    root.setProperty('--color-on-accent', contrastRatio(base, '#000000') >= contrastRatio(base, '#ffffff') ? '#000000' : '#ffffff');
  }

  private isDark(): boolean {
    const preference = this.themeService.preference();
    if (preference === 'dark') {
      return true;
    }
    if (preference === 'light') {
      return false;
    }
    return this.darkMediaQuery?.matches ?? false;
  }

  private readStored(): AccentId {
    const stored = this.isBrowser ? localStorage.getItem(STORAGE_KEY) : null;
    return stored === 'blue' || stored === 'green' ? stored : DEFAULT_ACCENT;
  }
}

/** Mixes two hex colors by the given ratio of the second color (0-1). */
function mix(hexA: string, hexB: string, ratio: number): string {
  const [r1, g1, b1] = hexToRgb(hexA);
  const [r2, g2, b2] = hexToRgb(hexB);
  const channel = (a: number, b: number) => Math.round(a + (b - a) * ratio);
  return rgbToHex(channel(r1, r2), channel(g1, g2), channel(b1, b2));
}

/** Nudges a color toward mid-lightness so it stays legible as text/icon color on either theme. */
function readableForeground(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  if (luminance < 0.28) {
    return mix(hex, '#ffffff', 0.4);
  }
  if (luminance > 0.75) {
    return mix(hex, '#000000', 0.25);
  }
  return hex;
}

function hexToRgb(hex: string): [number, number, number] {
  return [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16)) as [number, number, number];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((c) => Math.max(0, Math.min(255, c)).toString(16).padStart(2, '0')).join('');
}

function hexToRgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
