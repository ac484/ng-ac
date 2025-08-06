import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzGridModule],
  template: `
    <div nz-row [nzGutter]="16">
      <div nz-col [nzSpan]="6">
        <nz-card [nzTitle]="'Total Users'">
          <p>1,234</p>
        </nz-card>
      </div>
      <div nz-col [nzSpan]="6">
        <nz-card [nzTitle]="'Active Users'">
          <p>1,100</p>
        </nz-card>
      </div>
      <div nz-col [nzSpan]="6">
        <nz-card [nzTitle]="'New Users'">
          <p>45</p>
        </nz-card>
      </div>
      <div nz-col [nzSpan]="6">
        <nz-card [nzTitle]="'Growth Rate'">
          <p>12.5%</p>
        </nz-card>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding: 24px;
    }
  `]
})
export class DashboardComponent {} 