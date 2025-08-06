import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-loading',
  template: `
    <div class="loading-overlay" *ngIf="isLoading">
      <nz-spin nzSimple [nzSize]="'large'"></nz-spin>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }
  `],
  standalone: true,
  imports: [CommonModule, NzSpinModule]
})
export class LoadingComponent {
  isLoading = false; // This would be controlled by a service
}
