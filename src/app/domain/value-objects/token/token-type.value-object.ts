/**
 * Token 類型值物件
 */
export class TokenType {
  private readonly value: TokenTypeEnum;

  constructor(type: TokenTypeEnum) {
    this.value = type;
  }

  getValue(): TokenTypeEnum {
    return this.value;
  }

  isBearer(): boolean {
    return this.value === TokenTypeEnum.BEARER;
  }

  isFirebaseIdToken(): boolean {
    return this.value === TokenTypeEnum.FIREBASE_ID_TOKEN;
  }
}

export enum TokenTypeEnum {
  BEARER = 'Bearer',
  FIREBASE_ID_TOKEN = 'FirebaseIdToken',
  REFRESH_TOKEN = 'RefreshToken'
} 