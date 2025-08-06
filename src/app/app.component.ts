import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TitleService, stepPreloader } from '@delon/theme';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { SettingsService } from '@delon/theme';
import { ACLService } from '@delon/acl';
import { SHARED_IMPORTS } from './shared/shared-imports';

@Component({
  selector: 'app-root',
  template: `<router-outlet />`,
  imports: [RouterOutlet, ...SHARED_IMPORTS],
  standalone: true
})
export class AppComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly titleSrv = inject(TitleService);
  private readonly modalSrv = inject(NzModalService);
  private readonly auth = inject(Auth);
  private readonly settingsService = inject(SettingsService);
  private readonly aclService = inject(ACLService);

  private donePreloader = stepPreloader();

  ngOnInit(): void {
    // 監聽認證狀態變化
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        console.log('用戶已登入:', user.email, user.isAnonymous ? '(匿名)' : '');

        // 根據用戶類型設置不同的顯示名稱
        let displayName: string;
        if (user.isAnonymous) {
          displayName = '匿名用戶';
        } else {
          displayName = user.displayName || user.email || '用戶';
        }

        this.settingsService.setUser({
          name: displayName,
          avatar: user.photoURL,
          email: user.email,
          uid: user.uid
        });
        this.aclService.setFull(true);
      } else {
        console.log('用戶已登出');
        this.settingsService.setUser(null);
        this.aclService.setFull(false);
        // 如果用戶登出且不在登入頁面，導航到登入頁面
        if (!this.router.url.includes('/auth/')) {
          this.router.navigate(['/auth/login']);
        }
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
}
