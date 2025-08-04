import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { I18nPipe, SettingsService, User } from '@delon/theme';
import { LayoutDefaultModule, LayoutDefaultOptions } from '@delon/theme/layout-default';
import { SettingDrawerModule } from '@delon/theme/setting-drawer';
import { ThemeBtnComponent } from '@delon/theme/theme-btn';
import { environment } from '@env/environment';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

// DDD Application Services
import { AuthApplicationService } from '../../application/services/auth-application.service';
import { UserApplicationService } from '../../application/services/user-application.service';

// DDD Widgets
import { DddHeaderUserComponent } from './widgets/ddd-header-user.component';
import { DddHeaderSearchComponent } from './widgets/ddd-header-search.component';
import { DddHeaderClearStorageComponent } from './widgets/ddd-header-clear-storage.component';
import { DddHeaderFullScreenComponent } from './widgets/ddd-header-fullscreen.component';
import { DddHeaderI18nComponent } from './widgets/ddd-header-i18n.component';

// DDD Tab Component
import { TabComponent } from './tab/tab.component';

@Component({
  selector: 'app-ddd-layout',
  template: `
    <layout-default [options]="options" [asideUser]="asideUserTpl" [content]="contentTpl" [customError]="null">
      <layout-default-header-item direction="left">
        <a layout-default-header-item-trigger href="//github.com/ng-alain/ng-alain" target="_blank">
          <nz-icon nzType="github" />
        </a>
      </layout-default-header-item>
      <layout-default-header-item direction="left" hidden="mobile">
        <a layout-default-header-item-trigger routerLink="/passport/lock">
          <nz-icon nzType="lock" />
        </a>
      </layout-default-header-item>
      <layout-default-header-item direction="left" hidden="pc">
        <div layout-default-header-item-trigger (click)="searchToggleStatus = !searchToggleStatus">
          <nz-icon nzType="search" />
        </div>
      </layout-default-header-item>
      <layout-default-header-item direction="middle">
        <ddd-header-search class="alain-default__search" [toggleChange]="searchToggleStatus" />
      </layout-default-header-item>
      <layout-default-header-item direction="right" hidden="mobile">
        <div layout-default-header-item-trigger nz-dropdown [nzDropdownMenu]="settingsMenu" nzTrigger="click" nzPlacement="bottomRight">
          <nz-icon nzType="setting" />
        </div>
        <nz-dropdown-menu #settingsMenu="nzDropdownMenu">
          <div nz-menu style="width: 200px;">
            <div nz-menu-item>
              <ddd-header-fullscreen />
            </div>
            <div nz-menu-item>
              <ddd-header-clear-storage />
            </div>
            <div nz-menu-item>
              <ddd-header-i18n />
            </div>
          </div>
        </nz-dropdown-menu>
      </layout-default-header-item>
      <layout-default-header-item direction="right">
        <ddd-header-user />
      </layout-default-header-item>
      <ng-template #asideUserTpl>
        <div nz-dropdown nzTrigger="click" [nzDropdownMenu]="userMenu" class="alain-default__aside-user">
          <nz-avatar class="alain-default__aside-user-avatar" [nzSrc]="currentUser?.avatar || './assets/tmp/img/avatar.jpg'" />
          <div class="alain-default__aside-user-info">
            <strong>{{ currentUser?.name || 'User' }}</strong>
            <p class="mb0">{{ currentUser?.email || 'user@example.com' }}</p>
          </div>
        </div>
        <nz-dropdown-menu #userMenu="nzDropdownMenu">
          <ul nz-menu>
            <li nz-menu-item routerLink="/pro/account/center">{{ 'menu.account.center' | i18n }}</li>
            <li nz-menu-item routerLink="/pro/account/settings">{{ 'menu.account.settings' | i18n }}</li>
          </ul>
        </nz-dropdown-menu>
      </ng-template>
      <ng-template #contentTpl>
        <div>
          <app-tab></app-tab>
          <router-outlet />
        </div>
      </ng-template>
    </layout-default>
    @if (showSettingDrawer) {
      <setting-drawer />
    }
    <theme-btn />
  `,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    I18nPipe,
    LayoutDefaultModule,
    SettingDrawerModule,
    ThemeBtnComponent,
    TabComponent,
    NzIconModule,
    NzMenuModule,
    NzDropDownModule,
    NzAvatarModule,
    DddHeaderSearchComponent,
    DddHeaderClearStorageComponent,
    DddHeaderFullScreenComponent,
    DddHeaderUserComponent,
    DddHeaderI18nComponent
  ]
})
export class DddLayoutComponent implements OnInit, OnDestroy {
  private readonly settings = inject(SettingsService);
  private readonly authApplicationService = inject(AuthApplicationService);
  private readonly userApplicationService = inject(UserApplicationService);
  private readonly destroy$ = new Subject<void>();

  options: LayoutDefaultOptions = {
    logoExpanded: `./assets/logo-full.svg`,
    logoCollapsed: `./assets/logo.svg`
  };
  
  searchToggleStatus = false;
  showSettingDrawer = !environment.production;
  currentUser: User | null = null;

  ngOnInit(): void {
    this.loadCurrentUser();
    this.subscribeToAuthChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async loadCurrentUser(): Promise<void> {
    try {
      const auth = await this.authApplicationService.getCurrentAuthentication().toPromise();
      if (auth) {
        const user = auth.getUser();
        if (user) {
          const userDto = await this.userApplicationService.getUserById(user.id);
          if (userDto) {
            this.currentUser = {
              name: userDto.displayName,
              avatar: userDto.photoURL || './assets/tmp/img/avatar.jpg',
              email: userDto.email,
              id: userDto.id
            };
          }
        }
      }
    } catch (error: any) {
      console.error('Error loading current user:', error);
      // Fallback to settings user
      this.currentUser = this.settings.user;
    }
  }

  private subscribeToAuthChanges(): void {
    // Subscribe to authentication changes
    this.authApplicationService.getCurrentAuthentication()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: async (auth: any) => {
          if (auth) {
            await this.loadCurrentUser();
          } else {
            this.currentUser = null;
          }
        },
        error: (error: any) => {
          console.error('Error in auth subscription:', error);
        }
      });
  }

  get user(): User {
    return this.currentUser || this.settings.user;
  }
} 