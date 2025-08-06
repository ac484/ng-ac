import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
    selector: 'app-monitor',
    template: `
        <div class="monitor-page">
            <nz-card>
                <h2>系統監控</h2>
                <div class="monitor-grid">
                    <div class="monitor-item">
                        <h3>CPU 使用率</h3>
                        <nz-progress 
                            [nzPercent]="cpuUsage" 
                            [nzStatus]="cpuUsage > 80 ? 'exception' : 'normal'">
                        </nz-progress>
                        <p>{{ cpuUsage }}%</p>
                    </div>
                    
                    <div class="monitor-item">
                        <h3>記憶體使用率</h3>
                        <nz-progress 
                            [nzPercent]="memoryUsage" 
                            [nzStatus]="memoryUsage > 80 ? 'exception' : 'normal'">
                        </nz-progress>
                        <p>{{ memoryUsage }}%</p>
                    </div>
                    
                    <div class="monitor-item">
                        <h3>磁碟使用率</h3>
                        <nz-progress 
                            [nzPercent]="diskUsage" 
                            [nzStatus]="diskUsage > 80 ? 'exception' : 'normal'">
                        </nz-progress>
                        <p>{{ diskUsage }}%</p>
                    </div>
                    
                    <div class="monitor-item">
                        <h3>網路流量</h3>
                        <nz-progress 
                            [nzPercent]="networkUsage" 
                            [nzStatus]="networkUsage > 80 ? 'exception' : 'normal'">
                        </nz-progress>
                        <p>{{ networkUsage }}%</p>
                    </div>
                </div>
            </nz-card>
            
            <nz-card style="margin-top: 16px;">
                <h2>系統狀態</h2>
                <div class="status-grid">
                    <div class="status-item">
                        <span>資料庫連接</span>
                        <nz-tag [nzColor]="'green'">正常</nz-tag>
                    </div>
                    <div class="status-item">
                        <span>快取服務</span>
                        <nz-tag [nzColor]="'green'">正常</nz-tag>
                    </div>
                    <div class="status-item">
                        <span>檔案服務</span>
                        <nz-tag [nzColor]="'orange'">警告</nz-tag>
                    </div>
                    <div class="status-item">
                        <span>郵件服務</span>
                        <nz-tag [nzColor]="'red'">異常</nz-tag>
                    </div>
                </div>
                <p style="margin-top: 16px;">當前時間：{{ currentTime | date:'yyyy-MM-dd HH:mm:ss' }}</p>
            </nz-card>
        </div>
    `,
    styles: [`
        .monitor-page {
            padding: 24px;
        }
        .monitor-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 16px;
            margin-bottom: 16px;
        }
        .monitor-item {
            padding: 16px;
            border: 1px solid #f0f0f0;
            border-radius: 6px;
        }
        .monitor-item h3 {
            margin-bottom: 8px;
            color: #1890ff;
        }
        .status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 12px;
        }
        .status-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px;
            border: 1px solid #f0f0f0;
            border-radius: 4px;
        }
    `],
    standalone: true,
    imports: [CommonModule, NzCardModule, NzProgressModule, NzTagModule]
})
export class MonitorComponent {
    currentTime = new Date();
    cpuUsage = 65;
    memoryUsage = 78;
    diskUsage = 45;
    networkUsage = 32;
} 