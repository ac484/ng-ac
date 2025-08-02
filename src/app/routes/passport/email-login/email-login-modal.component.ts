/**
 * 郵箱登入模態元件（已簡化）
 *
 * 本檔案依據 Firebase Console 專案設定，使用 Firebase Client SDK 操作 Authentication
 * 提供郵箱登入的模態介面
 */

import { Component } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

import { EmailLoginFormComponent } from './email-login-form.component';
import { EmailRegisterFormComponent } from './email-register-form.component';
import { EmailResetFormComponent } from './email-reset-form.component';

@Component({
  selector: 'app-email-login-modal',
  standalone: true,
  imports: [NzTabsModule, EmailLoginFormComponent, EmailRegisterFormComponent, EmailResetFormComponent],
  template: `
    <nz-tabset>
      <nz-tab nzTitle="登入">
        <app-email-login-form></app-email-login-form>
      </nz-tab>
      <nz-tab nzTitle="註冊">
        <app-email-register-form></app-email-register-form>
      </nz-tab>
      <nz-tab nzTitle="重設密碼">
        <app-email-reset-form></app-email-reset-form>
      </nz-tab>
    </nz-tabset>
  `,
  styles: []
})
export class EmailLoginModalComponent {
  constructor(private modalRef: NzModalRef) {}

  closeModal(): void {
    this.modalRef.close();
  }
}
