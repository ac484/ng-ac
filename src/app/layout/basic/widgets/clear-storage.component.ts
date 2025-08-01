import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, inject, PLATFORM_ID } from '@angular/core';
import { I18nPipe } from '@delon/theme';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

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
  imports: [NzIconModule, I18nPipe]
})
export class HeaderClearStorageComponent {
  private readonly modalSrv = inject(NzModalService);
  private readonly messageSrv = inject(NzMessageService);
  private readonly platformId = inject(PLATFORM_ID);

  @HostListener('click')
  _click(): void {
    this.modalSrv.confirm({
      nzTitle: 'Make sure clear all local storage?',
      nzOnOk: () => {
        // 只在瀏覽器環境中執行 localStorage 操作
        if (isPlatformBrowser(this.platformId) && typeof localStorage !== 'undefined') {
          localStorage.clear();
          this.messageSrv.success('Clear Finished!');
        }
      }
    });
  }
}
