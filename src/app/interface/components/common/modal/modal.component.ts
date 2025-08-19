/**
 * @fileoverview 模態框組件 (Modal Component)
 * @description 使用Angular Material實現的超極簡模態框組件
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Interface Layer Common Component
 * - 職責：超極簡模態框組件，只保留最基本功能
 * - 依賴：Angular Core, Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案使用Angular Material組件實現模態框
 * - 採用超極簡主義設計，只保留最基本功能
 * - 不添加過度複雜的邏輯
 */

import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [MatButtonModule],
  template: `
    <div *ngIf="isOpen" class="modal-overlay">
      <div class="modal-content">
        <h2>{{title}}</h2>
        <ng-content></ng-content>
        <div class="modal-actions">
          <button mat-button (click)="close()">取消</button>
          <button mat-raised-button color="primary" (click)="confirm()">確認</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; }
    .modal-content { background: white; padding: 20px; border-radius: 8px; min-width: 300px; }
    .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
  `]
})
export class ModalComponent {
  @Input() title: string = '模態框';
  @Input() isOpen: boolean = false;

  close(): void { this.isOpen = false; }
  confirm(): void { this.isOpen = false; }
}
