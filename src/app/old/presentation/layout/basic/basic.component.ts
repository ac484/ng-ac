import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SettingsService, User } from '@delon/theme';
import { LayoutDefaultModule, LayoutDefaultOptions } from '@delon/theme/layout-default';
import { SettingDrawerModule } from '@delon/theme/setting-drawer';
import { ThemeBtnComponent } from '@delon/theme/theme-btn';
import { environment } from '../../../../environments/environment';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';

import { HeaderUserComponent } from './widgets/header-user.component';

@Component({
    selector: 'app-layout-basic',
    template: `
    <layout-default [options]="options" [asideUser]="asideUserTpl" [content]="contentTpl">
      <!-- Header Left Items -->
      <layout-default-header-item direction="left">
        <a layout-default-header-item-trigger href="//github.com/ng-alain/ng-alain" target="_blank">
          <i nz-icon nzType="github"></i>
        </a>
      </layout-default-header-item>
      
      <!-- Header Right Items -->
      <layout-default-header-item direction="right" hidden="mobile">
        <div layout-default-header-item-trigger nz-dropdown [nzDropdownMenu]="settingsMenu" nzTrigger="click" nzPlacement="bottomRight">
          <i nz-icon nzType="setting"></i>
        </div>
        <nz-dropdown-menu #settingsMenu="nzDropdownMenu">
          <div nz-menu style="width: 200px;">
            <div nz-menu-item>
              <span>Layout Settings</span>
            </div>
          </div>
        </nz-dropdown-menu>
      </layout-default-header-item>
      
      <layout-default-header-item direction="right">
        <app-header-user />
      </layout-default-header-item>

      <!-- Aside User Template -->
      <ng-template #asideUserTpl>
        <div nz-dropdown nzTrigger="click" [nzDropdownMenu]="userMenu" class="alain-default__aside-user">
          <nz-avatar class="alain-default__aside-user-avatar" [nzSrc]="user.avatar" />
          <div class="alain-default__aside-user-info">
            <strong>{{ user.name }}</strong>
            <p class="mb0">{{ user.email }}</p>
          </div>
        </div>
        <nz-dropdown-menu #userMenu="nzDropdownMenu">
          <ul nz-menu>
            <li nz-menu-item>
              <i nz-icon nzType="user"></i>
              Profile
            </li>
            <li nz-menu-item>
              <i nz-icon nzType="setting"></i>
              Settings
            </li>
          </ul>
        </nz-dropdown-menu>
      </ng-template>

      <!-- Content Template -->
      <ng-template #contentTpl>
        <router-outlet />
      </ng-template>
    </layout-default>

    <!-- Setting Drawer (Development Only) -->
    @if (showSettingDrawer) {
      <setting-drawer />
    }
    
    <!-- Theme Button -->
    <theme-btn />
  `,
    standalone: true,
    imports: [
        RouterOutlet,
        LayoutDefaultModule,
        NzIconModule,
        NzMenuModule,
        NzDropDownModule,
        NzAvatarModule,
        SettingDrawerModule,
        ThemeBtnComponent,
        HeaderUserComponent
    ]
})
export class LayoutBasicComponent {
    private readonly settings = inject(SettingsService);

    options: LayoutDefaultOptions = {
        logoExpanded: `./assets/logo-color.svg`,
        logoCollapsed: `./assets/logo-color.svg`
    };

    showSettingDrawer = !environment.production;

    get user(): User {
        return this.settings.user;
    }
}