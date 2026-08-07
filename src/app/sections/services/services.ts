import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

interface ServiceItem {
  readonly titleKey: string;
  readonly textKey: string;
  readonly detailKey: string;
}

const SERVICE_ITEMS: readonly ServiceItem[] = [
  { titleKey: 'SERVICES.ITEM_1_TITLE', textKey: 'SERVICES.ITEM_1_TEXT', detailKey: 'SERVICES.ITEM_1_DETAIL' },
  { titleKey: 'SERVICES.ITEM_2_TITLE', textKey: 'SERVICES.ITEM_2_TEXT', detailKey: 'SERVICES.ITEM_2_DETAIL' },
  { titleKey: 'SERVICES.ITEM_3_TITLE', textKey: 'SERVICES.ITEM_3_TEXT', detailKey: 'SERVICES.ITEM_3_DETAIL' },
  { titleKey: 'SERVICES.ITEM_4_TITLE', textKey: 'SERVICES.ITEM_4_TEXT', detailKey: 'SERVICES.ITEM_4_DETAIL' }
];

/**
 * Services section listing the offered business services as cards, each
 * revealing a more detailed explanation on hover or keyboard focus.
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
