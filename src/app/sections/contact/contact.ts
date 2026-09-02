import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ContactSendError, ContactService } from '../../core/contact.service';
import { LanguageService } from '../../core/language.service';
import { TurnstileService } from '../../core/turnstile.service';
import { MagneticDirective } from '../../shared/magnetic.directive';
import { SectionDividerComponent } from '../../shared/section-divider/section-divider';

type SubmitStatus =
  | 'idle'
  | 'sending'
  | 'success'
  | 'error-rate-limited'
  | 'error-validation'
  | 'error-forbidden'
  | 'error-captcha'
  | 'error-send-failed'
  | 'error-network';
type StepField = 'name' | 'email' | 'message';

const STEP_FIELDS: readonly StepField[] = ['name', 'email', 'message'];
const REVIEW_STEP = STEP_FIELDS.length;

/**
 * Contact section as a one-question-at-a-time conversational form, with a
 * final review step before submission and a hidden honeypot field.
 */
@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, TranslatePipe, MagneticDirective, SectionDividerComponent, RouterLink],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  private readonly contactService = inject(ContactService);
  private readonly turnstileService = inject(TurnstileService);
  private readonly languageService = inject(LanguageService);
  private readonly turnstileContainer = viewChild<ElementRef<HTMLElement>>('turnstileContainer');
  private turnstileWidgetId: string | null = null;

  protected readonly status = signal<SubmitStatus>('idle');
  protected readonly currentStep = signal(0);
  protected readonly stepFields = STEP_FIELDS;
  protected readonly reviewStep = REVIEW_STEP;
  protected readonly turnstileToken = signal<string | null>(null);

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    message: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10)] }),
    honeypot: new FormControl('', { nonNullable: true })
  });

  constructor() {
    effect(() => {
      const container = this.turnstileContainer()?.nativeElement;
      if (container && this.turnstileWidgetId === null) {
        this.renderTurnstile(container);
      }
    });
  }

  /** Advances to the next question if the current one is valid. */
  protected nextStep(): void {
    const field = this.stepFields[this.currentStep()];
    const control = this.form.controls[field];
    if (control.invalid) {
      control.markAsTouched();
      return;
    }
    this.currentStep.update((step) => Math.min(step + 1, REVIEW_STEP));
  }

  /** Returns to the previous question. */
  protected prevStep(): void {
    this.currentStep.update((step) => Math.max(step - 1, 0));
  }

  /** Jumps back to edit a specific answer from the review step. */
  protected editStep(index: number): void {
    this.currentStep.set(index);
  }

  /** Submits the form if valid, verified and not already sending. */
  protected async submit(): Promise<void> {
    if (this.form.invalid || this.status() === 'sending' || !this.turnstileToken()) {
      this.form.markAllAsTouched();
      return;
    }

    this.status.set('sending');
    try {
      await this.contactService.send({
        ...this.form.getRawValue(),
        turnstileToken: this.turnstileToken()!,
        language: this.languageService.activeLanguage()
      });
      this.status.set('success');
      this.form.reset();
      this.currentStep.set(0);
    } catch (error) {
      this.status.set(this.mapErrorToStatus(error));
      this.resetTurnstile();
    }
  }

  /** Renders the Turnstile widget into the given container and stores its widget id. */
  private async renderTurnstile(container: HTMLElement): Promise<void> {
    this.turnstileWidgetId = await this.turnstileService.render(container, (token) => this.turnstileToken.set(token));
  }

  /** Resets the Turnstile widget after a failed submission, since tokens are single-use. */
  private resetTurnstile(): void {
    this.turnstileToken.set(null);
    if (this.turnstileWidgetId) {
      this.turnstileService.reset(this.turnstileWidgetId);
    }
  }

  /** Maps a failed submission to the specific status the template shows a message for. */
  private mapErrorToStatus(error: unknown): SubmitStatus {
    if (!(error instanceof ContactSendError)) {
      return 'error-network';
    }
    const statusByCode: Record<ContactSendError['code'], SubmitStatus> = {
      rate_limited: 'error-rate-limited',
      validation_failed: 'error-validation',
      forbidden_origin: 'error-forbidden',
      captcha_failed: 'error-captcha',
      send_failed: 'error-send-failed',
      network: 'error-network'
    };
    return statusByCode[error.code];
  }
}
