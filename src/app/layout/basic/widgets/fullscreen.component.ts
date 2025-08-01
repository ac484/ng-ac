import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, inject, PLATFORM_ID } from '@angular/core';
import { I18nPipe } from '@delon/theme';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'header-fullscreen',
  template: `
    <i nz-icon [nzType]="status ? 'fullscreen-exit' : 'fullscreen'"></i>
    {{ (status ? 'menu.fullscreen.exit' : 'menu.fullscreen') | i18n }}
  `,
  host: {
    '[class.flex-1]': 'true'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzIconModule, I18nPipe]
})
export class HeaderFullScreenComponent {
  private readonly platformId = inject(PLATFORM_ID);
  status = false;

  @HostListener('window:resize')
  _resize(): void {
    // 只在瀏覽器環境中執行 screenfull 操作
    if (isPlatformBrowser(this.platformId)) {
      import('screenfull').then(screenfull => {
        this.status = screenfull.default.isFullscreen;
      });
    }
  }

  @HostListener('click')
  _click(): void {
    // 只在瀏覽器環境中執行 screenfull 操作
    if (isPlatformBrowser(this.platformId)) {
      import('screenfull').then(screenfull => {
        if (screenfull.default.isEnabled) {
          screenfull.default.toggle();
        }
      });
    }
  }
}
