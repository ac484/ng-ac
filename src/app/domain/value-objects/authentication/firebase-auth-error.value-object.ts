/**
 * Firebase 錯誤處理值物件
 * 使用懶加載處理錯誤訊息，避免重複的函式實作
 */

// 錯誤訊息映射常數
const FIREBASE_AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/user-not-found': '用戶不存在',
  'auth/wrong-password': '密碼錯誤',
  'auth/email-already-in-use': '郵箱已被使用',
  'auth/network-request-failed': '網絡連接失敗',
  'auth/too-many-requests': '請求過於頻繁，請稍後再試',
  'auth/user-disabled': '用戶已被禁用',
  'auth/invalid-email': '郵箱格式無效',
  'auth/weak-password': '密碼強度不足',
  'auth/invalid-credential': '無效的憑證',
  'auth/operation-not-allowed': '操作不被允許',
  'auth/account-exists-with-different-credential': '帳戶已存在但使用不同的憑證',
  'auth/requires-recent-login': '需要重新登入',
  'auth/popup-blocked': '彈出視窗被阻擋',
  'auth/popup-closed-by-user': '用戶關閉了彈出視窗',
  'auth/redirect-cancelled-by-user': '用戶取消了重定向',
  'auth/redirect-operation-pending': '重定向操作正在進行中',
  'auth/invalid-user-token': '無效的用戶令牌',
  'auth/user-token-expired': '用戶令牌已過期',
  'auth/user-mismatch': '用戶不匹配',
  'auth/user-signed-out': '用戶已登出',
  'auth/user-cancelled': '用戶取消了操作',
  'auth/invalid-api-key': '無效的 API 金鑰',
  'auth/invalid-app-credential': '無效的應用憑證',
  'auth/invalid-app-id': '無效的應用 ID',
  'auth/invalid-auth-event': '無效的認證事件',
  'auth/invalid-cert-hash': '無效的證書雜湊',
  'auth/invalid-verification-code': '無效的驗證碼',
  'auth/invalid-continue-uri': '無效的繼續 URI',
  'auth/invalid-cordova-configuration': '無效的 Cordova 配置',
  'auth/invalid-custom-token': '無效的自定義令牌',
  'auth/invalid-dynamic-link-domain': '無效的動態連結域名',
  'auth/invalid-emulator-scheme': '無效的模擬器方案',
  'auth/invalid-message-payload': '無效的消息載荷',
  'auth/invalid-multi-factor-session': '無效的多因素認證會話',
  'auth/invalid-oauth-client-id': '無效的 OAuth 客戶端 ID',
  'auth/invalid-oauth-provider': '無效的 OAuth 提供商',
  'auth/invalid-action-code': '無效的操作碼',
  'auth/unauthorized-domain': '未授權的域名',
  'auth/invalid-persistence-type': '無效的持久化類型',
  'auth/invalid-phone-number': '無效的電話號碼',
  'auth/invalid-provider-id': '無效的提供商 ID',
  'auth/invalid-recipient-email': '無效的收件人郵箱',
  'auth/invalid-sender': '無效的發送者',
  'auth/invalid-verification-id': '無效的驗證 ID',
  'auth/invalid-tenant-id': '無效的租戶 ID',
  'auth/multi-factor-info-not-found': '多因素認證信息未找到',
  'auth/multi-factor-auth-required': '需要多因素認證',
  'auth/missing-android-pkg-name': '缺少 Android 包名',
  'auth/missing-app-credential': '缺少應用憑證',
  'auth/auth-domain-config-required': '需要認證域名配置',
  'auth/missing-verification-code': '缺少驗證碼',
  'auth/missing-continue-uri': '缺少繼續 URI',
  'auth/missing-iframe-start': '缺少 iframe 開始',
  'auth/missing-ios-bundle-id': '缺少 iOS Bundle ID',
  'auth/missing-or-invalid-nonce': '缺少或無效的 nonce',
  'auth/missing-multi-factor-info': '缺少多因素認證信息',
  'auth/missing-multi-factor-session': '缺少多因素認證會話',
  'auth/missing-phone-number': '缺少電話號碼',
  'auth/missing-verification-id': '缺少驗證 ID',
  'auth/app-deleted': '應用已刪除',
  'auth/no-auth-event': '無認證事件',
  'auth/no-such-provider': '無此提供商',
  'auth/operation-not-supported-in-this-environment': '在此環境中不支持此操作',
  'auth/provider-already-linked': '提供商已連結',
  'auth/quota-exceeded': '配額已超出',
  'auth/rejected-credential': '憑證被拒絕',
  'auth/second-factor-already-in-use': '第二因素已在使用中',
  'auth/maximum-second-factor-count-exceeded': '超出最大第二因素數量',
  'auth/tenant-id-mismatch': '租戶 ID 不匹配',
  'auth/timeout': '超時',
  'auth/unauthorized-continue-uri': '未授權的繼續 URI',
  'auth/unsupported-first-factor': '不支持的第一因素',
  'auth/unsupported-persistence-type': '不支持的持久化類型',
  'auth/unsupported-tenant-operation': '不支持的租戶操作',
  'auth/unverified-email': '未驗證的郵箱',
  'auth/web-storage-unsupported': '不支持的 Web 存儲',
  'auth/already-initialized': '已經初始化',
  'auth/recaptcha-not-enabled': 'reCAPTCHA 未啟用',
  'auth/missing-recaptcha-token': '缺少 reCAPTCHA 令牌',
  'auth/invalid-recaptcha-token': '無效的 reCAPTCHA 令牌',
  'auth/invalid-recaptcha-action': '無效的 reCAPTCHA 操作',
  'auth/missing-client-type': '缺少客戶端類型',
  'auth/missing-recaptcha-version': '缺少 reCAPTCHA 版本',
  'auth/invalid-recaptcha-version': '無效的 reCAPTCHA 版本',
  'auth/invalid-req-type': '無效的請求類型',
  'auth/invalid-hosting-link-domain': '無效的託管連結域名'
};

export class FirebaseAuthError {
  private readonly code: string;
  private readonly message: string;
  private readonly localizedMessage: string;

  constructor(error: any) {
    this.code = error.code || 'unknown';
    this.message = error.message || 'Unknown error';
    this.localizedMessage = this.computeLocalizedMessage(this.code);
  }

  getCode(): string {
    return this.code;
  }

  getMessage(): string {
    return this.message;
  }

  getLocalizedMessage(): string {
    return this.localizedMessage;
  }

  /**
   * 檢查錯誤代碼是否匹配
   */
  isErrorCode(errorCode: string): boolean {
    return this.code === errorCode;
  }

  /**
   * 檢查是否為網絡錯誤
   */
  isNetworkError(): boolean {
    return this.isErrorCode('auth/network-request-failed');
  }

  /**
   * 檢查是否為用戶不存在錯誤
   */
  isUserNotFound(): boolean {
    return this.isErrorCode('auth/user-not-found');
  }

  /**
   * 檢查是否為密碼錯誤
   */
  isWrongPassword(): boolean {
    return this.isErrorCode('auth/wrong-password');
  }

  /**
   * 檢查是否為郵箱已被使用錯誤
   */
  isEmailAlreadyInUse(): boolean {
    return this.isErrorCode('auth/email-already-in-use');
  }

  /**
   * 檢查是否為請求過於頻繁錯誤
   */
  isTooManyRequests(): boolean {
    return this.isErrorCode('auth/too-many-requests');
  }

  /**
   * 檢查是否為用戶被禁用錯誤
   */
  isUserDisabled(): boolean {
    return this.isErrorCode('auth/user-disabled');
  }

  /**
   * 檢查是否為無效郵箱錯誤
   */
  isInvalidEmail(): boolean {
    return this.isErrorCode('auth/invalid-email');
  }

  /**
   * 檢查是否為弱密碼錯誤
   */
  isWeakPassword(): boolean {
    return this.isErrorCode('auth/weak-password');
  }

  /**
   * 檢查是否為無效憑證錯誤
   */
  isInvalidCredential(): boolean {
    return this.isErrorCode('auth/invalid-credential');
  }

  /**
   * 檢查是否為操作不被允許錯誤
   */
  isOperationNotAllowed(): boolean {
    return this.isErrorCode('auth/operation-not-allowed');
  }

  /**
   * 檢查是否為帳戶已存在但使用不同憑證錯誤
   */
  isAccountExistsWithDifferentCredential(): boolean {
    return this.isErrorCode('auth/account-exists-with-different-credential');
  }

  /**
   * 檢查是否為需要重新登入錯誤
   */
  isRequiresRecentLogin(): boolean {
    return this.isErrorCode('auth/requires-recent-login');
  }

  /**
   * 檢查是否為彈出視窗被阻擋錯誤
   */
  isPopUpBlocked(): boolean {
    return this.isErrorCode('auth/popup-blocked');
  }

  /**
   * 檢查是否為用戶關閉彈出視窗錯誤
   */
  isPopUpClosedByUser(): boolean {
    return this.isErrorCode('auth/popup-closed-by-user');
  }

  /**
   * 檢查是否為用戶取消重定向錯誤
   */
  isRedirectCancelledByUser(): boolean {
    return this.isErrorCode('auth/redirect-cancelled-by-user');
  }

  /**
   * 檢查是否為重定向操作正在進行中錯誤
   */
  isRedirectOperationPending(): boolean {
    return this.isErrorCode('auth/redirect-operation-pending');
  }

  /**
   * 檢查是否為無效用戶令牌錯誤
   */
  isInvalidUserToken(): boolean {
    return this.isErrorCode('auth/invalid-user-token');
  }

  /**
   * 檢查是否為用戶令牌已過期錯誤
   */
  isUserTokenExpired(): boolean {
    return this.isErrorCode('auth/user-token-expired');
  }

  /**
   * 檢查是否為用戶不匹配錯誤
   */
  isUserMismatch(): boolean {
    return this.isErrorCode('auth/user-mismatch');
  }

  /**
   * 檢查是否為用戶已登出錯誤
   */
  isUserSignedOut(): boolean {
    return this.isErrorCode('auth/user-signed-out');
  }

  /**
   * 檢查是否為用戶取消操作錯誤
   */
  isUserCancelled(): boolean {
    return this.isErrorCode('auth/user-cancelled');
  }

  /**
   * 檢查是否為無效 API 金鑰錯誤
   */
  isInvalidApiKey(): boolean {
    return this.isErrorCode('auth/invalid-api-key');
  }

  /**
   * 檢查是否為無效應用憑證錯誤
   */
  isInvalidAppCredential(): boolean {
    return this.isErrorCode('auth/invalid-app-credential');
  }

  /**
   * 檢查是否為無效應用 ID 錯誤
   */
  isInvalidAppId(): boolean {
    return this.isErrorCode('auth/invalid-app-id');
  }

  /**
   * 檢查是否為無效認證事件錯誤
   */
  isInvalidAuthEvent(): boolean {
    return this.isErrorCode('auth/invalid-auth-event');
  }

  /**
   * 檢查是否為無效證書雜湊錯誤
   */
  isInvalidCertHash(): boolean {
    return this.isErrorCode('auth/invalid-cert-hash');
  }

  /**
   * 檢查是否為無效驗證碼錯誤
   */
  isInvalidCode(): boolean {
    return this.isErrorCode('auth/invalid-verification-code');
  }

  /**
   * 檢查是否為無效繼續 URI 錯誤
   */
  isInvalidContinueUri(): boolean {
    return this.isErrorCode('auth/invalid-continue-uri');
  }

  /**
   * 檢查是否為無效 Cordova 配置錯誤
   */
  isInvalidCordovaConfiguration(): boolean {
    return this.isErrorCode('auth/invalid-cordova-configuration');
  }

  /**
   * 檢查是否為無效自定義令牌錯誤
   */
  isInvalidCustomToken(): boolean {
    return this.isErrorCode('auth/invalid-custom-token');
  }

  /**
   * 檢查是否為無效動態連結域名錯誤
   */
  isInvalidDynamicLinkDomain(): boolean {
    return this.isErrorCode('auth/invalid-dynamic-link-domain');
  }

  /**
   * 檢查是否為無效模擬器方案錯誤
   */
  isInvalidEmulatorScheme(): boolean {
    return this.isErrorCode('auth/invalid-emulator-scheme');
  }

  /**
   * 檢查是否為無效身份提供商響應錯誤
   */
  isInvalidIdpResponse(): boolean {
    return this.isErrorCode('auth/invalid-credential');
  }

  /**
   * 檢查是否為無效登入憑證錯誤
   */
  isInvalidLoginCredentials(): boolean {
    return this.isErrorCode('auth/invalid-credential');
  }

  /**
   * 檢查是否為無效消息載荷錯誤
   */
  isInvalidMessagePayload(): boolean {
    return this.isErrorCode('auth/invalid-message-payload');
  }

  /**
   * 檢查是否為無效多因素認證會話錯誤
   */
  isInvalidMfaSession(): boolean {
    return this.isErrorCode('auth/invalid-multi-factor-session');
  }

  /**
   * 檢查是否為無效 OAuth 客戶端 ID 錯誤
   */
  isInvalidOauthClientId(): boolean {
    return this.isErrorCode('auth/invalid-oauth-client-id');
  }

  /**
   * 檢查是否為無效 OAuth 提供商錯誤
   */
  isInvalidOauthProvider(): boolean {
    return this.isErrorCode('auth/invalid-oauth-provider');
  }

  /**
   * 檢查是否為無效操作碼錯誤
   */
  isInvalidOobCode(): boolean {
    return this.isErrorCode('auth/invalid-action-code');
  }

  /**
   * 檢查是否為未授權域名錯誤
   */
  isInvalidOrigin(): boolean {
    return this.isErrorCode('auth/unauthorized-domain');
  }

  /**
   * 檢查是否為無效密碼錯誤
   */
  isInvalidPassword(): boolean {
    return this.isErrorCode('auth/wrong-password');
  }

  /**
   * 檢查是否為無效持久化類型錯誤
   */
  isInvalidPersistence(): boolean {
    return this.isErrorCode('auth/invalid-persistence-type');
  }

  /**
   * 檢查是否為無效電話號碼錯誤
   */
  isInvalidPhoneNumber(): boolean {
    return this.isErrorCode('auth/invalid-phone-number');
  }

  /**
   * 檢查是否為無效提供商 ID 錯誤
   */
  isInvalidProviderId(): boolean {
    return this.isErrorCode('auth/invalid-provider-id');
  }

  /**
   * 檢查是否為無效收件人郵箱錯誤
   */
  isInvalidRecipientEmail(): boolean {
    return this.isErrorCode('auth/invalid-recipient-email');
  }

  /**
   * 檢查是否為無效發送者錯誤
   */
  isInvalidSender(): boolean {
    return this.isErrorCode('auth/invalid-sender');
  }

  /**
   * 檢查是否為無效會話信息錯誤
   */
  isInvalidSessionInfo(): boolean {
    return this.isErrorCode('auth/invalid-verification-id');
  }

  /**
   * 檢查是否為無效租戶 ID 錯誤
   */
  isInvalidTenantId(): boolean {
    return this.isErrorCode('auth/invalid-tenant-id');
  }

  /**
   * 檢查是否為多因素認證信息未找到錯誤
   */
  isMfaInfoNotFound(): boolean {
    return this.isErrorCode('auth/multi-factor-info-not-found');
  }

  /**
   * 檢查是否為需要多因素認證錯誤
   */
  isMfaRequired(): boolean {
    return this.isErrorCode('auth/multi-factor-auth-required');
  }

  /**
   * 檢查是否為缺少 Android 包名錯誤
   */
  isMissingAndroidPackageName(): boolean {
    return this.isErrorCode('auth/missing-android-pkg-name');
  }

  /**
   * 檢查是否為缺少應用憑證錯誤
   */
  isMissingAppCredential(): boolean {
    return this.isErrorCode('auth/missing-app-credential');
  }

  /**
   * 檢查是否為缺少認證域名配置錯誤
   */
  isMissingAuthDomain(): boolean {
    return this.isErrorCode('auth/auth-domain-config-required');
  }

  /**
   * 檢查是否為缺少驗證碼錯誤
   */
  isMissingCode(): boolean {
    return this.isErrorCode('auth/missing-verification-code');
  }

  /**
   * 檢查是否為缺少繼續 URI 錯誤
   */
  isMissingContinueUri(): boolean {
    return this.isErrorCode('auth/missing-continue-uri');
  }

  /**
   * 檢查是否為缺少 iframe 開始錯誤
   */
  isMissingIframeStart(): boolean {
    return this.isErrorCode('auth/missing-iframe-start');
  }

  /**
   * 檢查是否為缺少 iOS Bundle ID 錯誤
   */
  isMissingIosBundleId(): boolean {
    return this.isErrorCode('auth/missing-ios-bundle-id');
  }

  /**
   * 檢查是否為缺少或無效 nonce 錯誤
   */
  isMissingOrInvalidNonce(): boolean {
    return this.isErrorCode('auth/missing-or-invalid-nonce');
  }

  /**
   * 檢查是否為缺少多因素認證信息錯誤
   */
  isMissingMfaInfo(): boolean {
    return this.isErrorCode('auth/missing-multi-factor-info');
  }

  /**
   * 檢查是否為缺少多因素認證會話錯誤
   */
  isMissingMfaSession(): boolean {
    return this.isErrorCode('auth/missing-multi-factor-session');
  }

  /**
   * 檢查是否為缺少電話號碼錯誤
   */
  isMissingPhoneNumber(): boolean {
    return this.isErrorCode('auth/missing-phone-number');
  }

  /**
   * 檢查是否為缺少會話信息錯誤
   */
  isMissingSessionInfo(): boolean {
    return this.isErrorCode('auth/missing-verification-id');
  }

  /**
   * 檢查是否為應用已刪除錯誤
   */
  isModuleDestroyed(): boolean {
    return this.isErrorCode('auth/app-deleted');
  }

  /**
   * 檢查是否為無認證事件錯誤
   */
  isNoAuthEvent(): boolean {
    return this.isErrorCode('auth/no-auth-event');
  }

  /**
   * 檢查是否為無此提供商錯誤
   */
  isNoSuchProvider(): boolean {
    return this.isErrorCode('auth/no-such-provider');
  }

  /**
   * 檢查是否為在此環境中不支持此操作錯誤
   */
  isOperationNotSupported(): boolean {
    return this.isErrorCode('auth/operation-not-supported-in-this-environment');
  }

  /**
   * 檢查是否為彈出視窗被阻擋錯誤
   */
  isPopupBlocked(): boolean {
    return this.isErrorCode('auth/popup-blocked');
  }

  /**
   * 檢查是否為用戶關閉彈出視窗錯誤
   */
  isPopupClosedByUser(): boolean {
    return this.isErrorCode('auth/popup-closed-by-user');
  }

  /**
   * 檢查是否為提供商已連結錯誤
   */
  isProviderAlreadyLinked(): boolean {
    return this.isErrorCode('auth/provider-already-linked');
  }

  /**
   * 檢查是否為配額已超出錯誤
   */
  isQuotaExceeded(): boolean {
    return this.isErrorCode('auth/quota-exceeded');
  }

  /**
   * 檢查是否為憑證被拒絕錯誤
   */
  isRejectedCredential(): boolean {
    return this.isErrorCode('auth/rejected-credential');
  }

  /**
   * 檢查是否為第二因素已在使用中錯誤
   */
  isSecondFactorAlreadyEnrolled(): boolean {
    return this.isErrorCode('auth/second-factor-already-in-use');
  }

  /**
   * 檢查是否為超出最大第二因素數量錯誤
   */
  isSecondFactorLimitExceeded(): boolean {
    return this.isErrorCode('auth/maximum-second-factor-count-exceeded');
  }

  /**
   * 檢查是否為租戶 ID 不匹配錯誤
   */
  isTenantIdMismatch(): boolean {
    return this.isErrorCode('auth/tenant-id-mismatch');
  }

  /**
   * 檢查是否為超時錯誤
   */
  isTimeout(): boolean {
    return this.isErrorCode('auth/timeout');
  }

  /**
   * 檢查是否為令牌已過期錯誤
   */
  isTokenExpired(): boolean {
    return this.isErrorCode('auth/user-token-expired');
  }

  /**
   * 檢查是否為請求過於頻繁錯誤
   */
  isTooManyAttemptsTryLater(): boolean {
    return this.isErrorCode('auth/too-many-requests');
  }

  /**
   * 檢查是否為未授權繼續 URI 錯誤
   */
  isUnauthorizedDomain(): boolean {
    return this.isErrorCode('auth/unauthorized-continue-uri');
  }

  /**
   * 檢查是否為不支持的第一因素錯誤
   */
  isUnsupportedFirstFactor(): boolean {
    return this.isErrorCode('auth/unsupported-first-factor');
  }

  /**
   * 檢查是否為不支持的持久化類型錯誤
   */
  isUnsupportedPersistence(): boolean {
    return this.isErrorCode('auth/unsupported-persistence-type');
  }

  /**
   * 檢查是否為不支持的租戶操作錯誤
   */
  isUnsupportedTenantOperation(): boolean {
    return this.isErrorCode('auth/unsupported-tenant-operation');
  }

  /**
   * 檢查是否為未驗證郵箱錯誤
   */
  isUnverifiedEmail(): boolean {
    return this.isErrorCode('auth/unverified-email');
  }

  /**
   * 檢查是否為不支持的 Web 存儲錯誤
   */
  isWebStorageUnsupported(): boolean {
    return this.isErrorCode('auth/web-storage-unsupported');
  }

  /**
   * 檢查是否為已經初始化錯誤
   */
  isAlreadyInitialized(): boolean {
    return this.isErrorCode('auth/already-initialized');
  }

  /**
   * 檢查是否為 reCAPTCHA 未啟用錯誤
   */
  isRecaptchaNotEnabled(): boolean {
    return this.isErrorCode('auth/recaptcha-not-enabled');
  }

  /**
   * 檢查是否為缺少 reCAPTCHA 令牌錯誤
   */
  isMissingRecaptchaToken(): boolean {
    return this.isErrorCode('auth/missing-recaptcha-token');
  }

  /**
   * 檢查是否為無效 reCAPTCHA 令牌錯誤
   */
  isInvalidRecaptchaToken(): boolean {
    return this.isErrorCode('auth/invalid-recaptcha-token');
  }

  /**
   * 檢查是否為無效 reCAPTCHA 操作錯誤
   */
  isInvalidRecaptchaAction(): boolean {
    return this.isErrorCode('auth/invalid-recaptcha-action');
  }

  /**
   * 檢查是否為缺少客戶端類型錯誤
   */
  isMissingClientType(): boolean {
    return this.isErrorCode('auth/missing-client-type');
  }

  /**
   * 檢查是否為缺少 reCAPTCHA 版本錯誤
   */
  isMissingRecaptchaVersion(): boolean {
    return this.isErrorCode('auth/missing-recaptcha-version');
  }

  /**
   * 檢查是否為無效 reCAPTCHA 版本錯誤
   */
  isInvalidRecaptchaVersion(): boolean {
    return this.isErrorCode('auth/invalid-recaptcha-version');
  }

  /**
   * 檢查是否為無效請求類型錯誤
   */
  isInvalidReqType(): boolean {
    return this.isErrorCode('auth/invalid-req-type');
  }

  /**
   * 檢查是否為無效託管連結域名錯誤
   */
  isInvalidHostingLinkDomain(): boolean {
    return this.isErrorCode('auth/invalid-hosting-link-domain');
  }

  /**
   * 計算本地化錯誤訊息
   */
  private computeLocalizedMessage(code: string): string {
    return FIREBASE_AUTH_ERROR_MESSAGES[code] || '發生未知錯誤';
  }
} 