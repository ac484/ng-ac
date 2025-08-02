import { ClipboardModule } from '@angular/cdk/clipboard';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-copy-text',
  template: `
    <button 
      nz-button 
      nzType="text" 
      nzSize="small"
      nz-tooltip
      [nzTooltipTitle]="tooltipTitle"
      [cdkCopyToClipboard]="text"
      (cdkCopyToClipboardCopied)="onCopied($event)"
    >
      <i nz-icon [nzType]="iconType"></i>
      <ng-content></ng-content>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NzButtonModule, NzIconModule, NzToolTipModule, ClipboardModule]
})
export class CopyTextComponent {
  @Input() text: string = '';
  @Input() iconType: string = 'copy';
  @Input() tooltipTitle: string = '複製';
  @Input() successMessage: string = '複製成功';
  @Output() copied = new EventEmitter<boolean>();

  constructor(private message: NzMessageService) {}

  onCopied(success: boolean): void {
    if (success) {
      this.message.success(this.successMessage);
    } else {
      this.message.error('複製失敗');
    }
    this.copied.emit(success);
  }
}