import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { LoginCommand } from '../dto/commands/login.command';
import { LoginResponse } from '../dto/responses/login.response';
import { AuthBridgeService } from '../services/auth-bridge.service';

/**
 * 登入用例
 * 處理用戶登入的業務邏輯
 */
@Injectable({
  providedIn: 'root'
})
export class LoginUseCase {
  private readonly authBridge = inject(AuthBridgeService);

  /**
   * 執行登入
   */
  execute(command: LoginCommand): Observable<LoginResponse> {
    switch (command.type) {
      case 'email':
        return this.authBridge.signInWithEmailPassword(command.email!, command.password!);

      case 'google':
        return this.authBridge.signInWithGoogle();

      default:
        throw new Error(`Unsupported login type: ${command.type}`);
    }
  }
}
