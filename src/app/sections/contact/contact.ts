import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ContactService } from '../../core/contact.service';

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';

/**
 * Contact section with a reactive, validated form and a hidden honeypot field.
 */
@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  private readonly contactService = inject(ContactService);
  protected readonly status = signal<SubmitStatus>('idle');

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    message: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10)] }),
    honeypot: new FormControl('', { nonNullable: true })
  });

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
    } catch {
      this.status.set('error');
    }
  }
}
