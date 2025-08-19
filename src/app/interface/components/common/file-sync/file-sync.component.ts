import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';

import { FileChangeEvent, FileSyncService, FileTreeSyncStatus } from '@app/application/services/file-sync/file-sync.service';

@Component({
  selector: 'app-file-sync',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatChipsModule,
    MatDividerModule,
    MatListModule
  ],
  template: `
    <mat-card class="file-sync-card">
      <mat-card-header>
        <mat-card-title>
          <mat-icon>sync</mat-icon>
          文件同步狀態
        </mat-card-title>
        <mat-card-subtitle>
          監控 src 目錄變化並自動更新文件樹
        </mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <!-- 同步狀態 -->
        <div class="status-section">
          <div class="status-row">
            <span class="status-label">監控狀態:</span>
            <mat-chip [color]="syncStatus?.isWatching ? 'accent' : 'warn'" selected>
              <mat-icon>{{ syncStatus?.isWatching ? 'visibility' : 'visibility_off' }}</mat-icon>
              {{ syncStatus?.isWatching ? '正在監控' : '已停止' }}
            </mat-chip>
          </div>

          <div class="status-row" *ngIf="syncStatus?.lastSync">
            <span class="status-label">最後同步:</span>
            <span class="status-value">{{ syncStatus.lastSync | date:'yyyy-MM-dd HH:mm:ss' }}</span>
          </div>

          <div class="status-row">
            <span class="status-label">監控文件:</span>
            <span class="status-value">{{ syncStatus?.totalFiles || 0 }} 個</span>
          </div>
        </div>

        <mat-divider class="divider"></mat-divider>

        <!-- 控制按鈕 -->
        <div class="controls-section">
          <button
            mat-raised-button
            color="primary"
            (click)="manualUpdate()"
            [disabled]="isUpdating"
            matTooltip="手動更新文件樹">
            <mat-icon>refresh</mat-icon>
            {{ isUpdating ? '更新中...' : '手動更新' }}
          </button>

          <button
            mat-raised-button
            [color]="syncStatus?.isWatching ? 'warn' : 'accent'"
            (click)="toggleWatching()"
            matTooltip="{{ syncStatus?.isWatching ? '停止監控' : '開始監控' }}">
            <mat-icon>{{ syncStatus?.isWatching ? 'stop' : 'play_arrow' }}</mat-icon>
            {{ syncStatus?.isWatching ? '停止監控' : '開始監控' }}
          </button>

          <button
            mat-raised-button
            color="accent"
            (click)="restartWatching()"
            matTooltip="重新啟動監控">
            <mat-icon>restart_alt</mat-icon>
            重啟監控
          </button>
        </div>

        <!-- 最近變化 -->
        <div class="changes-section" *ngIf="recentChanges.length > 0">
          <h4>最近變化</h4>
          <mat-list>
            <mat-list-item *ngFor="let change of recentChanges; trackBy: trackByChange">
              <mat-icon matListItemIcon [class]="getChangeIconClass(change.type)">
                {{ getChangeIcon(change.type) }}
              </mat-icon>
              <div matListItemTitle>{{ change.path }}</div>
              <div matListItemLine>
                <span class="change-type">{{ getChangeTypeText(change.type) }}</span>
                <span class="change-time">{{ change.timestamp | date:'HH:mm:ss' }}</span>
              </div>
            </mat-list-item>
          </mat-list>
        </div>

        <!-- 進度條 -->
        <mat-progress-bar
          *ngIf="isUpdating"
          mode="indeterminate"
          color="primary">
        </mat-progress-bar>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .file-sync-card {
      max-width: 600px;
      margin: 16px;
    }

    .status-section {
      margin-bottom: 16px;
    }

    .status-row {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      gap: 8px;
    }

    .status-label {
      font-weight: 500;
      min-width: 80px;
    }

    .status-value {
      color: #666;
    }

    .divider {
      margin: 16px 0;
    }

    .controls-section {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }

    .changes-section {
      margin-top: 16px;
    }

    .changes-section h4 {
      margin-bottom: 8px;
      color: #333;
    }

    .change-type {
      font-size: 12px;
      color: #666;
      margin-right: 8px;
    }

    .change-time {
      font-size: 12px;
      color: #999;
    }

    .change-add { color: #4caf50; }
    .change-modify { color: #ff9800; }
    .change-delete { color: #f44336; }
    .change-directory { color: #2196f3; }

    mat-progress-bar {
      margin-top: 16px;
    }
  `]
})
export class FileSyncComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  syncStatus: FileTreeSyncStatus | null = null;
  recentChanges: FileChangeEvent[] = [];
  isUpdating = false;

  constructor(
    private fileSyncService: FileSyncService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // 訂閱同步狀態
    this.fileSyncService.syncStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        this.syncStatus = status;
      });

    // 訂閱文件變化事件
    this.fileSyncService.fileChanges$
      .pipe(takeUntil(this.destroy$))
      .subscribe(change => {
        this.addRecentChange(change);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * 手動更新文件樹
   */
  async manualUpdate(): Promise<void> {
    try {
      this.isUpdating = true;
      await this.fileSyncService.manualUpdateFileTree();

      this.snackBar.open('文件樹更新成功！', '關閉', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    } catch (error) {
      this.snackBar.open('文件樹更新失敗！', '關閉', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar']
      });
    } finally {
      this.isUpdating = false;
    }
  }

  /**
   * 切換監控狀態
   */
  toggleWatching(): void {
    if (this.syncStatus?.isWatching) {
      this.fileSyncService.stopWatching();
      this.snackBar.open('文件監控已停止', '關閉', { duration: 2000 });
    } else {
      this.fileSyncService.restartWatching();
      this.snackBar.open('文件監控已啟動', '關閉', { duration: 2000 });
    }
  }

  /**
   * 重新啟動監控
   */
  restartWatching(): void {
    this.fileSyncService.restartWatching();
    this.snackBar.open('文件監控已重啟', '關閉', { duration: 2000 });
  }

  /**
   * 添加最近的變化
   */
  private addRecentChange(change: FileChangeEvent): void {
    this.recentChanges.unshift(change);

    // 只保留最近的 10 個變化
    if (this.recentChanges.length > 10) {
      this.recentChanges = this.recentChanges.slice(0, 10);
    }
  }

  /**
   * 獲取變化類型圖標
   */
  getChangeIcon(type: FileChangeEvent['type']): string {
    switch (type) {
      case 'add': return 'add';
      case 'change': return 'edit';
      case 'unlink': return 'delete';
      case 'addDir': return 'create_new_folder';
      case 'unlinkDir': return 'folder_delete';
      default: return 'help';
    }
  }

  /**
   * 獲取變化類型圖標樣式類
   */
  getChangeIconClass(type: FileChangeEvent['type']): string {
    switch (type) {
      case 'add': return 'change-add';
      case 'change': return 'change-modify';
      case 'unlink': return 'change-delete';
      case 'addDir':
      case 'unlinkDir': return 'change-directory';
      default: return '';
    }
  }

  /**
   * 獲取變化類型文本
   */
  getChangeTypeText(type: FileChangeEvent['type']): string {
    switch (type) {
      case 'add': return '新增文件';
      case 'change': return '修改文件';
      case 'unlink': return '刪除文件';
      case 'addDir': return '新增目錄';
      case 'unlinkDir': return '刪除目錄';
      default: return '未知變化';
    }
  }

  /**
   * 追蹤變化項目的函數
   */
  trackByChange(index: number, change: FileChangeEvent): string {
    return `${change.type}-${change.path}-${change.timestamp.getTime()}`;
  }
}
