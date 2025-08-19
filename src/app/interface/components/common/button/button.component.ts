/**
 * @ai-context {
 *   "role": "Interface/Component",
 *   "purpose": "極簡按鈕組件-基礎按鈕實現",
 *   "constraints": ["Standalone組件", "OnPush策略", "極簡實現"],
 *   "dependencies": ["MatButtonModule", "CommonModule"],
 *   "security": "low",
 *   "lastmod": "2025-01-18"
 * }
 * @usage <app-button (click)="onClick()">按鈕</app-button>
 * @see docs/architecture/interface.md
 */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      mat-raised-button
      [color]="color()"
      [disabled]="disabled()"
      [type]="type()"
      (click)="click.emit($event)">
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class ButtonComponent {
  // 輸入屬性
  readonly color = input<'primary' | 'accent' | 'warn'>('primary');
  readonly disabled = input(false);
  readonly type = input<'button' | 'submit' | 'reset'>('button');

  // 輸出事件
  readonly click = output<MouseEvent>();
}
