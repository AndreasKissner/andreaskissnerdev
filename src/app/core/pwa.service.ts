import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/** Browser install prompt event, not yet part of the standard DOM typings. */
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * Tracks real PWA capabilities of the running browser: whether this site can be
 * installed as an app, whether it already runs as one, and the live network state.
 */
@Injectable({ providedIn: 'root' })
export class PwaService {
  private installPrompt: BeforeInstallPromptEvent | null = null;

  readonly canInstall = signal(false);
  readonly isInstalled = signal(false);
  readonly isOnline = signal(true);
  readonly isOfflineReady = signal(false);

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) {
      return;
    }
    this.watchInstallPrompt();
    this.watchNetworkState();
    this.checkInstalled();
    this.checkOfflineReady();
  }

  /**
   * Opens the browser's native install dialog.
   * @returns True if the visitor accepted the installation.
   */
  async install(): Promise<boolean> {
    if (!this.installPrompt) {
      return false;
    }
    await this.installPrompt.prompt();
    const { outcome } = await this.installPrompt.userChoice;
    this.installPrompt = null;
    this.canInstall.set(false);
    return outcome === 'accepted';
  }

  /** Captures the install prompt so it can be triggered by a user action later. */
  private watchInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.installPrompt = event as BeforeInstallPromptEvent;
      this.canInstall.set(true);
    });
    window.addEventListener('appinstalled', () => {
      this.canInstall.set(false);
      this.isInstalled.set(true);
    });
  }

  /** Mirrors the browser's connection state so the page can react to it live. */
  private watchNetworkState(): void {
    this.isOnline.set(navigator.onLine);
    window.addEventListener('online', () => this.isOnline.set(true));
    window.addEventListener('offline', () => this.isOnline.set(false));
  }

  /** Detects whether the site is already running as an installed app. */
  private checkInstalled(): void {
    this.isInstalled.set(window.matchMedia('(display-mode: standalone)').matches);
  }

  /** Confirms a service worker is active, which is what makes offline use possible. */
  private async checkOfflineReady(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      return;
    }
    await navigator.serviceWorker.ready;
    this.isOfflineReady.set(true);
  }
}
