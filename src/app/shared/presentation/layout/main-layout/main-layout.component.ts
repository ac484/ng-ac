import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { I18nPipe, SettingsService, User } from '@delon/theme';
import { LayoutDefaultModule, LayoutDefaultOptions } from '@delon/theme/layout-default';
import { SettingDrawerModule } from '@delon/theme/setting-drawer';
import { ThemeBtnComponent } from '@delon/theme/theme-btn';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';

import { HeaderUserComponent } from '../header/header-user.component';
import { TabComponent } from '../tab/tab.component';

@Component({
    selector: 'app-main-layout',
    template: `
    <layout-default [options]="options" [asideUser]="asideUserTpl" [content]="contentTpl" [customError]="null">
      <layout-default-header-item direction="left">
        <a layout-default-header-item-trigger routerLink="/dashboard">
          <i nz-icon nzType="dashboard"></i>
        </a>
      </layout-default-header-item>
      <layout-default-header-item direction="right">
        <header-user />
      </layout-default-header-item>
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
            <li nz-menu-item routerLink="/user/profile">{{ 'menu.account.profile' | i18n }}</li>
            <li nz-menu-item routerLink="/user/settings">{{ 'menu.account.settings' | i18n }}</li>
          </ul>
        </nz-dropdown-menu>
      </ng-template>
      <ng-template #contentTpl>
        <app-tab></app-tab>
        <router-outlet />
      </ng-template>
    </layout-default>
    <theme-btn />
  `,
    imports: [
        RouterOutlet,
        RouterLink,
        I18nPipe,
        LayoutDefaultModule,
        NzIconModule,
        NzMenuModule,
        NzDropDownModule,
        NzAvatarModule,
        SettingDrawerModule,
        ThemeBtnComponent,
        HeaderUserComponent,
        TabComponent
    ]
})
export class MainLayoutComponent {
    private readonly settings = inject(SettingsService);

    options: LayoutDefaultOptions = {
        logoExpanded: `./assets/logo-full.svg`,
        logoCollapsed: `./assets/logo.svg`
    };

    get user(): User {
        return this.settings.user;
    }
}

