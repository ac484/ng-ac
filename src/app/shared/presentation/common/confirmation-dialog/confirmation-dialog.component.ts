import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, NzModalModule, NzButtonModule],
  template: `
    <nz-modal
      [(nzVisible)]="visible"
      [nzTitle]="title"
      [nzContent]="content"
      [nzOkText]="okText"
      [nzCancelText]="cancelText"
      [nzOkType]="okType"
      [nzOkDanger]="okDanger"
      (nzOnOk)="onConfirm.emit()"
      (nzOnCancel)="onCancel.emit()">
    </nz-modal>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ConfirmationDialogComponent {
  @Input() visible = false;
  @Input() title = 'Confirm Action';
  @Input() content = 'Are you sure you want to proceed?';
  @Input() okText = 'OK';
  @Input() cancelText = 'Cancel';
  @Input() okType: 'primary' | 'ghost' | 'dashed' | 'link' | 'text' | 'default' = 'primary';
  @Input() okDanger = false;
  
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
} 