import { HttpClient } from '@angular/common/http';
import { EnvironmentProviders, Injectable, Provider, inject, provideAppInitializer } from '@angular/core';
import { Router } from '@angular/router';
import { ACLService } from '@delon/acl';
import { ALAIN_I18N_TOKEN, MenuService, SettingsService, TitleService } from '@delon/theme';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Observable, zip, catchError, map } from 'rxjs';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { DA_SERVICE_TOKEN } from '@delon/auth';

/**
 * Used for application startup
 * Generally used to get the basic data of the application, like: Menu Data, User Data, etc.
 */
export function provideStartup(): Array<Provider | EnvironmentProviders> {
    return [
        StartupService,
        provideAppInitializer(() => {
            const initializerFn = (
                (startupService: StartupService) => () =>
                    startupService.load()
            )(inject(StartupService));
            return initializerFn();
        })
    ];
}

@Injectable()
export class StartupService {
    private menuService = inject(MenuService);
    private settingService = inject(SettingsService);
    private aclService = inject(ACLService);
    private titleService = inject(TitleService);
    private httpClient = inject(HttpClient);
    private router = inject(Router);
    private auth = inject(Auth);
    private tokenService = inject(DA_SERVICE_TOKEN);

    load(): Observable<void> {
        return new Observable<void>(observer => {
            // 監聽 Firebase 認證狀態
            const unsubscribe = onAuthStateChanged(this.auth, (user) => {
                unsubscribe();

                if (user) {
                    console.log('StartupService: 用戶已登入:', user.email);

                    // 設置用戶信息
                    this.settingService.setUser({
                        name: user.displayName || user.email || 'User',
                        avatar: user.photoURL,
                        email: user.email,
                        uid: user.uid
                    });

                    // 確保 @delon/auth 有正確的 token
                    if (!this.tokenService.get()?.token) {
                        user.getIdToken().then(idToken => {
                            this.tokenService.set({
                                token: idToken,
                                name: user.displayName || user.email || 'User',
                                avatar: user.photoURL,
                                email: user.email,
                                uid: user.uid,
                                expired: +new Date() + 1000 * 60 * 60 * 24 * 7
                            });
                        });
                    }

                    // 設置 ACL 權限
                    this.aclService.setFull(true);

                    // 設置頁面標題
                    this.titleService.default = '';
                    this.titleService.suffix = 'NG-AC';

                    observer.next();
                    observer.complete();
                } else {
                    console.log('StartupService: 用戶未登入');

                    // 清理用戶信息
                    this.settingService.setUser(null);

                    // 清理 @delon/auth 的 token
                    this.tokenService.clear();

                    // 清理 ACL 權限
                    this.aclService.setFull(false);

                    observer.next();
                    observer.complete();
                }
            });
        });
    }
}
