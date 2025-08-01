import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { JwtHelperService } from '@auth0/angular-jwt';

export interface UserInfo {
  userId: number;
  authCode: string[];
}

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  private userInfo$ = new BehaviorSubject<UserInfo>({ userId: -1, authCode: [] });

  parsToken(token: string): UserInfo {
    console.log('🔥 parsToken 開始解析 token:', token);
    const helper = new JwtHelperService();
    try {
      const decodedToken = helper.decodeToken(token);
      console.log('🔥 JWT 解析成功:', decodedToken);

      const { rol, userId } = decodedToken;
      const userInfo = {
        userId,
        authCode: rol.split(',')
      };

      console.log('🔥 解析後的用戶信息:', userInfo);
      return userInfo;
    } catch (e) {
      console.error('🔥 JWT 解析失敗:', e);
      console.log('🔥 返回預設用戶信息');
      return {
        userId: -1,
        authCode: []
      };
    }
  }

  setUserInfo(userInfo: UserInfo): void {
    this.userInfo$.next(userInfo);
  }

  getUserInfo(): Observable<UserInfo> {
    return this.userInfo$.asObservable();
  }
}
