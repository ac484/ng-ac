import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

import { TableColumn, TableAction, PaginationConfig, ScrollConfig } from './table-column.interface';

/**
 * 可重用的資料表格組件
 * 整合 ng-zorro-antd 的表格功能，支援排序、篩選、分頁等功能
 */
@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzButtonModule, NzIconModule, NzTagModule, NzPopconfirmModule, NzTooltipModule, NzSpaceModule],
  template: `
    <nz-table
      #table
      [nzData]="data"
      [nzLoading]="loading"
      [nzTotal]="pagination.total"
      [nzPageSize]="pagination.pageSize"
      [nzPageIndex]="pagination.pageIndex"
      [nzShowSizeChanger]="pagination.showSizeChanger"
      [nzShowQuickJumper]="pagination.showQuickJumper"
      [nzPageSizeOptions]="pagination.pageSizeOptions || [10, 20, 50, 100]"
      [nzSize]="size"
      [nzBordered]="bordered"
      [nzScroll]="getScrollConfig()"
      (nzPageIndexChange)="onPageChange($event)"
      (nzPageSizeChange)="onPageSizeChange($event)"
    >
      <thead>
        <tr>
          <th
            *ngFor="let column of visibleColumns"
            [nzWidth]="column.width || null"
            [nzAlign]="column.align || 'left'"
            [nzSortFn]="column.sortable ? column.sortFn || getDefaultSortFn(column.key) : null"
            [nzFilterFn]="column.filterable ? column.filterFn || getDefaultFilterFn(column.key) : null"
            [nzFilters]="column.filters || []"
          >
            {{ column.title }}
          </th>
          <th *ngIf="showActions" nzWidth="120px" nzAlign="center">操作</th>
        </tr>
      </thead>

      <tbody>
        <tr *ngFor="let item of table.data; trackBy: trackByFn">
          <td *ngFor="let column of visibleColumns" [nzAlign]="column.align || 'left'">
            <ng-container [ngSwitch]="column.type">
              <!-- 文字類型 -->
              <span *ngSwitchCase="'text'">
                {{ column.formatter ? column.formatter(getItemValue(item, column.key), item) : getItemValue(item, column.key) }}
              </span>

              <!-- 狀態類型 -->
              <nz-tag *ngSwitchCase="'status'" [nzColor]="getStatusColor(getItemValue(item, column.key), column)">
                {{ getStatusText(getItemValue(item, column.key), column) }}
              </nz-tag>

              <!-- 貨幣類型 -->
              <span *ngSwitchCase="'currency'">
                {{ formatCurrency(getItemValue(item, column.key)) }}
              </span>

              <!-- 日期類型 -->
              <span *ngSwitchCase="'date'">
                {{ formatDate(getItemValue(item, column.key)) }}
              </span>

              <!-- 數字類型 -->
              <span *ngSwitchCase="'number'">
                {{ formatNumber(getItemValue(item, column.key)) }}
              </span>

              <!-- 布林類型 -->
              <nz-tag *ngSwitchCase="'boolean'" [nzColor]="getItemValue(item, column.key) ? 'green' : 'red'">
                {{ getItemValue(item, column.key) ? '是' : '否' }}
              </nz-tag>

              <!-- 預設類型 -->
              <span *ngSwitchDefault>
                {{ column.formatter ? column.formatter(getItemValue(item, column.key), item) : getItemValue(item, column.key) }}
              </span>
            </ng-container>
          </td>

          <!-- 操作欄位 -->
          <td *ngIf="showActions" nzAlign="center">
            <nz-space nzSize="small">
              <ng-container *ngFor="let action of getVisibleActions(item)">
                <!-- 檢視按鈕 -->
                <button
                  *ngIf="action.type === 'view'"
                  nz-button
                  nzType="link"
                  nzSize="small"
                  nz-tooltip
                  [nzTooltipTitle]="action.title"
                  [disabled]="isActionDisabled(action, item)"
                  (click)="onActionClick(action, item)"
                >
                  <span nz-icon [nzType]="action.icon"></span>
                </button>

                <!-- 編輯按鈕 -->
                <button
                  *ngIf="action.type === 'edit'"
                  nz-button
                  nzType="link"
                  nzSize="small"
                  nz-tooltip
                  [nzTooltipTitle]="action.title"
                  [disabled]="isActionDisabled(action, item)"
                  (click)="onActionClick(action, item)"
                >
                  <span nz-icon [nzType]="action.icon"></span>
                </button>

                <!-- 刪除按鈕 -->
                <button
                  *ngIf="action.type === 'delete'"
                  nz-button
                  nzType="link"
                  nzSize="small"
                  nzDanger
                  nz-tooltip
                  [nzTooltipTitle]="action.title"
                  [disabled]="isActionDisabled(action, item)"
                  nz-popconfirm
                  nzPopconfirmTitle="確定要刪除這筆資料嗎？"
                  nzPopconfirmPlacement="topRight"
                  (nzOnConfirm)="onActionClick(action, item)"
                >
                  <span nz-icon [nzType]="action.icon"></span>
                </button>

                <!-- 自定義按鈕 -->
                <button
                  *ngIf="action.type === 'custom'"
                  nz-button
                  nzType="link"
                  nzSize="small"
                  [nzDanger]="action.danger"
                  nz-tooltip
                  [nzTooltipTitle]="action.title"
                  [disabled]="isActionDisabled(action, item)"
                  (click)="onActionClick(action, item)"
                >
                  <span nz-icon [nzType]="action.icon"></span>
                </button>
              </ng-container>
            </nz-space>
          </td>
        </tr>
      </tbody>
    </nz-table>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .ant-table-tbody > tr > td {
        padding: 8px 16px;
      }

      .ant-btn-group .ant-btn {
        margin-right: 4px;
      }

      .ant-btn-group .ant-btn:last-child {
        margin-right: 0;
      }
    `
  ]
})
export class DataTableComponent<T = any> implements OnInit, OnChanges {
  /** 表格資料 */
  @Input() data: T[] = [];

  /** 欄位配置 */
  @Input() columns: TableColumn[] = [];

  /** 操作按鈕配置 */
  @Input() actions: TableAction[] = [
    { type: 'view', title: '檢視', icon: 'eye' },
    { type: 'edit', title: '編輯', icon: 'edit' },
    { type: 'delete', title: '刪除', icon: 'delete', danger: true }
  ];

  /** 載入狀態 */
  @Input() loading = false;

  /** 分頁配置 */
  @Input() pagination: PaginationConfig = {
    pageIndex: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: [10, 20, 50, 100]
  };

  /** 表格大小 */
  @Input() size: 'default' | 'middle' | 'small' = 'default';

  /** 是否顯示邊框 */
  @Input() bordered = false;

  /** 滾動配置 */
  @Input() scroll?: ScrollConfig;

  /** 是否顯示操作欄位 */
  @Input() showActions = true;

  /** 追蹤函數的鍵值 */
  @Input() trackByKey = 'id';

  /** 分頁變更事件 */
  @Output() pageChange = new EventEmitter<number>();

  /** 每頁數量變更事件 */
  @Output() pageSizeChange = new EventEmitter<number>();

  /** 檢視事件 */
  @Output() view = new EventEmitter<T>();

  /** 編輯事件 */
  @Output() edit = new EventEmitter<T>();

  /** 刪除事件 */
  @Output() delete = new EventEmitter<T>();

  /** 自定義操作事件 */
  @Output() customAction = new EventEmitter<{ action: TableAction; item: T }>();

  /** 可見的欄位 */
  visibleColumns: TableColumn[] = [];

  ngOnInit(): void {
    this.updateVisibleColumns();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns']) {
      this.updateVisibleColumns();
    }
  }

  /**
   * 更新可見欄位
   */
  private updateVisibleColumns(): void {
    this.visibleColumns = this.columns.filter(column => !column.hidden);
  }

  /**
   * 分頁變更處理
   */
  onPageChange(page: number): void {
    this.pagination.pageIndex = page;
    this.pageChange.emit(page);
  }

  /**
   * 每頁數量變更處理
   */
  onPageSizeChange(size: number): void {
    this.pagination.pageSize = size;
    this.pagination.pageIndex = 1; // 重置到第一頁
    this.pageSizeChange.emit(size);
  }

  /**
   * 操作按鈕點擊處理
   */
  onActionClick(action: TableAction, item: T): void {
    if (action.handler) {
      action.handler(item);
      return;
    }

    switch (action.type) {
      case 'view':
        this.view.emit(item);
        break;
      case 'edit':
        this.edit.emit(item);
        break;
      case 'delete':
        this.delete.emit(item);
        break;
      case 'custom':
        this.customAction.emit({ action, item });
        break;
    }
  }

  /**
   * 取得可見的操作按鈕
   */
  getVisibleActions(item: T): TableAction[] {
    return this.actions.filter(action => !action.visible || action.visible(item));
  }

  /**
   * 檢查操作是否禁用
   */
  isActionDisabled(action: TableAction, item: T): boolean {
    return action.disabled ? action.disabled(item) : false;
  }

  /**
   * 安全地取得項目屬性值
   */
  getItemValue(item: T, key: string): any {
    return (item as any)[key];
  }

  /**
   * 取得狀態顏色
   */
  getStatusColor(value: any, column: TableColumn): string {
    if (column.statusColors && column.statusColors[value]) {
      return column.statusColors[value];
    }

    // 預設狀態顏色映射
    const defaultColors: Record<string, string> = {
      active: 'green',
      inactive: 'red',
      pending: 'orange',
      completed: 'blue',
      failed: 'red',
      success: 'green',
      error: 'red',
      warning: 'orange',
      info: 'blue'
    };

    return defaultColors[value] || 'default';
  }

  /**
   * 取得狀態文字
   */
  getStatusText(value: any, column: TableColumn): string {
    if (column.statusTexts && column.statusTexts[value]) {
      return column.statusTexts[value];
    }

    // 預設狀態文字映射
    const defaultTexts: Record<string, string> = {
      active: '啟用',
      inactive: '停用',
      pending: '待處理',
      completed: '已完成',
      failed: '失敗',
      success: '成功',
      error: '錯誤',
      warning: '警告',
      info: '資訊'
    };

    return defaultTexts[value] || value;
  }

  /**
   * 格式化貨幣
   */
  formatCurrency(value: any): string {
    if (value == null || value === '') return '-';

    const numValue = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(numValue)) return '-';

    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD'
    }).format(numValue);
  }

  /**
   * 格式化日期
   */
  formatDate(value: any): string {
    if (!value) return '-';

    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '-';

    return new Intl.DateTimeFormat('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  /**
   * 格式化數字
   */
  formatNumber(value: any): string {
    if (value == null || value === '') return '-';

    const numValue = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(numValue)) return '-';

    return new Intl.NumberFormat('zh-TW').format(numValue);
  }

  /**
   * 預設排序函數
   */
  getDefaultSortFn(key: string) {
    return (a: any, b: any) => {
      const aVal = a[key];
      const bVal = b[key];

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal, 'zh-TW');
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return aVal - bVal;
      }

      return String(aVal).localeCompare(String(bVal), 'zh-TW');
    };
  }

  /**
   * 預設篩選函數
   */
  getDefaultFilterFn(key: string) {
    return (value: any, item: any) => {
      const itemValue = item[key];
      if (itemValue == null) return false;
      return String(itemValue).includes(String(value));
    };
  }

  /**
   * 取得滾動配置
   */
  getScrollConfig(): { x?: string | null; y?: string | null } {
    if (!this.scroll) return {};

    return {
      x: this.scroll.x || null,
      y: this.scroll.y || null
    };
  }

  /**
   * 追蹤函數
   */
  trackByFn = (index: number, item: any): any => {
    return item[this.trackByKey] || index;
  };
}
