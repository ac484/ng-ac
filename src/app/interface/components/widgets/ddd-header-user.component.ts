import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { I18nPipe, User } from '@delon/theme';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { Subject, takeUntil } from 'rxjs';

// DDD Application Services
import { AuthApplicationService } from '../../../application/services/auth-application.service';
import { UserApplicationService } from '../../../application/services/user-application.service';

@Component({
  selector: 'ddd-header-user',
  template: `
    <div class="alain-default__nav-item d-flex align-items-center px-sm" nz-dropdown nzPlacement="bottomRight" [nzDropdownMenu]="userMenu">
      <nz-avatar [nzSrc]="currentUser?.avatar || './assets/tmp/img/avatar.jpg'" nzSize="small" class="mr-sm" />
      {{ currentUser?.name || 'User' }}
    </div>
    <nz-dropdown-menu #userMenu="nzDropdownMenu">
      <div nz-menu class="width-sm">
        <div nz-menu-item routerLink="/pro/account/center">
          <i nz-icon nzType="user" class="mr-sm"></i>
          {{ 'menu.account.center' | i18n }}
        </div>
        <div nz-menu-item routerLink="/pro/account/settings">
          <i nz-icon nzType="setting" class="mr-sm"></i>
          {{ 'menu.account.settings' | i18n }}
        </div>
        <div nz-menu-item routerLink="/exception/trigger">
          <i nz-icon nzType="close-circle" class="mr-sm"></i>
          {{ 'menu.account.trigger' | i18n }}
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
  imports: [CommonModule, RouterLink, NzDropDownModule, NzMenuModule, NzIconModule, I18nPipe, NzAvatarModule]
})
export class DddHeaderUserComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly authApplicationService = inject(AuthApplicationService);
  private readonly userApplicationService = inject(UserApplicationService);
  private readonly destroy$ = new Subject<void>();

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
      console.error('Error loading current user in header:', error);
    }
  }

  private subscribeToAuthChanges(): void {
    // Subscribe to authentication changes
    this.authApplicationService
      .getCurrentAuthentication()
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
          console.error('Error in auth subscription in header:', error);
        }
      });
  }

  async logout(): Promise<void> {
    try {
      await this.authApplicationService.signOut();
      this.router.navigateByUrl('/passport/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Fallback to direct navigation
      this.router.navigateByUrl('/passport/login');
    }
  }
}
