import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService, User } from '@delon/theme';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
    selector: 'app-header-user',
    template: `
    <div class="alain-default__item d-flex align-items-center px-sm" nz-dropdown nzPlacement="bottomRight" [nzDropdownMenu]="userMenu">
      <nz-avatar [nzSrc]="user.avatar" nzSize="small" class="mr-sm"></nz-avatar>
      {{ user.name }}
    </div>
    <nz-dropdown-menu #userMenu="nzDropdownMenu">
      <div nz-menu class="width-sm">
        <div nz-menu-item>
          <i nz-icon nzType="user" class="mr-sm"></i>
          個人中心
        </div>
        <div nz-menu-item>
          <i nz-icon nzType="setting" class="mr-sm"></i>
          個人設置
        </div>
        <li nz-menu-divider></li>
        <div nz-menu-item (click)="logout()">
          <i nz-icon nzType="logout" class="mr-sm"></i>
          退出登錄
        </div>
      </div>
    </nz-dropdown-menu>
  `,
    standalone: true,
    imports: [NzAvatarModule, NzDropDownModule, NzIconModule, NzMenuModule]
})
export class HeaderUserComponent {
    private readonly settings = inject(SettingsService);
    private readonly tokenService = inject(DA_SERVICE_TOKEN);
    private readonly router = inject(Router);

    get user(): User {
        return this.settings.user;
    }

    logout(): void {
        this.tokenService.clear();
        this.router.navigateByUrl('/passport/login');
    }
}