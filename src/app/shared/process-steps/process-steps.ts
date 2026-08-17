import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Small animated workflow preview: a real interactive Angular component
 * instead of a static screenshot, animating on hover/focus to demonstrate
 * the kind of build a page-builder can't do.
 */
@Component({
  selector: 'app-process-steps',
  imports: [TranslatePipe],
  templateUrl: './process-steps.html',
  styleUrl: './process-steps.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProcessStepsComponent {
  readonly stepKeys = input.required<readonly string[]>();
  readonly ariaLabelKey = input.required<string>();
}
