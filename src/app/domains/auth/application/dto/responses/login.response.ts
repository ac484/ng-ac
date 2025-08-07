/**
 * 登入回應
 */
export interface LoginResponse {
  msg: string;
  user?: {
    token: string;
    name: string;
    email: string;
    id: string;
    uid?: string;
    isAdmin: boolean;
    time: number;
    expired: number;
  };
}
