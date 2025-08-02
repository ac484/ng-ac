import { Component, OnInit } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';

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
        NzTableModule,
        NzTagModule,
        NzButtonModule,
        NzIconModule,
        NzDividerModule
    ],
    standalone: true
})
export class ContractsComponent implements OnInit {
    dataSet: ContractItem[] = [
        {
            key: '1',
            name: '服務合約 A',
            tags: ['重要', '長期'],
            status: 'active',
            createDate: '2024-01-15'
        },
        {
            key: '2',
            name: '維護合約 B',
            tags: ['維護', '年度'],
            status: 'active',
            createDate: '2024-02-20'
        },
        {
            key: '3',
            name: '開發合約 C',
            tags: ['開發', '專案'],
            status: 'pending',
            createDate: '2024-03-10'
        },
        {
            key: '4',
            name: '諮詢合約 D',
            tags: ['諮詢', '短期'],
            status: 'expired',
            createDate: '2023-12-05'
        },
        {
            key: '5',
            name: '培訓合約 E',
            tags: ['培訓', '內部'],
            status: 'active',
            createDate: '2024-01-30'
        }
    ];

    constructor() { }

    ngOnInit(): void {
    }

    getStatusColor(status: string): string {
        switch (status) {
            case 'active':
                return 'green';
            case 'pending':
                return 'orange';
            case 'expired':
                return 'red';
            default:
                return 'default';
        }
    }

    getStatusText(status: string): string {
        switch (status) {
            case 'active':
                return '生效中';
            case 'pending':
                return '待審核';
            case 'expired':
                return '已過期';
            default:
                return '未知';
        }
    }
}