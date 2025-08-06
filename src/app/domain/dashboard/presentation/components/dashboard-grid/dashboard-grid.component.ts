import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridsterModule, GridsterConfig, GridsterItem } from 'angular-gridster2';

@Component({
  selector: 'app-dashboard-grid',
  template: `
    <gridster [options]="options">
      <gridster-item [item]="item" *ngFor="let item of dashboard">
        <!-- Add widget content here -->
      </gridster-item>
    </gridster>
  `,
  standalone: true,
  imports: [CommonModule, GridsterModule]
})
export class DashboardGridComponent {
  options: GridsterConfig;
  dashboard: Array<GridsterItem>;

  constructor() {
    this.options = {
      gridType: 'fit',
      draggable: {
        enabled: true
      },
      resizable: {
        enabled: true
      }
    };

    this.dashboard = [
      {cols: 2, rows: 1, y: 0, x: 0},
      {cols: 2, rows: 2, y: 0, x: 2}
    ];
  }
}
