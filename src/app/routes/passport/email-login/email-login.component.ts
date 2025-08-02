/**
 * 郵箱登入主要元件
 *
 * 本檔案依據 Firebase Console 專案設定，使用 Firebase Client SDK 操作 Authentication
 * 提供郵箱登入的主要介面
 */

import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

import { EmailLoginFormComponent } from './email-login-form.component';
import { EmailRegisterFormComponent } from './email-register-form.component';
import { EmailResetFormComponent } from './email-reset-form.component';

@Component({
  selector: 'app-email-login',
  standalone: true,
  imports: [
    NzButtonModule,
    NzIconModule,
    NzModalModule,
    NzTabsModule,
    EmailLoginFormComponent,
    EmailRegisterFormComponent,
    EmailResetFormComponent
  ],
  template: `
    <i nz-icon nzType="mail" nzTheme="outline" class="icon" (click)="showModal()"></i>

    <nz-modal [(nzVisible)]="isVisible" nzTitle="郵箱登入" [nzFooter]="null" (nzOnCancel)="handleCancel()">
      <ng-container *nzModalContent>
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
      </ng-container>
    </nz-modal>
  `,
  styles: []
})
export class EmailLoginComponent {
  isVisible = false;

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
