import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-error-display',
  standalone: true,
  imports: [CommonModule, NzResultModule, NzButtonModule],
  template: `
    <nz-result
      nzStatus="error"
      [nzTitle]="title"
      [nzSubTitle]="subtitle">
      <div nz-result-extra>
        <button nz-button nzType="primary" (click)="onRetry.emit()">
          Try Again
        </button>
        <button nz-button (click)="onGoBack.emit()">
          Go Back
        </button>
      </div>
    </nz-result>
  `,
  styles: [`
    :host {
      display: block;
      padding: 24px;
    }
  `]
})
export class ErrorDisplayComponent {
  @Input() title = 'Something went wrong';
  @Input() subtitle = 'Please try again later';
  @Input() onRetry = () => {};
  @Input() onGoBack = () => {};
} 