import { Component, OnInit, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';

// Firebase Auth imports
import { FirebaseAuthService } from '@core/services/firebase/firebase-auth.service';

import { LoginInOutService } from '@core/services/common/login-in-out.service';
import { LoginService } from '@core/services/http/login/login.service';
import { SpinService } from '@store/common-store/spin.service';
import { fnCheckForm } from '@utils/tools';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NzFormModule, ReactiveFormsModule, NzTabsModule, NzGridModule, NzButtonModule, NzInputModule, NzWaveModule, NzCheckboxModule, NzIconModule, RouterLink]
})
export class LoginFormComponent implements OnInit {
  validateForm!: FormGroup;
  destroyRef = inject(DestroyRef);

  private fb = inject(FormBuilder);
  private notification = inject(NzNotificationService);
  private router = inject(Router);
  private spinService = inject(SpinService);
  private dataService = inject(LoginService);
  private loginInOutService = inject(LoginInOutService);
  private firebaseAuthService = inject(FirebaseAuthService);

  submitForm(): void {
    // 校验表单
    if (!fnCheckForm(this.validateForm)) {
      return;
    }
    // 设置全局loading
    this.spinService.setCurrentGlobalSpinStore(true);
    // 获取表单的值
    const param = this.validateForm.getRawValue();
    // 调用登录接口
    // todo 登录后台返回统一模式为,如果code不为0，会自动被拦截，如果需要修改，请在src/app/core/services/http/base-http.service.ts中进行修改
    // {
    //   code:number,
    //   data:any,
    //   msg：string
    // }
    this.dataService
      .login(param)
      .pipe(
        // 无论如何设置全局loading为false
        finalize(() => {
          this.spinService.setCurrentGlobalSpinStore(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(userToken => {
        // 这里后台登录成功以后，只会返回一套由jwt加密的token，下面需要对token进行解析
        this.loginInOutService
          .loginIn(userToken)
          .then(() => {
            this.router.navigateByUrl('default/dashboard/analysis');
          })
          .finally(() => {
            this.spinService.setCurrentGlobalSpinStore(false);
            this.notification.blank(
              '温馨提示',
              `
                源码地址：<a href="https://github.com/huajian123/ng-ant-admin">在这里</a>
            `,
              {
                nzPlacement: 'top',
                nzDuration: 0
              }
            );
          });
      });
  }

  // Firebase 匿名登入
  async signInAnonymously(): Promise<void> {
    try {
      this.spinService.setCurrentGlobalSpinStore(true);

      console.log('🔥 開始 Firebase 匿名登入...');

      // 使用 Firebase Auth 服務進行匿名登入
      const { user, idToken, compatibleToken } = await this.firebaseAuthService.signInAnonymously();

      console.log('🔥 Firebase 匿名登入成功:', {
        uid: user.uid,
        isAnonymous: user.isAnonymous,
        idTokenLength: idToken.length,
        compatibleTokenLength: compatibleToken.length
      });

      console.log('🔥 Firebase ID Token:', idToken);
      console.log('🔥 兼容 JWT Token:', compatibleToken);

      if (user) {
        // 創建一個與原有系統完全兼容的 token 對象
        const firebaseUserToken = {
          compatibleToken: compatibleToken, // 兼容的 JWT token
          firebaseIdToken: idToken, // 原始 Firebase ID token
          uid: user.uid,
          isAnonymous: user.isAnonymous,
          firebaseUser: true
        };

        console.log('🔥 準備調用 loginIn 服務:', firebaseUserToken);

        // 使用現有的登入服務處理 Firebase 用戶，流程與傳統登入完全一致
        await this.loginInOutService.loginIn(firebaseUserToken);

        console.log('🔥 loginIn 服務調用成功');

        this.notification.success(
          '登入成功',
          '已使用匿名方式登入系統',
          {
            nzPlacement: 'top',
            nzDuration: 3000
          }
        );

        // 導航到主頁面
        this.router.navigateByUrl('default/dashboard/analysis');
      }
    } catch (error: any) {
      console.error('🔥 Firebase 匿名登入失敗:', error);
      this.notification.error(
        '登入失敗',
        error.message || '匿名登入過程中發生錯誤',
        {
          nzPlacement: 'top',
          nzDuration: 5000
        }
      );
    } finally {
      this.spinService.setCurrentGlobalSpinStore(false);
    }
  }

  // Firebase Google 登入
  async signInWithGoogle(): Promise<void> {
    try {
      this.spinService.setCurrentGlobalSpinStore(true);

      console.log('🔥 開始 Firebase Google 登入...');

      // 使用 Firebase Auth 服務進行 Google 登入
      const { user, idToken, compatibleToken } = await this.firebaseAuthService.signInWithGoogle();

      console.log('🔥 Firebase Google 登入成功:', {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        isAnonymous: user.isAnonymous,
        idTokenLength: idToken.length,
        compatibleTokenLength: compatibleToken.length
      });

      if (user) {
        // 創建一個與原有系統完全兼容的 token 對象
        const firebaseUserToken = {
          compatibleToken: compatibleToken, // 兼容的 JWT token
          firebaseIdToken: idToken, // 原始 Firebase ID token
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          isAnonymous: user.isAnonymous,
          firebaseUser: true
        };

        console.log('🔥 準備調用 loginIn 服務:', firebaseUserToken);

        // 使用現有的登入服務處理 Firebase 用戶，流程與傳統登入完全一致
        await this.loginInOutService.loginIn(firebaseUserToken);

        console.log('🔥 loginIn 服務調用成功');

        this.notification.success(
          '登入成功',
          `歡迎 ${user.displayName || user.email}！已使用 Google 帳號登入系統`,
          {
            nzPlacement: 'top',
            nzDuration: 3000
          }
        );

        // 導航到主頁面
        this.router.navigateByUrl('default/dashboard/analysis');
      }
    } catch (error: any) {
      console.error('🔥 Firebase Google 登入失敗:', error);

      let errorMessage = 'Google 登入過程中發生錯誤';

      // 處理常見的 Google 登入錯誤
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = '登入視窗已關閉，請重新嘗試';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = '彈出視窗被阻擋，請允許彈出視窗後重試';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = '登入請求已取消';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = '網路連線失敗，請檢查網路狀態';
      }

      this.notification.error(
        '登入失敗',
        errorMessage,
        {
          nzPlacement: 'top',
          nzDuration: 5000
        }
      );
    } finally {
      this.spinService.setCurrentGlobalSpinStore(false);
    }
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [null]
    });
  }
}
