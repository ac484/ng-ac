import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TitleService, stepPreloader } from '@delon/theme';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { SettingsService } from '@delon/theme';
import { ACLService } from '@delon/acl';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { SHARED_IMPORTS } from './shared/shared-imports';
import { ThemeBtnComponent } from '@delon/theme/theme-btn';
import { SettingDrawerModule } from '@delon/theme/setting-drawer';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet />
    <theme-btn />
    @if (showSettingDrawer) {
      <setting-drawer />
    }
  `,
  imports: [RouterOutlet, ...SHARED_IMPORTS, ThemeBtnComponent, SettingDrawerModule],
  standalone: true
})
export class AppComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly titleSrv = inject(TitleService);
  private readonly modalSrv = inject(NzModalService);
  private readonly auth = inject(Auth);
  private readonly settingsService = inject(SettingsService);
  private readonly aclService = inject(ACLService);
  private readonly tokenService = inject(DA_SERVICE_TOKEN);

  showSettingDrawer = !environment.production;
  private donePreloader = stepPreloader();

  ngOnInit(): void {
    // Centralized auth state listener
    onAuthStateChanged(this.auth, async user => {
      if (user) {
        console.log('AppComponent: User signed in. Setting app state.');
        try {
          const idToken = await user.getIdToken();
          const displayName = user.isAnonymous ? '匿名用戶' : user.displayName || user.email || '用戶';

          this.settingsService.setUser({
            name: displayName,
            avatar: user.photoURL,
            email: user.email,
            uid: user.uid
          });

          this.tokenService.set({
            token: idToken,
            name: displayName,
            avatar: user.photoURL,
            email: user.email,
            uid: user.uid
          });

          this.aclService.setFull(true);
        } catch (error) {
          console.error('AppComponent: Error setting auth state:', error);
          this.clearAuthState();
        }
      } else {
        console.log('AppComponent: User signed out. Clearing app state.');
        this.clearAuthState();
      }
    });

    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        this.donePreloader();
        this.titleSrv.setTitle();
        this.modalSrv.closeAll();
      }
    });
  }

  private clearAuthState(): void {
    this.settingsService.setUser(null);
    this.tokenService.clear();
    this.aclService.setFull(false);
  }
}
