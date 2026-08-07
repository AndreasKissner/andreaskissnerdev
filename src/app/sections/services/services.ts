import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

interface ServiceItem {
  readonly titleKey: string;
  readonly textKey: string;
}

const SERVICE_ITEMS: readonly ServiceItem[] = [
  { titleKey: 'SERVICES.ITEM_1_TITLE', textKey: 'SERVICES.ITEM_1_TEXT' },
  { titleKey: 'SERVICES.ITEM_2_TITLE', textKey: 'SERVICES.ITEM_2_TEXT' },
  { titleKey: 'SERVICES.ITEM_3_TITLE', textKey: 'SERVICES.ITEM_3_TEXT' },
  { titleKey: 'SERVICES.ITEM_4_TITLE', textKey: 'SERVICES.ITEM_4_TEXT' }
];

/**
 * Services section listing the offered business services as cards.
 */
@Component({
  selector: 'app-services',
  imports: [TranslatePipe],
  templateUrl: './services.html',
  styleUrl: './services.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesComponent {
  protected readonly items = SERVICE_ITEMS;
}
