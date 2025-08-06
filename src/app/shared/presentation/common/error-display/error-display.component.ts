import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'app-error-display',
  template: `
    <nz-alert
      *ngIf="error"
      nzType="error"
      [nzMessage]="errorMessage"
      nzShowIcon
    ></nz-alert>
  `,
  standalone: true,
  imports: [CommonModule, NzAlertModule]
})
export class ErrorDisplayComponent {
  @Input() error: any;
  @Input() errorMessage = 'An error occurred.';
}
