import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ContractStats } from '@shared/types';

@Component({
  selector: 'app-contracts-dashboard-stats',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="stats-grid">
      <mat-card class="stat-card total">
        <mat-card-content>
          <div class="stat-content">
            <div class="stat-icon"><mat-icon>description</mat-icon></div>
            <div class="stat-info"><h3>{{ stats().total }}</h3><p>總合約數</p></div>
          </div>
        </mat-card-content>
      </mat-card>
      <mat-card class="stat-card active">
        <mat-card-content>
          <div class="stat-content">
            <div class="stat-icon"><mat-icon>play_circle</mat-icon></div>
            <div class="stat-info"><h3>{{ stats().active }}</h3><p>進行中</p></div>
          </div>
        </mat-card-content>
      </mat-card>
      <mat-card class="stat-card completed">
        <mat-card-content>
          <div class="stat-content">
            <div class="stat-icon"><mat-icon>check_circle</mat-icon></div>
            <div class="stat-info"><h3>{{ stats().completed }}</h3><p>已完成</p></div>
          </div>
        </mat-card-content>
      </mat-card>
      <mat-card class="stat-card value">
        <mat-card-content>
          <div class="stat-content">
            <div class="stat-icon"><mat-icon>attach_money</mat-icon></div>
            <div class="stat-info"><h3>{{ formatCurrency(stats().totalValue) }}</h3><p>總合約金額</p></div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px;margin-bottom:24px}
    .stat-card{transition:transform .2s ease-in-out,box-shadow .2s ease-in-out;cursor:pointer}
    .stat-card:hover{transform:translateY(-2px);box-shadow:0 4px 8px rgba(0,0,0,.12)}
    .stat-content{display:flex;align-items:center;gap:16px}
    .stat-icon{display:flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:50%;color:#fff}
    .total .stat-icon{background-color:#2196f3}
    .active .stat-icon{background-color:#ff9800}
    .completed .stat-icon{background-color:#4caf50}
    .value .stat-icon{background-color:#9c27b0}
    .stat-info{flex:1}
    .stat-info h3{margin:0;font-size:1.75rem;font-weight:500;line-height:1.2}
    .stat-info p{margin:4px 0 0 0;font-size:.875rem;color:var(--mat-sys-on-surface-variant);line-height:1.2}
    @media (max-width:768px){.stats-grid{grid-template-columns:repeat(2,1fr);gap:12px}.stat-content{gap:12px}.stat-icon{width:40px;height:40px}.stat-info h3{font-size:1.5rem}.stat-info p{font-size:.75rem}}
    @media (max-width:480px){.stats-grid{grid-template-columns:1fr}}
  `]
})
export class ContractsDashboardStatsComponent {
  readonly stats = input.required<ContractStats>();
  protected formatCurrency(value: number): string {
    return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
  }
}


