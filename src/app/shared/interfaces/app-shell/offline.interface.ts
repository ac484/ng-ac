/**
 * @fileoverview 離線狀態介面定義 (Offline Status Interface)
 * @description 定義離線狀態和網路狀態的介面
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-12-19
 *
 * 檔案性質：
 * - 類型：Shared Layer Interface
 * - 職責：離線狀態介面定義
 * - 依賴：無
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 定義離線狀態的完整介面
 * - 支援時間戳記和持續時間
 * - 提供狀態更新方法
 * - 極簡主義設計
 */

export interface IOfflineStatus {
  isOnline: boolean;
  lastOnlineTime?: Date;
  offlineDuration?: number;
  lastUpdateTime?: Date;
}

export interface IOfflineService {
  getStatus(): IOfflineStatus;
  onOnline(callback: () => void): void;
  onOffline(callback: () => void): void;
  setOnlineStatus(isOnline: boolean): void;
}
