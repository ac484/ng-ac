import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <h2>{{ title }}</h2>
    <p>{{ message }}</p>
    <div *nzModalFooter>
      <button nz-button nzType="default" (click)="onCancel()">Cancel</button>
      <button nz-button nzType="primary" (click)="onConfirm()">OK</button>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, NzModalModule, NzButtonModule]
})
export class ConfirmationDialogComponent {
  @Input() title = 'Confirm';
  @Input() message = 'Are you sure?';

  constructor(private modal: NzModalRef) {}

  onConfirm(): void {
    this.modal.close(true);
  }

  onCancel(): void {
    this.modal.destroy();
  }
}
