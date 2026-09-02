import { Injectable } from '@angular/core';

interface TurnstileRenderOptions {
  readonly sitekey: string;
  readonly callback: (token: string) => void;
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
      reset: (widgetId: string) => void;
    };
  }
}

const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const SITE_KEY = '0x4AAAAAAEkrPcpkIaX3GO8o';

/**
 * Loads the Cloudflare Turnstile script and renders the widget used to
 * prove a contact form submission comes from a real visitor, not a bot.
 */
@Injectable({ providedIn: 'root' })
export class TurnstileService {
  private readonly isBrowser = typeof window !== 'undefined';
  private scriptPromise: Promise<void> | null = null;

  /** Renders the widget into the given container, resolving with its widget id. */
  async render(container: HTMLElement, onToken: (token: string) => void): Promise<string | null> {
    if (!this.isBrowser) {
      return null;
    }
    await this.loadScript();
    return window.turnstile!.render(container, { sitekey: SITE_KEY, callback: onToken });
  }

  /** Resets a rendered widget so the visitor can solve it again after a failed submit. */
  reset(widgetId: string): void {
    if (this.isBrowser) {
      window.turnstile?.reset(widgetId);
    }
  }

  /** Loads the Turnstile script once, resolving as soon as window.turnstile is ready. */
  private loadScript(): Promise<void> {
    if (!this.scriptPromise) {
      this.scriptPromise = new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = SCRIPT_URL;
        script.async = true;
        script.onload = () => resolve();
        document.head.appendChild(script);
      });
    }
    return this.scriptPromise;
  }
}
