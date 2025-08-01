import { HttpContext } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StartupService } from '@core';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { ALLOW_ANONYMOUS, DA_SERVICE_TOKEN, SocialOpenType, SocialService } from '@delon/auth';
import { I18nPipe, SettingsService, _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTabChangeEvent, NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { finalize, switchMap } from 'rxjs';

// Firebase Auth 相關 imports
import { FirebaseAuthAdapterService } from '../../../core/auth/firebase-auth-adapter.service';
import { AuthStateManagerService } from '../../../core/auth/auth-state-manager.service';

@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [SocialService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    I18nPipe,
    NzCheckboxModule,
    NzTabsModule,
    NzAlertModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzToolTipModule,
    NzIconModule
  ]
})
export class UserLoginComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly settingsService = inject(SettingsService);
  private readonly socialService = inject(SocialService);
  private readonly reuseTabService = inject(ReuseTabService, { optional: true });
  private readonly tokenService = inject(DA_SERVICE_TOKEN);
  private readonly startupSrv = inject(StartupService);
  private readonly http = inject(_HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);
  
  // Firebase Auth 服務
  private readonly firebaseAuth = inject(FirebaseAuthAdapterService);
  private readonly authStateManager = inject(AuthStateManagerService);

  form = inject(FormBuilder).nonNullable.group({
    userName: ['', [Validators.required, Validators.email]], // 改為 email 驗證
    password: ['', [Validators.required, Validators.minLength(6)]], // 改為最少 6 字元
    mobile: ['', [Validators.required, Validators.pattern(/^1\d{10}$/)]],
    captcha: ['', [Validators.required]],
    remember: [true]
  });
  error = '';
  type = 0;
  loading = false;

  count = 0;
  interval$: any;

  switch({ index }: NzTabChangeEvent): void {
    this.type = index!;
  }

  getCaptcha(): void {
    const mobile = this.form.controls.mobile;
    if (mobile.invalid) {
      mobile.markAsDirty({ onlySelf: true });
      mobile.updateValueAndValidity({ onlySelf: true });
      return;
    }
    this.count = 59;
    this.interval$ = setInterval(() => {
      this.count -= 1;
      if (this.count <= 0) {
        clearInterval(this.interval$);
      }
    }, 1000);
  }

  submit(): void {
    this.error = '';
    
    if (this.type === 0) {
      // Email/Password 登入
      const { userName, password } = this.form.controls;
      userName.markAsDirty();
      userName.updateValueAndValidity();
      password.markAsDirty();
      password.updateValueAndValidity();
      if (userName.invalid || password.invalid) {
        return;
      }

      this.loading = true;
      this.cdr.detectChanges();

      // 使用 Firebase Auth 進行登入
      this.firebaseAuth.signIn(userName.value, password.value)
        .pipe(
          switchMap((userCredential) => {
            if (!userCredential) {
              throw new Error('登入失敗');
            }
            // 清空路由復用信息
            this.reuseTabService?.clear();
            
            // 重新獲取 StartupService 內容
            return this.startupSrv.load();
          }),
          finalize(() => {
            this.loading = false;
            this.cdr.detectChanges();
          })
        )
        .subscribe({
          next: () => {
            // 登入成功，導航到目標頁面
            let url = this.tokenService.referrer?.url || '/';
            if (url.includes('/passport')) {
              url = '/';
            }
            this.router.navigateByUrl(url);
          },
          error: (error: any) => {
            // 處理 Firebase Auth 錯誤
            this.error = this.getFirebaseErrorMessage(error);
            this.cdr.detectChanges();
          }
        });
    } else {
      // 手機號登入（保持原有邏輯，因為 Firebase 不直接支援手機號登入）
      const { mobile, captcha } = this.form.controls;
      mobile.markAsDirty();
      mobile.updateValueAndValidity();
      captcha.markAsDirty();
      captcha.updateValueAndValidity();
      if (mobile.invalid || captcha.invalid) {
        return;
      }

      // 這裡可以保持原有的 HTTP 請求邏輯，或者實作 Firebase 手機號認證
      this.loading = true;
      this.cdr.detectChanges();
      this.http
        .post(
          '/login/account',
          {
            type: this.type,
            mobile: this.form.value.mobile,
            captcha: this.form.value.captcha
          },
          null,
          {
            context: new HttpContext().set(ALLOW_ANONYMOUS, true)
          }
        )
        .pipe(
          finalize(() => {
            this.loading = false;
            this.cdr.detectChanges();
          })
        )
        .subscribe(res => {
          if (res.msg !== 'ok') {
            this.error = res.msg;
            this.cdr.detectChanges();
            return;
          }
          // 清空路由復用信息
          this.reuseTabService?.clear();
          // 設置用戶 Token 信息
          res.user.expired = +new Date() + 1000 * 60 * 5;
          this.tokenService.set(res.user);
          // 重新獲取 StartupService 內容
          this.startupSrv.load().subscribe(() => {
            let url = this.tokenService.referrer!.url || '/';
            if (url.includes('/passport')) {
              url = '/';
            }
            this.router.navigateByUrl(url);
          });
        });
    }
  }

  open(type: string, openType: SocialOpenType = 'href'): void {
    let url = ``;
    let callback = ``;
    if (environment.production) {
      callback = `https://ng-alain.github.io/ng-alain/#/passport/callback/${type}`;
    } else {
      callback = `http://localhost:4200/#/passport/callback/${type}`;
    }
    switch (type) {
      case 'auth0':
        url = `//cipchk.auth0.com/login?client=8gcNydIDzGBYxzqV0Vm1CX_RXH-wsWo5&redirect_uri=${decodeURIComponent(callback)}`;
        break;
      case 'github':
        url = `//github.com/login/oauth/authorize?client_id=9d6baae4b04a23fcafa2&response_type=code&redirect_uri=${decodeURIComponent(
          callback
        )}`;
        break;
      case 'weibo':
        url = `https://api.weibo.com/oauth2/authorize?client_id=1239507802&response_type=code&redirect_uri=${decodeURIComponent(callback)}`;
        break;
    }
    if (openType === 'window') {
      this.socialService
        .login(url, '/', {
          type: 'window'
        })
        .subscribe(res => {
          if (res) {
            this.settingsService.setUser(res);
            this.router.navigateByUrl('/');
          }
        });
    } else {
      this.socialService.login(url, '/', {
        type: 'href'
      });
    }
  }

  /**
   * 將 Firebase 錯誤轉換為用戶友好的訊息
   */
  private getFirebaseErrorMessage(error: any): string {
    const errorCode = error?.code || error?.message || '';
    
    switch (errorCode) {
      case 'auth/user-not-found':
        return '找不到此用戶，請檢查 email 是否正確';
      case 'auth/wrong-password':
        return '密碼錯誤，請重新輸入';
      case 'auth/invalid-email':
        return 'Email 格式不正確';
      case 'auth/user-disabled':
        return '此帳戶已被停用';
      case 'auth/too-many-requests':
        return '登入嘗試次數過多，請稍後再試';
      case 'auth/network-request-failed':
        return '網路連線失敗，請檢查網路狀態';
      case 'auth/invalid-credential':
        return 'Email 或密碼錯誤';
      default:
        return error?.message || '登入失敗，請稍後再試';
    }
  }

  ngOnDestroy(): void {
    if (this.interval$) {
      clearInterval(this.interval$);
    }
  }
}
