import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef, ChangeDetectorRef, inject } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AntTableConfig, SortFile } from '../../../shared/components/ant-table/ant-table.component';
import { CardTableWrapComponent } from '../../../shared/components/card-table-wrap/card-table-wrap.component';
import { PageHeaderType, PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { TreeTableComponent } from '../../../shared/components/tree-table/tree-table.component';
import { WaterMarkComponent } from '../../../shared/components/water-mark/water-mark.component';
import { CopyTextComponent } from '../../../shared/components/copy-text/copy-text.component';
import { DebounceClickDirective } from '../../../shared/directives/debounce-click.directive';
import { ToggleFullscreenDirective } from '../../../shared/directives/toggle-fullscreen.directive';
import { fnFlattenTreeDataByDataList } from '../../../utils/treeTableTools';
import { fnFormatFileSize, fnGetUUID } from '../../../utils/tools';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

interface SearchParam {
  ruleName: string;
  desc: string;
}

@Component({
  selector: 'app-tree-list',
  templateUrl: './tree-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    PageHeaderComponent,
    NzCardModule,
    WaterMarkComponent,
    CopyTextComponent,
    DebounceClickDirective,
    ToggleFullscreenDirective,
    FormsModule,
    NzFormModule,
    NzGridModule,
    NzInputModule,
    NzButtonModule,
    NzWaveModule,
    NzIconModule,
    CardTableWrapComponent,
    TreeTableComponent,
    NzBadgeModule
  ]
})
export class TreeListComponent implements OnInit {
  @ViewChild('highLightTpl', { static: true }) highLightTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true }) operationTpl!: TemplateRef<NzSafeAny>;
  searchParam: Partial<SearchParam> = {};

  isCollapse = true;
  tableConfig!: AntTableConfig;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '樹狀表格範例',
    desc: '展示如何使用 tree-table 組件，支援展開/收合、排序、分頁、複選框等功能',
    breadcrumb: ['首頁', '儀表板', '樹狀表格']
  };
  checkedCashArray: any[] = [];
  dataList: NzSafeAny[] = [];

  private modalSrv = inject(NzModalService);
  private message = inject(NzMessageService);
  private cdr = inject(ChangeDetectorRef);

  reloadTable(): void {
    this.message.info('已經刷新了');
    this.getDataList();
  }

  // 觸發表格變更檢測
  tableChangeDectction(): void {
    // 改變引用觸發變更檢測。
    this.dataList = [...this.dataList];
    this.cdr.detectChanges();
  }

  tableLoading(isLoading: boolean): void {
    this.tableConfig.loading = isLoading;
    this.tableChangeDectction();
  }

  getDataList(e?: NzTableQueryParams): void {
    this.tableConfig.loading = true;
    this.dataList = [];
    setTimeout(() => {
      this.dataList = [
        {
          id: `1`,
          name: 'John Brown sr.',
          sex: '男',
          age: 60,
          address: 'New York No. 1 Lake Park',
          children: [
            {
              id: `1-1`,
              name: 'John Brown',
              age: 42,
              sex: '男',
              address: 'New York No. 2 Lake Park'
            },
            {
              id: `1-2`,
              name: 'John Brown jr.',
              age: 30,
              sex: '男',
              address: 'New York No. 3 Lake Park',
              children: [
                {
                  id: `1-2-1`,
                  name: 'Jimmy Brown',
                  sex: '男',
                  age: 16,
                  address: 'New York No. 3 Lake Park'
                }
              ]
            },
            {
              id: `1-3`,
              name: 'Jim Green sr.',
              age: 72,
              sex: '男',
              address: 'London No. 1 Lake Park',
              children: [
                {
                  id: `1-3-1`,
                  name: 'Jim Green',
                  sex: '男',
                  age: 42,
                  address: 'London No. 2 Lake Park',
                  children: [
                    {
                      id: `1-3-1-1`,
                      name: 'Jim Green jr.',
                      sex: '男',
                      age: 25,
                      address: 'London No. 3 Lake Park'
                    },
                    {
                      id: `1-3-1-2`,
                      name: 'Jimmy Green sr.',
                      sex: '男',
                      age: 18,
                      address: 'London No. 4 Lake Park'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: `2`,
          name: 'Joe Black',
          sex: '男',
          age: 32,
          address: 'Sidney No. 1 Lake Park'
        }
      ];
      this.tableConfig.total = 13;
      this.tableConfig.pageIndex = 1;
      
      // 模擬一些預選的數據
      const cashFromHttp = [
        {
          id: `1`,
          name: 'John Brown sr.',
          sex: '男',
          age: 60,
          address: 'New York No. 1 Lake Park'
        }
      ];
      this.checkedCashArray = fnFlattenTreeDataByDataList(cashFromHttp);
      this.tableLoading(false);
    }, 1000);
  }

  /*展開*/
  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
  }

  /*查看*/
  check(id: string, children: any[], parent: any[]): void {
    this.message.success(`查看 ID: ${id}`);
    console.log('children:', children);
    console.log('parent:', parent);
  }

  /*重置*/
  resetForm(): void {
    this.searchParam = {};
    this.getDataList();
  }

  add(): void {
    this.message.info('新增功能');
  }

  del(id: number): void {
    this.modalSrv.confirm({
      nzTitle: '確定要刪除嗎？',
      nzContent: '刪除後不可恢復',
      nzOnOk: () => {
        this.tableLoading(true);
        this.message.info(`刪除 ID: ${id}`);
        this.getDataList();
        this.checkedCashArray.splice(
          this.checkedCashArray.findIndex(item => item.id === id),
          1
        );
        this.tableLoading(false);
      }
    });
  }

  allDel(): void {
    if (this.checkedCashArray.length > 0) {
      this.modalSrv.confirm({
        nzTitle: '確定要刪除嗎？',
        nzContent: '刪除後不可恢復',
        nzOnOk: () => {
          const tempArrays: number[] = [];
          this.checkedCashArray.forEach(item => {
            tempArrays.push(item.id);
          });
          this.tableLoading(true);
          this.message.info(`批量刪除 IDs: ${JSON.stringify(tempArrays)}`);
          this.getDataList();
          this.checkedCashArray = [];
          this.tableLoading(false);
        }
      });
    } else {
      this.message.error('請勾選數據');
      return;
    }
  }

  // 修改
  edit(id: number): void {
    this.message.info(`編輯 ID: ${id}`);
  }

  changeSort(e: SortFile): void {
    this.message.info(`排序字段：${e.fileName}, 排序為: ${e.sortDir}`);
  }

  // 最左側複選框選中觸發
  selectedChecked(e: any): void {
    this.checkedCashArray = [...e];
    console.log('選中的數據:', this.checkedCashArray);
  }

  // 修改一頁幾條
  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: '姓名',
          width: 230,
          field: 'name',
          showSort: true,
          tdClassList: ['operate-text']
        },
        {
          title: '性別',
          field: 'sex',
          width: 230,
          tdTemplate: this.highLightTpl
        },
        {
          title: '年齡',
          field: 'age',
          width: 230,
          showSort: true
        },
        {
          title: '住址',
          field: 'address'
        },
        {
          title: '操作',
          tdTemplate: this.operationTpl,
          width: 130,
          fixed: true,
          fixedDir: 'right'
        }
      ],
      total: 0,
      showCheckbox: true,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };
  }

  ngOnInit(): void {
    this.initTable();
    this.getDataList();
  }
}