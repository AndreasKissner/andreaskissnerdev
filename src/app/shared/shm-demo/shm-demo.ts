import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

const STEP_KEYS = ['WORK.SHM_DEMO_STEP_1', 'WORK.SHM_DEMO_STEP_2', 'WORK.SHM_DEMO_STEP_3'] as const;

/**
 * Small live workflow preview for the Second Hand Manager reference: a real
 * interactive Angular component instead of a static screenshot, animating
 * on hover/focus to demonstrate the kind of build a page-builder can't do.
 */
@Component({
  selector: 'app-shm-demo',
  imports: [TranslatePipe],
  templateUrl: './shm-demo.html',
  styleUrl: './shm-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShmDemoComponent {
  protected readonly stepKeys = STEP_KEYS;
}
