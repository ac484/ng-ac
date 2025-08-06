import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzListModule } from 'ng-zorro-antd/list';

@Component({
    selector: 'app-workplace',
    template: `
        <div class="workplace-page">
            <nz-card>
                <h2>工作臺</h2>
                <div class="workplace-header">
                    <div class="user-info">
                        <nz-avatar [nzSize]="64" nzIcon="user"></nz-avatar>
                        <div class="user-details">
                            <h3>歡迎回來，管理員</h3>
                            <p>今天是個好日子，讓我們開始工作吧！</p>
                        </div>
                    </div>
                    <div class="quick-actions">
                        <button class="btn btn-primary">開始工作</button>
                        <button class="btn btn-default">查看報告</button>
                    </div>
                </div>
            </nz-card>
            
            <div class="workplace-grid">
                <nz-card>
                    <h3>待辦事項</h3>
                    <nz-list [nzDataSource]="todoItems" [nzRenderItem]="todoItem">
                        <ng-template #todoItem let-item>
                            <nz-list-item>
                                <nz-list-item-meta>
                                    <nz-list-item-meta-title>
                                        {{ item.title }}
                                        <nz-tag [nzColor]="item.priority === 'high' ? 'red' : item.priority === 'medium' ? 'orange' : 'green'">
                                            {{ item.priority }}
                                        </nz-tag>
                                    </nz-list-item-meta-title>
                                    <nz-list-item-meta-description>
                                        {{ item.description }}
                                    </nz-list-item-meta-description>
                                </nz-list-item-meta>
                            </nz-list-item>
                        </ng-template>
                    </nz-list>
                </nz-card>
                
                <nz-card>
                    <h3>最近活動</h3>
                    <nz-list [nzDataSource]="recentActivities" [nzRenderItem]="activityItem">
                        <ng-template #activityItem let-item>
                            <nz-list-item>
                                <nz-list-item-meta>
                                    <nz-list-item-meta-title>{{ item.title }}</nz-list-item-meta-title>
                                    <nz-list-item-meta-description>
                                        {{ item.time | date:'MM-dd HH:mm' }}
                                    </nz-list-item-meta-description>
                                </nz-list-item-meta>
                            </nz-list-item>
                        </ng-template>
                    </nz-list>
                </nz-card>
            </div>
            
            <nz-card style="margin-top: 16px;">
                <h3>系統資訊</h3>
                <p>當前時間：{{ currentTime | date:'yyyy-MM-dd HH:mm:ss' }}</p>
                <p>這是一個測試 tab 功能的工作臺頁面。您可以通過點擊不同的 tab 來測試路由復用功能。</p>
            </nz-card>
        </div>
    `,
    styles: [`
        .workplace-page {
            padding: 24px;
        }
        .workplace-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
        }
        .user-info {
            display: flex;
            align-items: center;
            gap: 16px;
        }
        .user-details h3 {
            margin: 0 0 8px 0;
            color: #1890ff;
        }
        .user-details p {
            margin: 0;
            color: #666;
        }
        .quick-actions {
            display: flex;
            gap: 8px;
        }
        .btn {
            padding: 8px 16px;
            border: 1px solid #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s;
        }
        .btn-primary {
            background-color: #1890ff;
            color: white;
            border-color: #1890ff;
        }
        .btn-primary:hover {
            background-color: #40a9ff;
            border-color: #40a9ff;
        }
        .btn-default {
            background-color: white;
            color: #666;
        }
        .btn-default:hover {
            background-color: #f5f5f5;
            border-color: #40a9ff;
            color: #40a9ff;
        }
        .workplace-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 16px;
            margin: 16px 0;
        }
    `],
    standalone: true,
    imports: [CommonModule, NzCardModule, NzAvatarModule, NzTagModule, NzListModule]
})
export class WorkplaceComponent {
    currentTime = new Date();

    todoItems = [
        { title: '審核用戶申請', description: '處理新用戶註冊申請', priority: 'high' },
        { title: '更新系統文檔', description: '更新用戶手冊和API文檔', priority: 'medium' },
        { title: '備份資料庫', description: '執行每日資料庫備份', priority: 'low' }
    ];

    recentActivities = [
        { title: '用戶登入', time: new Date(Date.now() - 1000 * 60 * 5) },
        { title: '系統更新完成', time: new Date(Date.now() - 1000 * 60 * 30) },
        { title: '新用戶註冊', time: new Date(Date.now() - 1000 * 60 * 60) }
    ];
} 