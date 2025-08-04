import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { I18nPipe } from '@delon/theme';
import { NzIconModule } from 'ng-zorro-antd/icon';
import screenfull from 'screenfull';

/**
 * Interface Component: Header Fullscreen Widget
 *
 * Widget component that provides fullscreen functionality for the application.
 * This component belongs to the Interface layer as it handles user interaction
 * and UI concerns related to display mode management.
 */
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
  imports: [NzIconModule, I18nPipe],
  standalone: true
})
export class HeaderFullScreenComponent {
  status = false;

  /**
   * Handle window resize event to update fullscreen status
   */
  @HostListener('window:resize')
  _resize(): void {
    this.status = screenfull.isFullscreen;
  }

  /**
   * Handle click event to toggle fullscreen mode
   */
  @HostListener('click')
  _click(): void {
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  }
}
