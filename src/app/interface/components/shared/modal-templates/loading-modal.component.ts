/**
 * 載入中對話框範本組件
 * 提供標準化的載入狀態顯示
 */

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { interval, Subscription } from 'rxjs';

export interface LoadingModalData {
  title?: string;
  message?: string;
  type?: 'spin' | 'progress' | 'dots';
  showProgress?: boolean;
  progress?: number;
  progressStatus?: 'normal' | 'exception' | 'active' | 'success';
  size?: 'small' | 'default' | 'large';
  animated?: boolean;
  estimatedTime?: number; // 預估時間（秒）
}

@Component({
  selector: 'app-loading-modal',
  standalone: true,
  imports: [CommonModule, NzSpinModule, NzProgressModule, NzIconModule],
  template: `
    <div class="loading-modal" [class]="'loading-' + (data.type || 'spin')">
      <!-- 標題 -->
      <div class="loading-title" *ngIf="data.title">
        <h3>{{ data.title }}</h3>
      </div>

      <!-- 旋轉載入 -->
      <div class="loading-content" *ngIf="data.type === 'spin' || !data.type">
        <nz-spin [nzSize]="data.size || 'large'" [nzSpinning]="true">
          <div class="loading-placeholder"></div>
        </nz-spin>
      </div>

      <!-- 進度條載入 -->
      <div class="loading-content" *ngIf="data.type === 'progress'">
        <nz-progress [nzPercent]="currentProgress" [nzStatus]="data.progressStatus || 'active'" [nzType]="'circle'" [nzWidth]="80">
        </nz-progress>
      </div>

      <!-- 點點載入 -->
      <div class="loading-content dots-loading" *ngIf="data.type === 'dots'">
        <div class="dots-container">
          <div class="dot" [class.active]="activeDot === 0"></div>
          <div class="dot" [class.active]="activeDot === 1"></div>
          <div class="dot" [class.active]="activeDot === 2"></div>
        </div>
      </div>

      <!-- 訊息 -->
      <div class="loading-message" *ngIf="data.message">
        <p>{{ data.message }}</p>
      </div>

      <!-- 預估時間 -->
      <div class="loading-estimate" *ngIf="data.estimatedTime && remainingTime > 0">
        <p class="estimate-text">
          <span nz-icon nzType="clock-circle"></span>
          預估剩餘時間: {{ formatTime(remainingTime) }}
        </p>
      </div>

      <!-- 進度詳情 -->
      <div class="loading-details" *ngIf="data.showProgress && data.type === 'progress'">
        <div class="progress-info">
          <span class="progress-percent">{{ currentProgress }}%</span>
          <span class="progress-status">{{ getProgressStatusText() }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .loading-modal {
        padding: 32px;
        text-align: center;
        min-width: 300px;
        min-height: 200px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .loading-title h3 {
        margin: 0 0 24px 0;
        font-size: 18px;
        font-weight: 500;
        color: #262626;
      }

      .loading-content {
        margin-bottom: 24px;
      }

      .loading-placeholder {
        width: 80px;
        height: 80px;
      }

      .loading-message p {
        margin: 0;
        color: #8c8c8c;
        font-size: 14px;
        line-height: 1.5;
      }

      .loading-estimate {
        margin-top: 16px;
      }

      .estimate-text {
        margin: 0;
        color: #595959;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }

      .loading-details {
        margin-top: 16px;
        width: 100%;
      }

      .progress-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        color: #8c8c8c;
      }

      .progress-percent {
        font-weight: 500;
        color: #1890ff;
      }

      /* 點點載入動畫 */
      .dots-loading {
        padding: 20px 0;
      }

      .dots-container {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
      }

      .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #d9d9d9;
        transition: all 0.3s ease;
      }

      .dot.active {
        background-color: #1890ff;
        transform: scale(1.2);
      }

      /* 不同類型的樣式調整 */
      .loading-spin .loading-content {
        padding: 20px 0;
      }

      .loading-progress .loading-content {
        padding: 16px 0;
      }

      .loading-dots .loading-content {
        padding: 24px 0;
      }

      /* 響應式設計 */
      @media (max-width: 480px) {
        .loading-modal {
          padding: 24px 16px;
          min-width: 280px;
        }

        .loading-title h3 {
          font-size: 16px;
        }

        .loading-placeholder {
          width: 60px;
          height: 60px;
        }
      }
    `
  ]
})
export class LoadingModalComponent implements OnInit, OnDestroy {
  @Input() data: LoadingModalData = {};

  currentProgress = 0;
  activeDot = 0;
  remainingTime = 0;

  private progressSubscription?: Subscription;
  private dotsSubscription?: Subscription;
  private timeSubscription?: Subscription;

  ngOnInit(): void {
    this.initializeProgress();
    this.initializeDotsAnimation();
    this.initializeTimeEstimate();
  }

  ngOnDestroy(): void {
    this.progressSubscription?.unsubscribe();
    this.dotsSubscription?.unsubscribe();
    this.timeSubscription?.unsubscribe();
  }

  private initializeProgress(): void {
    if (this.data.type === 'progress') {
      this.currentProgress = this.data.progress || 0;

      // 如果沒有提供進度值，模擬進度增長
      if (this.data.progress === undefined) {
        this.progressSubscription = interval(100).subscribe(() => {
          if (this.currentProgress < 95) {
            // 模擬不規則的進度增長
            const increment = Math.random() * 2;
            this.currentProgress = Math.min(95, this.currentProgress + increment);
          }
        });
      }
    }
  }

  private initializeDotsAnimation(): void {
    if (this.data.type === 'dots') {
      this.dotsSubscription = interval(500).subscribe(() => {
        this.activeDot = (this.activeDot + 1) % 3;
      });
    }
  }

  private initializeTimeEstimate(): void {
    if (this.data.estimatedTime) {
      this.remainingTime = this.data.estimatedTime;

      this.timeSubscription = interval(1000).subscribe(() => {
        if (this.remainingTime > 0) {
          this.remainingTime--;
        }
      });
    }
  }

  getProgressStatusText(): string {
    switch (this.data.progressStatus) {
      case 'exception':
        return '處理失敗';
      case 'success':
        return '處理完成';
      case 'active':
        return '處理中...';
      default:
        return '處理中...';
    }
  }

  formatTime(seconds: number): string {
    if (seconds < 60) {
      return `${seconds} 秒`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes} 分 ${remainingSeconds} 秒`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours} 小時 ${minutes} 分`;
    }
  }

  /**
   * 更新進度（供外部調用）
   */
  updateProgress(progress: number, message?: string): void {
    this.currentProgress = Math.min(100, Math.max(0, progress));
    if (message) {
      this.data.message = message;
    }
  }

  /**
   * 設定進度狀態
   */
  setProgressStatus(status: 'normal' | 'exception' | 'active' | 'success'): void {
    this.data.progressStatus = status;
  }

  /**
   * 取得組件資料（供 ModalService 使用）
   */
  getData(): LoadingModalData {
    return {
      ...this.data,
      progress: this.currentProgress
    };
  }
}
