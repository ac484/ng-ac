import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { I18nPipe } from '@delon/theme';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

/**
 * Interface Component: Header Clear Storage Widget
 *
 * Widget component that provides functionality to clear local storage.
 * This component belongs to the Interface layer as it handles user
 * interaction and UI concerns related to storage management.
 */
@Component({
  selector: 'header-clear-storage',
  template: `
    <i nz-icon nzType="tool"></i>
    {{ 'menu.clear.local.storage' | i18n }}
  `,
  host: {
    '[class.flex-1]': 'true'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzIconModule, I18nPipe],
  standalone: true
})
export class HeaderClearStorageComponent {
  private readonly modalSrv = inject(NzModalService);
  private readonly messageSrv = inject(NzMessageService);

  /**
   * Handle click event to clear local storage
   * Shows confirmation dialog before clearing storage
   */
  @HostListener('click')
  _click(): void {
    this.modalSrv.confirm({
      nzTitle: 'Make sure clear all local storage?',
      nzOnOk: () => {
        localStorage.clear();
        this.messageSrv.success('Clear Finished!');
      }
    });
  }
}
