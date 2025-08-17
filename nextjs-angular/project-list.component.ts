/**
 * @ai-context {
 *   "role": "Interface/Component",
 *   "purpose": "Angular專案列表組件-展示專案管理功能",
 *   "constraints": ["使用轉換後的服務", "響應式設計", "錯誤處理", "載入狀態"],
 *   "dependencies": ["ProjectStateService", "Project", "Task", "TaskStatus"],
 *   "security": "medium",
 *   "lastmod": "2024-12-19"
 * }
 * @usage 在專案管理頁面中使用此組件
 * @see docs/architecture/interface.md
 */

import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil, Observable, combineLatest } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { ProjectStateService } from './project-state.service';
import { Project, Task, TaskStatus } from './types';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="project-list-container">
      <!-- 標題和搜索 -->
      <div class="header-section">
        <h2>專案管理</h2>
        <div class="search-section">
          <input
            type="text"
            placeholder="搜索專案..."
            [formControl]="searchControl"
            class="search-input"
          >
          <button (click)="loadProjects()" class="refresh-btn">
            刷新
          </button>
        </div>
      </div>

      <!-- 統計信息 -->
      <div class="stats-section" *ngIf="projectStats$ | async as stats">
        <div class="stat-card">
          <span class="stat-number">{{ stats.total }}</span>
          <span class="stat-label">總專案</span>
        </div>
        <div class="stat-card active">
          <span class="stat-number">{{ stats.active }}</span>
          <span class="stat-label">活躍</span>
        </div>
        <div class="stat-card completed">
          <span class="stat-number">{{ stats.completed }}</span>
          <span class="stat-label">已完成</span>
        </div>
        <div class="stat-card on-hold">
          <span class="stat-number">{{ stats.onHold }}</span>
          <span class="stat-label">暫停</span>
        </div>
      </div>

      <!-- 載入狀態 -->
      <div class="loading-section" *ngIf="loading$ | async">
        <div class="spinner"></div>
        <span>載入中...</span>
      </div>

      <!-- 錯誤狀態 -->
      <div class="error-section" *ngIf="error$ | async as error">
        <div class="error-message">
          <span>錯誤: {{ error }}</span>
          <button (click)="loadProjects()" class="retry-btn">重試</button>
        </div>
      </div>

      <!-- 專案列表 -->
      <div class="projects-section" *ngIf="!(loading$ | async) && !(error$ | async)">
        <div class="project-card" *ngFor="let project of projects$ | async; trackBy: trackByProjectId">
          <div class="project-header">
            <h3 class="project-title">{{ project.title }}</h3>
            <span class="project-status" [class]="'status-' + project.status">
              {{ getStatusText(project.status) }}
            </span>
          </div>

          <p class="project-description">{{ project.description }}</p>

          <div class="project-meta">
            <div class="meta-item">
              <span class="meta-label">開始日期:</span>
              <span class="meta-value">{{ project.startDate | date:'yyyy-MM-dd' }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">結束日期:</span>
              <span class="meta-value">{{ project.endDate | date:'yyyy-MM-dd' }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">專案價值:</span>
              <span class="meta-value">${{ project.value | number:'1.0-0' }}</span>
            </div>
          </div>

          <!-- 任務進度 -->
          <div class="task-progress" *ngIf="project.tasks && project.tasks.length > 0">
            <div class="progress-header">
              <span>任務進度</span>
              <span class="progress-text">
                {{ getCompletedTaskCount(project.tasks) }}/{{ project.tasks.length }}
              </span>
            </div>
            <div class="progress-bar">
              <div
                class="progress-fill"
                [style.width.%]="getTaskProgressPercentage(project.tasks)"
              ></div>
            </div>
          </div>

          <!-- 操作按鈕 -->
          <div class="project-actions">
            <button
              (click)="viewProject(project)"
              class="action-btn view-btn"
            >
              查看詳情
            </button>
            <button
              (click)="editProject(project)"
              class="action-btn edit-btn"
            >
              編輯
            </button>
            <button
              (click)="deleteProject(project.id)"
              class="action-btn delete-btn"
            >
              刪除
            </button>
          </div>
        </div>
      </div>

      <!-- 空狀態 -->
      <div class="empty-state" *ngIf="(projects$ | async)?.length === 0 && !(loading$ | async) && !(error$ | async)">
        <div class="empty-icon">📋</div>
        <h3>暫無專案</h3>
        <p>開始創建您的第一個專案吧！</p>
        <button (click)="createNewProject()" class="create-btn">
          創建專案
        </button>
      </div>
    </div>
  `,
  styles: [`
    .project-list-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .header-section h2 {
      margin: 0;
      color: #333;
      font-size: 24px;
    }

    .search-section {
      display: flex;
      gap: 12px;
    }

    .search-input {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      width: 250px;
      font-size: 14px;
    }

    .refresh-btn {
      padding: 8px 16px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    }

    .refresh-btn:hover {
      background: #0056b3;
    }

    .stats-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
      border-left: 4px solid #ddd;
    }

    .stat-card.active {
      border-left-color: #28a745;
    }

    .stat-card.completed {
      border-left-color: #17a2b8;
    }

    .stat-card.on-hold {
      border-left-color: #ffc107;
    }

    .stat-number {
      display: block;
      font-size: 28px;
      font-weight: bold;
      color: #333;
      margin-bottom: 4px;
    }

    .stat-label {
      color: #666;
      font-size: 14px;
    }

    .loading-section {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .spinner {
      border: 3px solid #f3f3f3;
      border-top: 3px solid #007bff;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-section {
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 6px;
      padding: 16px;
      margin-bottom: 24px;
      color: #721c24;
    }

    .error-message {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .retry-btn {
      padding: 6px 12px;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .projects-section {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 20px;
    }

    .project-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 20px;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .project-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .project-title {
      margin: 0;
      color: #333;
      font-size: 18px;
      flex: 1;
      margin-right: 12px;
    }

    .project-status {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }

    .status-active {
      background: #d4edda;
      color: #155724;
    }

    .status-completed {
      background: #d1ecf1;
      color: #0c5460;
    }

    .status-onHold {
      background: #fff3cd;
      color: #856404;
    }

    .project-description {
      color: #666;
      margin-bottom: 16px;
      line-height: 1.5;
    }

    .project-meta {
      margin-bottom: 16px;
    }

    .meta-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 14px;
    }

    .meta-label {
      color: #666;
      font-weight: 500;
    }

    .meta-value {
      color: #333;
    }

    .task-progress {
      margin-bottom: 16px;
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 14px;
      color: #666;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e9ecef;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: #007bff;
      transition: width 0.3s ease;
    }

    .project-actions {
      display: flex;
      gap: 8px;
    }

    .action-btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s;
    }

    .view-btn {
      background: #007bff;
      color: white;
    }

    .view-btn:hover {
      background: #0056b3;
    }

    .edit-btn {
      background: #28a745;
      color: white;
    }

    .edit-btn:hover {
      background: #1e7e34;
    }

    .delete-btn {
      background: #dc3545;
      color: white;
    }

    .delete-btn:hover {
      background: #c82333;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      margin: 0 0 8px 0;
      color: #333;
    }

    .empty-state p {
      margin: 0 0 24px 0;
    }

    .create-btn {
      padding: 12px 24px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
    }

    .create-btn:hover {
      background: #0056b3;
    }

    @media (max-width: 768px) {
      .header-section {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .search-section {
        justify-content: center;
      }

      .projects-section {
        grid-template-columns: 1fr;
      }

      .project-card {
        margin: 0 10px;
      }
    }
  `]
})
export class ProjectListComponent implements OnInit, OnDestroy {
  // 數據流
  readonly projects$ = this.projectStateService.projects$;
  readonly loading$ = this.projectStateService.loading$;
  readonly error$ = this.projectStateService.error$;
  readonly projectStats$ = this.projectStateService.projectStats$;

  // 搜索控制
  searchControl = new FormControl('');

  // 銷毀訂閱
  private destroy$ = new Subject<void>();

  constructor(private projectStateService: ProjectStateService) {}

  ngOnInit(): void {
    // 載入專案
    this.projectStateService.loadProjects();

    // 設置搜索
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // 設置搜索功能
  private setupSearch(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      if (searchTerm) {
        // 實現搜索邏輯
        console.log('Searching for:', searchTerm);
      } else {
        this.projectStateService.loadProjects();
      }
    });
  }

  // 載入專案
  loadProjects(): void {
    this.projectStateService.loadProjects();
  }

  // 查看專案詳情
  viewProject(project: Project): void {
    console.log('Viewing project:', project);
    // 導航到專案詳情頁面
  }

  // 編輯專案
  editProject(project: Project): void {
    console.log('Editing project:', project);
    // 導航到編輯頁面或打開編輯模態框
  }

  // 刪除專案
  deleteProject(projectId: string): void {
    if (confirm('確定要刪除這個專案嗎？')) {
      console.log('Deleting project:', projectId);
      // 實現刪除邏輯
    }
  }

  // 創建新專案
  createNewProject(): void {
    console.log('Creating new project');
    // 導航到創建頁面或打開創建模態框
  }

  // 獲取狀態文本
  getStatusText(status?: string): string {
    switch (status) {
      case 'active': return '活躍';
      case 'completed': return '已完成';
      case 'onHold': return '暫停';
      default: return '未知';
    }
  }

  // 獲取已完成任務數量
  getCompletedTaskCount(tasks: Task[]): number {
    return tasks.filter(task => task.status === 'Completed').length;
  }

  // 獲取任務進度百分比
  getTaskProgressPercentage(tasks: Task[]): number {
    if (tasks.length === 0) return 0;
    const completed = this.getCompletedTaskCount(tasks);
    return Math.round((completed / tasks.length) * 100);
  }

  // 追蹤函數
  trackByProjectId(index: number, project: Project): string {
    return project.id;
  }
}
