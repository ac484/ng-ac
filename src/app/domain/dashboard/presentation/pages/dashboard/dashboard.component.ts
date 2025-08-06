import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';

@Component({
  selector: 'app-dashboard',
  template: `
    <div style="padding: 24px;">
      <h1>Dashboard</h1>
      <div style="display: flex; gap: 16px; flex-wrap: wrap;">
        <nz-card style="flex: 1; min-width: 200px;">
          <nz-statistic
            [nzValue]="112893"
            [nzTitle]="'Active Users'"
            [nzPrefix]="'👥'">
          </nz-statistic>
        </nz-card>
        <nz-card style="flex: 1; min-width: 200px;">
          <nz-statistic
            [nzValue]="8846"
            [nzTitle]="'Total Orders'"
            [nzPrefix]="'📦'">
          </nz-statistic>
        </nz-card>
        <nz-card style="flex: 1; min-width: 200px;">
          <nz-statistic
            [nzValue]="11280"
            [nzTitle]="'Revenue'"
            [nzPrefix]="'💰'">
          </nz-statistic>
        </nz-card>
        <nz-card style="flex: 1; min-width: 200px;">
          <nz-statistic
            [nzValue]="93"
            [nzTitle]="'Success Rate'"
            [nzSuffix]="'%'"
            [nzPrefix]="'📈'">
          </nz-statistic>
        </nz-card>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, NzCardModule, NzStatisticModule]
})
export class DashboardComponent { }
