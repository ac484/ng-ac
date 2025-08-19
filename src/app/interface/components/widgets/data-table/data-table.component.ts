/**
 * @fileoverview 數據表格組件 (Data Table Component)
 * @description 使用Angular Material實現的超極簡數據表格組件
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Interface Layer Widget Component
 * - 職責：超極簡數據表格組件，只保留最基本功能
 * - 依賴：Angular Core, Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案使用Angular Material組件實現數據表格
 * - 採用超極簡主義設計，只保留最基本功能
 * - 不添加過度複雜的邏輯
 */

import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [MatTableModule, MatButtonModule],
  template: `
    <table mat-table [dataSource]="dataSource" style="width: 100%; margin: 16px;">
      <ng-container *ngFor="let column of columns" [matColumnDef]="column.key">
        <th mat-header-cell *matHeaderCellDef>{{column.label}}</th>
        <td mat-cell *matCellDef="let element">{{element[column.key]}}</td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>操作</th>
        <td mat-cell *matCellDef="let element">
          <button mat-button>編輯</button>
          <button mat-button>刪除</button>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  `,
  styles: [``]
})
export class DataTableComponent {
  @Input() dataSource: any[] = [];
  @Input() columns: Array<{key: string, label: string}> = [];

  get displayedColumns(): string[] { return [...this.columns.map(col => col.key), 'actions']; }
}
