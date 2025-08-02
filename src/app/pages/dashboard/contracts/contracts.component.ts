import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { FloatActionButtonsComponent, FloatActionButton } from './components/float-action-buttons/float-action-buttons.component';

interface ContractItem {
    key: string;
    name: string;
    tags: string[];
    status: 'active' | 'pending' | 'expired';
    createDate: string;
}

@Component({
    selector: 'app-contracts',
    templateUrl: './contracts.component.html',
    styleUrls: ['./contracts.component.less'],
    imports: [
        CommonModule,
        NzTableModule,
        NzTagModule,
        NzButtonModule,
        NzIconModule,
        NzDividerModule,
        FloatActionButtonsComponent
    ],
    standalone: true
})
export class ContractsComponent {
    // 最小化數據
    dataSet: ContractItem[] = [
        { key: '1', name: '服務合約 A', tags: ['重要', '長期'], status: 'active', createDate: '2024-01-15' },
        { key: '2', name: '維護合約 B', tags: ['維護', '年度'], status: 'active', createDate: '2024-02-20' },
        { key: '3', name: '開發合約 C', tags: ['開發', '專案'], status: 'pending', createDate: '2024-03-10' },
        { key: '4', name: '諮詢合約 D', tags: ['諮詢', '短期'], status: 'expired', createDate: '2023-12-05' },
        { key: '5', name: '培訓合約 E', tags: ['培訓', '內部'], status: 'active', createDate: '2024-01-30' }
    ];

    // 最小化按鈕配置
    floatButtons: FloatActionButton[] = [
        { id: 'add', type: 'add', icon: 'plus', tooltip: '添加新合約' },
        { id: 'export', type: 'export', icon: 'download', tooltip: '導出數據' },
        { id: 'refresh', type: 'refresh', icon: 'reload', tooltip: '刷新數據' }
    ];

    // 最小化狀態映射
    private readonly statusMap = {
        active: { color: 'green', text: '生效中' },
        pending: { color: 'orange', text: '待審核' },
        expired: { color: 'red', text: '已過期' }
    };

    // 最小化事件處理
    onFloatButtonClick(actionType: string): void {
        const actions = {
            add: () => console.log('添加新合約'),
            export: () => console.log('導出數據'),
            refresh: () => console.log('刷新數據')
        };
        actions[actionType as keyof typeof actions]?.();
    }

    // 最小化狀態處理
    getStatusColor(status: string): string {
        return this.statusMap[status as keyof typeof this.statusMap]?.color || 'default';
    }

    getStatusText(status: string): string {
        return this.statusMap[status as keyof typeof this.statusMap]?.text || '未知';
    }
}