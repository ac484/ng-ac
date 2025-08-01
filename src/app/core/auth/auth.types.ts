/**
 * 認證相關的型別定義
 * 保持精簡，僅定義必要的介面
 */

/**
 * 登入憑證
 */
export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

/**
 * 認證結果
 */
export interface AuthResult {
  success: boolean;
  user?: any;
  token?: string;
  error?: string;
}

/**
 * 認證狀態
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}