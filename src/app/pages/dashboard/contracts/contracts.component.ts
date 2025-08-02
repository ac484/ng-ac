import { Component, OnInit } from '@angular/core';
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
    imports: [NzTableModule, NzTagModule, NzButtonModule, NzIconModule, NzDividerModule, FloatActionButtonsComponent],
    standalone: true
})
export class ContractsComponent implements OnInit {
    dataSet: ContractItem[] = [
        { key: '1', name: '服務合約 A', tags: ['重要', '長期'], status: 'active', createDate: '2024-01-15' },
        { key: '2', name: '維護合約 B', tags: ['維護', '年度'], status: 'active', createDate: '2024-02-20' },
        { key: '3', name: '開發合約 C', tags: ['開發', '專案'], status: 'pending', createDate: '2024-03-10' },
        { key: '4', name: '諮詢合約 D', tags: ['諮詢', '短期'], status: 'expired', createDate: '2023-12-05' },
        { key: '5', name: '培訓合約 E', tags: ['培訓', '內部'], status: 'active', createDate: '2024-01-30' }
    ];

    floatButtons: FloatActionButton[] = [
        { key: 'add', tooltip: '添加新合約', icon: 'plus', type: 'primary' },
        { key: 'export', tooltip: '導出數據', icon: 'download' },
        { key: 'refresh', tooltip: '刷新數據', icon: 'reload' }
    ];

    constructor() { }

    ngOnInit(): void { }

    getStatusColor(status: string): string {
        const colors: Record<string, string> = { active: 'green', pending: 'orange', expired: 'red' };
        return colors[status] || 'default';
    }

    getStatusText(status: string): string {
        const texts: Record<string, string> = { active: '生效中', pending: '待審核', expired: '已過期' };
        return texts[status] || '未知';
    }

    onFloatButtonClick(key: string): void {
        const actions: Record<string, () => void> = {
            add: () => console.log('添加新合約'),
            export: () => console.log('導出數據'),
            refresh: () => console.log('刷新數據')
        };
        actions[key]?.();
    }
}