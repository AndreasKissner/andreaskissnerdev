import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Generic modal for short explanatory content, driven by translation keys.
 * @param isOpen - Whether the modal is visible.
 * @param titleKey - Translation key for the modal heading.
 * @param textKey - Translation key for the modal body text.
 * @param onClose - Emitted when the modal should close.
 */
@Component({
  selector: 'app-info-modal',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './info-modal.html',
  styleUrl: './info-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoModalComponent {
  @Input() isOpen = false;
  @Input({ required: true }) titleKey!: string;
  @Input({ required: true }) textKey!: string;
  @Output() onClose = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  protected onEscapeKey(): void {
    if (this.isOpen) {
      this.close();
    }
  }

  close(): void {
    this.onClose.emit();
  }
}
