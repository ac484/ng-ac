import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SettingsService, User } from '@delon/theme';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { AuthApplicationService } from 'src/app/domain/auth/application/services/auth-application.service';
import { I18nPipe } from '@delon/theme';
import { Auth, authState } from '@angular/fire/auth';
import { firstValueFrom, filter, take } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'header-user',
  template: `
    <div
      class="alain-default__nav-item d-flex align-items-center px-sm"
      nz-dropdown
      nzPlacement="bottomRight"
      [nzDropdownMenu]="userMenu"
    >
      <nz-avatar [nzSrc]="user.avatar" nzSize="small" class="mr-sm" />
      {{ user.name }}
    </div>
    <nz-dropdown-menu #userMenu="nzDropdownMenu">
      <div nz-menu class="width-sm">
        <div nz-menu-item routerLink="/user/profile">
          <i nz-icon nzType="user" class="mr-sm"></i>
          {{ 'menu.account.profile' | i18n }}
        </div>
        <div nz-menu-item routerLink="/user/settings">
          <i nz-icon nzType="setting" class="mr-sm"></i>
          {{ 'menu.account.settings' | i18n }}
        </div>
        <li nz-menu-divider></li>
        <div nz-menu-item (click)="logout()">
          <i nz-icon nzType="logout" class="mr-sm"></i>
          {{ 'menu.account.logout' | i18n }}
        </div>
      </div>
    </nz-dropdown-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NzDropDownModule, NzMenuModule, NzIconModule, I18nPipe, NzAvatarModule]
})
export class HeaderUserComponent {
  private readonly settings = inject(SettingsService);
  private readonly authService = inject(AuthApplicationService);
  private readonly router = inject(Router);
  private readonly auth = inject(Auth);
  private readonly message = inject(NzMessageService);

  get user(): User {
    return this.settings.user;
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      this.message.success('Logout successful! Redirecting...');
      // Wait for the auth state to be confirmed before navigating
      await firstValueFrom(authState(this.auth).pipe(filter(user => user === null), take(1)));
      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('Logout failed:', error);
      this.message.error('Logout failed.');
    }
  }
}
