/**
 * 離線狀態介面定義
 *
 * @author NG-AC Team
 * @since 2024-12-19
 * @version 1.0.0
 */

export interface IOfflineStatus {
  isOnline: boolean;
  lastOnlineTime?: Date;
  offlineDuration?: number;
}

export interface IOfflineService {
  getStatus(): IOfflineStatus;
  onOnline(callback: () => void): void;
  onOffline(callback: () => void): void;
}
