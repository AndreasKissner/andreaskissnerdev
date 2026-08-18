import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ContactService } from '../../core/contact.service';
import { MagneticDirective } from '../../shared/magnetic.directive';
import { SectionDividerComponent } from '../../shared/section-divider/section-divider';

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';
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
  protected readonly status = signal<SubmitStatus>('idle');
  protected readonly currentStep = signal(0);
  protected readonly stepFields = STEP_FIELDS;
  protected readonly reviewStep = REVIEW_STEP;

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    message: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10)] }),
    honeypot: new FormControl('', { nonNullable: true })
  });

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

  /** Submits the form if valid and not already sending. */
  protected async submit(): Promise<void> {
    if (this.form.invalid || this.status() === 'sending') {
      this.form.markAllAsTouched();
      return;
    }

    this.status.set('sending');
    try {
      await this.contactService.send(this.form.getRawValue());
      this.status.set('success');
      this.form.reset();
      this.currentStep.set(0);
    } catch {
      this.status.set('error');
    }
  }
}
