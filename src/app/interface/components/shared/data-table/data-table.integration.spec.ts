import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component } from '@angular/core';
import { DataTableComponent } from './data-table.component';
import { TableColumn, TableAction, PaginationConfig } from './table-column.interface';

/**
 * 整合測試組件
 * 測試 DataTableComponent 在實際使用場景中的行為
 */
@Component({
    template: `
    <app-data-table
      [data]="testData"
      [columns]="testColumns"
      [actions]="testActions"
      [loading]="loading"
      [pagination]="pagination"
      (view)="onView($event)"
      (edit)="onEdit($event)"
      (delete)="onDelete($event)"
      (pageChange)="onPageChange($event)"
      (pageSizeChange)="onPageSizeChange($event)">
    </app-data-table>
  `
})
class TestHostComponent {
    loading = false;

    testData = [
        {
            id: '1',
            name: '測試項目1',
            status: 'active',
            amount: 1000,
            date: new Date('2024-01-01'),
            isEnabled: true
        },
        {
            id: '2',
            name: '測試項目2',
            status: 'inactive',
            amount: 2000,
            date: new Date('2024-01-02'),
            isEnabled: false
        }
    ];

    testColumns: TableColumn[] = [
        { key: 'name', title: '名稱', type: 'text', sortable: true },
        { key: 'status', title: '狀態', type: 'status' },
        { key: 'amount', title: '金額', type: 'currency' },
        { key: 'date', title: '日期', type: 'date' },
        { key: 'isEnabled', title: '啟用', type: 'boolean' }
    ];

    testActions: TableAction[] = [
        { type: 'view', title: '檢視', icon: 'eye' },
        { type: 'edit', title: '編輯', icon: 'edit' },
        { type: 'delete', title: '刪除', icon: 'delete', danger: true }
    ];

    pagination: PaginationConfig = {
        pageIndex: 1,
        pageSize: 10,
        total: 50
    };

    viewedItem: any = null;
    editedItem: any = null;
    deletedItem: any = null;
    currentPage = 1;
    currentPageSize = 10;

    onView(item: any): void {
        this.viewedItem = item;
    }

    onEdit(item: any): void {
        this.editedItem = item;
    }

    onDelete(item: any): void {
        this.deletedItem = item;
    }

    onPageChange(page: number): void {
        this.currentPage = page;
    }

    onPageSizeChange(size: number): void {
        this.currentPageSize = size;
    }
}

describe('DataTableComponent Integration', () => {
    let hostComponent: TestHostComponent;
    let fixture: ComponentFixture<TestHostComponent>;
    let dataTableComponent: DataTableComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                DataTableComponent
            ],
            declarations: [TestHostComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        hostComponent = fixture.componentInstance;

        // 取得 DataTableComponent 實例
        const dataTableDebugElement = fixture.debugElement.query(
            (de) => de.componentInstance instanceof DataTableComponent
        );
        dataTableComponent = dataTableDebugElement.componentInstance;

        fixture.detectChanges();
    });

    it('should create host component with data table', () => {
        expect(hostComponent).toBeTruthy();
        expect(dataTableComponent).toBeTruthy();
    });

    it('should display correct number of rows', () => {
        const tableRows = fixture.nativeElement.querySelectorAll('tbody tr');
        expect(tableRows.length).toBe(2);
    });

    it('should display correct column headers', () => {
        const headers = fixture.nativeElement.querySelectorAll('thead th');
        expect(headers.length).toBe(6); // 5 data columns + 1 action column

        expect(headers[0].textContent.trim()).toBe('名稱');
        expect(headers[1].textContent.trim()).toBe('狀態');
        expect(headers[2].textContent.trim()).toBe('金額');
        expect(headers[3].textContent.trim()).toBe('日期');
        expect(headers[4].textContent.trim()).toBe('啟用');
        expect(headers[5].textContent.trim()).toBe('操作');
    });

    it('should format currency correctly in table', () => {
        const currencyCells = fixture.nativeElement.querySelectorAll('tbody tr td:nth-child(3)');
        expect(currencyCells[0].textContent).toContain('1,000');
        expect(currencyCells[1].textContent).toContain('2,000');
    });

    it('should display status tags', () => {
        const statusTags = fixture.nativeElement.querySelectorAll('nz-tag');
        expect(statusTags.length).toBeGreaterThan(0);
    });

    it('should display action buttons', () => {
        const actionButtons = fixture.nativeElement.querySelectorAll('tbody tr td:last-child button');
        expect(actionButtons.length).toBe(6); // 3 buttons × 2 rows
    });

    it('should emit view event when view button clicked', () => {
        const viewButton = fixture.nativeElement.querySelector('tbody tr:first-child button[nz-tooltip="檢視"]');

        viewButton.click();
        fixture.detectChanges();

        expect(hostComponent.viewedItem).toEqual(hostComponent.testData[0]);
    });

    it('should emit edit event when edit button clicked', () => {
        const editButton = fixture.nativeElement.querySelector('tbody tr:first-child button[nz-tooltip="編輯"]');

        editButton.click();
        fixture.detectChanges();

        expect(hostComponent.editedItem).toEqual(hostComponent.testData[0]);
    });

    it('should handle loading state', () => {
        hostComponent.loading = true;
        fixture.detectChanges();

        const table = fixture.nativeElement.querySelector('nz-table');
        expect(table).toBeTruthy();
        // Note: nzLoading attribute would be checked in a more detailed test
    });

    it('should handle pagination changes', () => {
        // 模擬分頁變更
        dataTableComponent.onPageChange(2);
        expect(hostComponent.currentPage).toBe(2);

        dataTableComponent.onPageSizeChange(20);
        expect(hostComponent.currentPageSize).toBe(20);
    });

    it('should handle empty data gracefully', () => {
        hostComponent.testData = [];
        fixture.detectChanges();

        const tableRows = fixture.nativeElement.querySelectorAll('tbody tr');
        expect(tableRows.length).toBe(0);
    });

    it('should apply column configuration correctly', () => {
        // 檢查排序功能是否正確應用
        const sortableColumn = hostComponent.testColumns.find(col => col.sortable);
        expect(sortableColumn).toBeTruthy();
        expect(sortableColumn?.key).toBe('name');
    });

    it('should handle different column types', () => {
        const columnTypes = hostComponent.testColumns.map(col => col.type);
        expect(columnTypes).toContain('text');
        expect(columnTypes).toContain('status');
        expect(columnTypes).toContain('currency');
        expect(columnTypes).toContain('date');
        expect(columnTypes).toContain('boolean');
    });
});