import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderModule } from '@delon/abc/page-header';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RouterModule } from '@angular/router';

// Import DDD components
import { AccountListComponent } from './account-list.component';
import { TransactionListComponent } from './transaction-list.component';
import { UserListComponent } from './user-list.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    PageHeaderModule,
    NzCardModule,
    NzGridModule,
    NzStatisticModule,
    NzButtonModule,
    NzIconModule,
    RouterModule,
    // DDD Components
    AccountListComponent,
    TransactionListComponent,
    UserListComponent
  ]
})
export class DashboardComponent {}
