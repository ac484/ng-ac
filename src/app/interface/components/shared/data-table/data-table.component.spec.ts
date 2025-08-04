import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DataTableComponent } from './data-table.component';
import { TableColumn, TableAction, PaginationConfig } from './table-column.interface';

describe('DataTableComponent', () => {
    let component: DataTableComponent;
    let fixture: ComponentFixture<DataTableComponent>;
    let debugElement: DebugElement;

    const mockData = [
        {
            id: '1',
            name: '測試用戶1',
            email: 'test1@example.com',
            status: 'active',
            balance: 1000,
            createdAt: new Date('2024-01-01'),
            isVerified: true
        },
        {
            id: '2',
            name: '測試用戶2',
            email: 'test2@example.com',
            status: 'inactive',
            balance: 2000,
            createdAt: new Date('2024-01-02'),
            isVerified: false
        }
    ];

    const mockColumns: TableColumn[] = [
        { key: 'name', title: '姓名', type: 'text', sortable: true },
        { key: 'email', title: '電子郵件', type: 'text' },
        {
            key: 'status',
            title: '狀態',
            type: 'status',
            statusColors: { active: 'green', inactive: 'red' },
            statusTexts: { active: '啟用', inactive: '停用' }
        },
        { key: 'balance', title: '餘額', type: 'currency' },
        { key: 'createdAt', title: '建立時間', type: 'date' },
        { key: 'isVerified', title: '已驗證', type: 'boolean' }
    ];

    const mockActions: TableAction[] = [
        { type: 'view', title: '檢視', icon: 'eye' },
        { type: 'edit', title: '編輯', icon: 'edit' },
        { type: 'delete', title: '刪除', icon: 'delete', danger: true }
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                DataTableComponent,
                NoopAnimationsModule
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(DataTableComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display data correctly', () => {
        component.data = mockData;
        component.columns = mockColumns;
        fixture.detectChanges();

        const rows = debugElement.queryAll(By.css('tbody tr'));
        expect(rows.length).toBe(2);

        // 檢查第一行資料
        const firstRowCells = rows[0].queryAll(By.css('td'));
        expect(firstRowCells[0].nativeElement.textContent.trim()).toBe('測試用戶1');
        expect(firstRowCells[1].nativeElement.textContent.trim()).toBe('test1@example.com');
    });

    it('should display status with correct color and text', () => {
        component.data = mockData;
        component.columns = mockColumns;
        fixture.detectChanges();

        const statusTags = debugElement.queryAll(By.css('nz-tag'));
        expect(statusTags.length).toBeGreaterThan(0);

        // 檢查狀態標籤
        const activeTag = statusTags.find(tag =>
            tag.nativeElement.textContent.trim() === '啟用'
        );
        expect(activeTag).toBeTruthy();
    });

    it('should format currency correctly', () => {
        expect(component.formatCurrency(1000)).toContain('1,000');
        expect(component.formatCurrency(null)).toBe('-');
        expect(component.formatCurrency('invalid')).toBe('-');
    });

    it('should format date correctly', () => {
        const testDate = new Date('2024-01-01T10:30:00');
        const formatted = component.formatDate(testDate);
        expect(formatted).toContain('2024');
        expect(formatted).toContain('01');

        expect(component.formatDate(null)).toBe('-');
        expect(component.formatDate('invalid')).toBe('-');
    });

    it('should format number correctly', () => {
        expect(component.formatNumber(1234.56)).toBe('1,234.56');
        expect(component.formatNumber(null)).toBe('-');
        expect(component.formatNumber('invalid')).toBe('-');
    });

    it('should handle pagination correctly', () => {
        spyOn(component.pageChange, 'emit');
        spyOn(component.pageSizeChange, 'emit');

        component.onPageChange(2);
        expect(component.pagination.pageIndex).toBe(2);
        expect(component.pageChange.emit).toHaveBeenCalledWith(2);

        component.onPageSizeChange(20);
        expect(component.pagination.pageSize).toBe(20);
        expect(component.pagination.pageIndex).toBe(1); // 應該重置到第一頁
        expect(component.pageSizeChange.emit).toHaveBeenCalledWith(20);
    });

    it('should emit correct events for actions', () => {
        spyOn(component.view, 'emit');
        spyOn(component.edit, 'emit');
        spyOn(component.delete, 'emit');
        spyOn(component.customAction, 'emit');

        const testItem = mockData[0];

        // 測試檢視操作
        component.onActionClick({ type: 'view', title: '檢視', icon: 'eye' }, testItem);
        expect(component.view.emit).toHaveBeenCalledWith(testItem);

        // 測試編輯操作
        component.onActionClick({ type: 'edit', title: '編輯', icon: 'edit' }, testItem);
        expect(component.edit.emit).toHaveBeenCalledWith(testItem);

        // 測試刪除操作
        component.onActionClick({ type: 'delete', title: '刪除', icon: 'delete' }, testItem);
        expect(component.delete.emit).toHaveBeenCalledWith(testItem);

        // 測試自定義操作
        const customAction = { type: 'custom' as const, title: '自定義', icon: 'setting' };
        component.onActionClick(customAction, testItem);
        expect(component.customAction.emit).toHaveBeenCalledWith({ action: customAction, item: testItem });
    });

    it('should handle custom action handler', () => {
        const mockHandler = jasmine.createSpy('handler');
        const actionWithHandler: TableAction = {
            type: 'custom',
            title: '自定義',
            icon: 'setting',
            handler: mockHandler
        };

        const testItem = mockData[0];
        component.onActionClick(actionWithHandler, testItem);

        expect(mockHandler).toHaveBeenCalledWith(testItem);
    });

    it('should filter visible actions correctly', () => {
        const actionsWithVisibility: TableAction[] = [
            { type: 'view', title: '檢視', icon: 'eye' },
            {
                type: 'edit',
                title: '編輯',
                icon: 'edit',
                visible: (item: any) => item.status === 'active'
            },
            {
                type: 'delete',
                title: '刪除',
                icon: 'delete',
                visible: (item: any) => item.status !== 'active'
            }
        ];

        component.actions = actionsWithVisibility;

        const activeItem = mockData[0]; // status: 'active'
        const inactiveItem = mockData[1]; // status: 'inactive'

        const activeActions = component.getVisibleActions(activeItem);
        expect(activeActions.length).toBe(2); // view + edit
        expect(activeActions.some(a => a.type === 'edit')).toBe(true);
        expect(activeActions.some(a => a.type === 'delete')).toBe(false);

        const inactiveActions = component.getVisibleActions(inactiveItem);
        expect(inactiveActions.length).toBe(2); // view + delete
        expect(inactiveActions.some(a => a.type === 'edit')).toBe(false);
        expect(inactiveActions.some(a => a.type === 'delete')).toBe(true);
    });

    it('should handle disabled actions correctly', () => {
        const actionWithDisabled: TableAction = {
            type: 'edit',
            title: '編輯',
            icon: 'edit',
            disabled: (item: any) => item.status === 'inactive'
        };

        const activeItem = mockData[0]; // status: 'active'
        const inactiveItem = mockData[1]; // status: 'inactive'

        expect(component.isActionDisabled(actionWithDisabled, activeItem)).toBe(false);
        expect(component.isActionDisabled(actionWithDisabled, inactiveItem)).toBe(true);
    });

    it('should update visible columns when columns change', () => {
        const columnsWithHidden: TableColumn[] = [
            { key: 'name', title: '姓名', type: 'text' },
            { key: 'email', title: '電子郵件', type: 'text', hidden: true },
            { key: 'status', title: '狀態', type: 'status' }
        ];

        component.columns = columnsWithHidden;
        component.ngOnInit();

        expect(component.visibleColumns.length).toBe(2);
        expect(component.visibleColumns.some(c => c.key === 'email')).toBe(false);
    });

    it('should use default sort function correctly', () => {
        const sortFn = component.getDefaultSortFn('name');

        expect(sortFn({ name: 'A' }, { name: 'B' })).toBeLessThan(0);
        expect(sortFn({ name: 'B' }, { name: 'A' })).toBeGreaterThan(0);
        expect(sortFn({ name: 'A' }, { name: 'A' })).toBe(0);
        expect(sortFn({ name: null }, { name: 'A' })).toBeGreaterThan(0);
        expect(sortFn({ name: 'A' }, { name: null })).toBeLessThan(0);
    });

    it('should use default filter function correctly', () => {
        const filterFn = component.getDefaultFilterFn('name');

        expect(filterFn('test', { name: 'test user' })).toBe(true);
        expect(filterFn('test', { name: 'user' })).toBe(false);
        expect(filterFn('test', { name: null })).toBe(false);
    });

    it('should get correct status colors and texts', () => {
        const column: TableColumn = {
            key: 'status',
            title: '狀態',
            type: 'status',
            statusColors: { custom: 'purple' },
            statusTexts: { custom: '自定義狀態' }
        };

        // 測試自定義狀態
        expect(component.getStatusColor('custom', column)).toBe('purple');
        expect(component.getStatusText('custom', column)).toBe('自定義狀態');

        // 測試預設狀態
        expect(component.getStatusColor('active', column)).toBe('green');
        expect(component.getStatusText('active', column)).toBe('啟用');

        // 測試未知狀態
        expect(component.getStatusColor('unknown', column)).toBe('default');
        expect(component.getStatusText('unknown', column)).toBe('unknown');
    });

    it('should handle loading state', () => {
        component.loading = true;
        fixture.detectChanges();

        const table = debugElement.query(By.css('nz-table'));
        expect(table.componentInstance.nzLoading).toBe(true);
    });

    it('should handle empty data', () => {
        component.data = [];
        component.columns = mockColumns;
        fixture.detectChanges();

        const rows = debugElement.queryAll(By.css('tbody tr'));
        expect(rows.length).toBe(0);
    });

    it('should track items correctly', () => {
        component.trackByKey = 'id';
        const trackResult = component.trackByFn(0, mockData[0]);
        expect(trackResult).toBe('1');

        // 測試沒有指定鍵值的情況
        const itemWithoutId = { name: 'test' };
        const trackResultWithoutId = component.trackByFn(5, itemWithoutId);
        expect(trackResultWithoutId).toBe(5);
    });
});