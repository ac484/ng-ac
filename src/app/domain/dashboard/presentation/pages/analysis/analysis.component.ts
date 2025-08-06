import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';

@Component({
    selector: 'app-analysis',
    template: `
        <div class="analysis-page">
            <div class="stats-grid">
                <nz-card class="stat-card">
                    <nz-statistic
                        nzTitle="總銷售額"
                        [nzValue]="112893"
                        nzPrefix="¥"
                        [nzValueStyle]="{ color: '#3f8600' }">
                    </nz-statistic>
                </nz-card>
                
                <nz-card class="stat-card">
                    <nz-statistic
                        nzTitle="訪問量"
                        [nzValue]="8846"
                        [nzValueStyle]="{ color: '#cf1322' }">
                    </nz-statistic>
                </nz-card>
                
                <nz-card class="stat-card">
                    <nz-statistic
                        nzTitle="支付筆數"
                        [nzValue]="11280"
                        [nzValueStyle]="{ color: '#1890ff' }">
                    </nz-statistic>
                </nz-card>
                
                <nz-card class="stat-card">
                    <nz-statistic
                        nzTitle="運營活動效果"
                        [nzValue]="93"
                        nzSuffix="%"
                        [nzValueStyle]="{ color: '#722ed1' }">
                    </nz-statistic>
                </nz-card>
            </div>
            
            <nz-card style="margin-top: 16px;">
                <h2>分析頁面內容</h2>
                <p>這是一個測試 tab 功能的分析頁面。您可以通過點擊不同的 tab 來測試路由復用功能。</p>
                <p>當前時間：{{ currentTime | date:'yyyy-MM-dd HH:mm:ss' }}</p>
            </nz-card>
        </div>
    `,
    styles: [`
        .analysis-page {
            padding: 24px;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 16px;
            margin-bottom: 16px;
        }
        .stat-card {
            min-height: 120px;
        }
    `],
    standalone: true,
    imports: [CommonModule, NzCardModule, NzStatisticModule]
})
export class AnalysisComponent {
    currentTime = new Date();
} 