import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, NzSpinModule],
  template: `
    <div class="loading-container" [class.fullscreen]="fullscreen">
      <nz-spin 
        [nzSpinning]="true" 
        [nzSize]="size"
        [nzTip]="tip">
      </nz-spin>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 24px;
    }
    
    .loading-container.fullscreen {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      z-index: 1000;
    }
  `]
})
export class LoadingComponent {
  @Input() fullscreen = false;
  @Input() size: 'small' | 'default' | 'large' = 'default';
  @Input() tip = 'Loading...';
} 