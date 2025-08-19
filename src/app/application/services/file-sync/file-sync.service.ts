import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface FileChangeEvent {
  type: 'add' | 'change' | 'unlink' | 'unlinkDir' | 'addDir';
  path: string;
  timestamp: Date;
}

export interface FileTreeSyncStatus {
  isWatching: boolean;
  lastSync: Date | null;
  totalFiles: number;
  lastChange: FileChangeEvent | null;
}

@Injectable({
  providedIn: 'root'
})
export class FileSyncService implements OnDestroy {
  private readonly destroy$ = new Subject<void>();

  // 文件變化事件流
  private readonly _fileChanges$ = new Subject<FileChangeEvent>();
  public readonly fileChanges$ = this._fileChanges$.asObservable();

  // 同步狀態
  private readonly _syncStatus$ = new BehaviorSubject<FileTreeSyncStatus>({
    isWatching: false,
    lastSync: null,
    totalFiles: 0,
    lastChange: null
  });
  public readonly syncStatus$ = this._syncStatus$.asObservable();

  // 監控配置
  private readonly WATCH_PATTERNS = [
    'src/**/*',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts',
    '!src/**/node_modules/**',
    '!src/**/dist/**',
    '!src/**/.git/**'
  ];

  private readonly IGNORE_PATTERNS = [
    '**/node_modules/**',
    '**/dist/**',
    '**/.git/**',
    '**/*.log',
    '**/*.tmp',
    '**/*.cache'
  ];

  constructor() {
    this.initializeFileWatching();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * 初始化文件監控
   */
  private async initializeFileWatching(): Promise<void> {
    try {
      // 在瀏覽器環境中，我們使用輪詢方式
      // 在 Node.js 環境中，我們使用 chokidar
      if (typeof window === 'undefined') {
        await this.startNodeFileWatching();
      } else {
        this.startBrowserFilePolling();
      }
    } catch (error) {
      console.warn('File watching initialization failed:', error);
    }
  }

  /**
   * Node.js 環境下的文件監控（使用 chokidar）
   */
  private async startNodeFileWatching(): Promise<void> {
    try {
      // 動態導入 chokidar（避免瀏覽器打包問題）
      const chokidar = await import('chokidar');

      const watcher = chokidar.watch(this.WATCH_PATTERNS, {
        ignored: this.IGNORE_PATTERNS,
        persistent: true,
        ignoreInitial: false,
        awaitWriteFinish: {
          stabilityThreshold: 100,
          pollInterval: 100
        }
      });

      // 監聽文件變化事件
      watcher
        .on('add', (path) => this.handleFileChange('add', path))
        .on('change', (path) => this.handleFileChange('change', path))
        .on('unlink', (path) => this.handleFileChange('unlink', path))
        .on('unlinkDir', (path) => this.handleFileChange('unlinkDir', path))
        .on('addDir', (path) => this.handleFileChange('addDir', path))
        .on('ready', () => {
          console.log('File watching initialized');
          this.updateSyncStatus({
            isWatching: true,
            lastSync: new Date(),
            totalFiles: watcher.getWatched().size || 0,
            lastChange: null
          });
        })
        .on('error', (error) => {
          console.error('File watching error:', error);
        });

      // 保存 watcher 實例以便清理
      (this as any)._watcher = watcher;

    } catch (error) {
      console.error('Failed to initialize chokidar:', error);
    }
  }

  /**
   * 瀏覽器環境下的文件輪詢監控
   */
  private startBrowserFilePolling(): void {
    // 在瀏覽器環境中，我們使用輪詢來檢查文件變化
    // 這主要用於開發時的預覽
    const pollInterval = 5000; // 5秒輪詢一次

    const pollTimer = setInterval(() => {
      this.checkForFileChanges();
    }, pollInterval);

    // 保存 timer 以便清理
    (this as any)._pollTimer = pollTimer;

    this.updateSyncStatus({
      isWatching: true,
      lastSync: new Date(),
      totalFiles: 0,
      lastChange: null
    });
  }

  /**
   * 處理文件變化事件
   */
  private handleFileChange(type: FileChangeEvent['type'], path: string): void {
    const event: FileChangeEvent = {
      type,
      path,
      timestamp: new Date()
    };

    console.log(`File ${type}:`, path);

    // 發送文件變化事件
    this._fileChanges$.next(event);

    // 更新同步狀態
    this.updateSyncStatus({
      ...this._syncStatus$.value,
      lastChange: event
    });

    // 觸發文件樹更新
    this.triggerFileTreeUpdate();
  }

  /**
   * 檢查文件變化（瀏覽器環境）
   */
  private async checkForFileChanges(): Promise<void> {
    try {
      // 在瀏覽器環境中，我們可以通過 API 調用來檢查文件變化
      // 這裡我們模擬一個檢查過程
      const response = await fetch('/api/file-changes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patterns: this.WATCH_PATTERNS,
          lastCheck: this._syncStatus$.value.lastSync?.toISOString()
        })
      });

      if (response.ok) {
        const changes = await response.json();
        changes.forEach((change: any) => {
          this.handleFileChange(change.type, change.path);
        });
      }
    } catch (error) {
      // 在開發環境中，這個 API 可能不存在，我們忽略錯誤
      console.debug('File change check failed (expected in development):', error);
    }
  }

  /**
   * 觸發文件樹更新
   */
  private async triggerFileTreeUpdate(): Promise<void> {
    try {
      // 調用文件樹生成腳本
      if (typeof window === 'undefined') {
        // Node.js 環境
        const { exec } = await import('child_process');
        const { promisify } = await import('util');

        const execAsync = promisify(exec);
        await execAsync('pnpm run generate:fs');

        console.log('File tree updated successfully');
      } else {
        // 瀏覽器環境，發送更新請求
        await fetch('/api/update-file-tree', { method: 'POST' });
      }
    } catch (error) {
      console.error('Failed to update file tree:', error);
    }
  }

  /**
   * 手動觸發文件樹更新
   */
  public async manualUpdateFileTree(): Promise<void> {
    await this.triggerFileTreeUpdate();

    this.updateSyncStatus({
      ...this._syncStatus$.value,
      lastSync: new Date()
    });
  }

  /**
   * 獲取當前監控的文件列表
   */
  public getWatchedFiles(): string[] {
    const watcher = (this as any)._watcher;
    if (watcher) {
      const watched = watcher.getWatched();
      return Object.keys(watched).flatMap(dir =>
        watched[dir].map((file: string) => `${dir}/${file}`)
      );
    }
    return [];
  }

  /**
   * 更新同步狀態
   */
  private updateSyncStatus(status: Partial<FileTreeSyncStatus>): void {
    this._syncStatus$.next({
      ...this._syncStatus$.value,
      ...status
    });
  }

  /**
   * 停止文件監控
   */
  public stopWatching(): void {
    const watcher = (this as any)._watcher;
    if (watcher) {
      watcher.close();
    }

    const pollTimer = (this as any)._pollTimer;
    if (pollTimer) {
      clearInterval(pollTimer);
    }

    this.updateSyncStatus({
      isWatching: false,
      lastSync: this._syncStatus$.value.lastSync,
      totalFiles: 0,
      lastChange: null
    });
  }

  /**
   * 重新開始文件監控
   */
  public restartWatching(): void {
    this.stopWatching();
    this.initializeFileWatching();
  }
}
