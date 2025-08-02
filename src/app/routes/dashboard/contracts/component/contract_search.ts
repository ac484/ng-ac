/**
 * 合約搜索表單組件
 * 提供合約搜索、篩選和重置功能
 */

import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { WaterMarkComponent } from '../../../../shared/components/water-mark/water-mark.component';
import { DebounceClickDirective } from '../../../../shared/directives/debounce-click.directive';
import { ToggleFullscreenDirective } from '../../../../shared/directives/toggle-fullscreen.directive';
import { SearchParam, StatusOption, AmountValue } from '../../../../core/types/contract.types';
import { AmountConverter } from '../../../../core/utils/type-converter';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';



@Component({
  selector: 'app-contract-search-form',
  template: `
    <nz-card class="mb-16" [nzBodyStyle]="{ 'padding-bottom': 0 }">
      <app-water-mark text="合約管理系統" />
      
      <form nz-form [formGroup]="searchForm">
        <div nz-row [nzGutter]="{ xs: 8, sm: 16, md: 24 }">
          <!-- 合約編號 -->
          <div nz-col [nzLg]="8" [nzMd]="12" [nzSm]="24" [nzXl]="6" [nzXs]="24" [nzXXl]="6">
            <nz-form-item>
              <nz-form-label>合約編號</nz-form-label>
              <nz-form-control>
                <input nz-input formControlName="contractCode" placeholder="請輸入合約編號" />
              </nz-form-control>
            </nz-form-item>
          </div>
          
          <!-- 客戶名稱 -->
          <div nz-col [nzLg]="8" [nzMd]="12" [nzSm]="24" [nzXl]="6" [nzXs]="24" [nzXXl]="6">
            <nz-form-item>
              <nz-form-label>客戶名稱</nz-form-label>
              <nz-form-control>
                <input nz-input formControlName="clientName" placeholder="請輸入客戶名稱" />
              </nz-form-control>
            </nz-form-item>
          </div>
          
          <!-- 合約名稱 -->
          <div nz-col [nzLg]="8" [nzMd]="12" [nzSm]="24" [nzXl]="6" [nzXs]="24" [nzXXl]="6">
            <nz-form-item>
              <nz-form-label>合約名稱</nz-form-label>
              <nz-form-control>
                <input nz-input formControlName="contractName" placeholder="請輸入合約名稱" />
              </nz-form-control>
            </nz-form-item>
          </div>
          
          <!-- 合約狀態 -->
          <div nz-col [nzLg]="8" [nzMd]="12" [nzSm]="24" [nzXl]="6" [nzXs]="24" [nzXXl]="6">
            <nz-form-item>
              <nz-form-label>合約狀態</nz-form-label>
              <nz-form-control>
                <nz-select formControlName="status" nzPlaceHolder="請選擇狀態" nzAllowClear>
                  @for (option of statusOptions; track option.value) {
                    <nz-option [nzValue]="option.value" [nzLabel]="option.label"></nz-option>
                  }
                </nz-select>
              </nz-form-control>
            </nz-form-item>
          </div>

          <!-- 展開後的欄位 -->
          @if (!isCollapse) {
            <!-- 最小金額 -->
            <div nz-col [nzLg]="8" [nzMd]="12" [nzSm]="24" [nzXl]="6" [nzXs]="24" [nzXXl]="6">
              <nz-form-item>
                <nz-form-label>最小金額</nz-form-label>
                <nz-form-control>
                  <nz-input-number 
                    formControlName="minAmount" 
                    [nzMin]="0" 
                    [nzFormatter]="formatNumber"
                    [nzParser]="parseNumber" 
                    nzPlaceHolder="最小金額">
                  </nz-input-number>
                </nz-form-control>
              </nz-form-item>
            </div>
            
            <!-- 最大金額 -->
            <div nz-col [nzLg]="8" [nzMd]="12" [nzSm]="24" [nzXl]="6" [nzXs]="24" [nzXXl]="6">
              <nz-form-item>
                <nz-form-label>最大金額</nz-form-label>
                <nz-form-control>
                  <nz-input-number 
                    formControlName="maxAmount" 
                    [nzMin]="0" 
                    [nzFormatter]="formatNumber"
                    [nzParser]="parseNumber" 
                    nzPlaceHolder="最大金額">
                  </nz-input-number>
                </nz-form-control>
              </nz-form-item>
            </div>
          }

          <!-- 操作按鈕 -->
          <div class="text-right p-0" nz-col [nzLg]="8" [nzMd]="12" [nzSm]="24" [nzXl]="6" [nzXs]="24" [nzXXl]="6">
            <button 
              nz-button 
              nzType="primary" 
              appDebounceClick 
              [debounceTime]="500" 
              (debounceClick)="onSearch()">
              <i nz-icon nzType="search"></i>
              搜索
            </button>
            
            <button class="ml-8" nz-button (click)="onReset()">
              <i nz-icon nzType="close-circle"></i>
              重置
            </button>
            
            <button class="ml-8" nz-button appToggleFullscreen #fullscreen="appToggleFullscreen">
              <i nz-icon [nzType]="fullscreen.isFullscreenFlag ? 'fullscreen' : 'fullscreen-exit'"></i>
            </button>
            
            <a class="collapse operate-text ml-8" (click)="toggleCollapse()">
              @if (isCollapse) {
                <span>展開</span>
                <i nz-icon nzType="down"></i>
              } @else {
                <span>收起</span>
                <i nz-icon nzType="up"></i>
              }
            </a>
          </div>
        </div>
      </form>
    </nz-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WaterMarkComponent,
    DebounceClickDirective,
    ToggleFullscreenDirective,
    NzCardModule,
    NzFormModule,
    NzGridModule,
    NzInputModule,
    NzInputNumberModule,
    NzSelectModule,
    NzButtonModule,
    NzIconModule
  ]
})
export class ContractSearchFormComponent implements OnInit {
  @Input() statusOptions: StatusOption[] = [];
  @Input() isCollapse = true;
  
  @Output() search = new EventEmitter<SearchParam>();
  @Output() reset = new EventEmitter<void>();
  @Output() collapseChange = new EventEmitter<boolean>();

  searchForm!: FormGroup;
  
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.searchForm = this.fb.group({
      contractCode: [''],
      clientName: [''],
      contractName: [''],
      status: [''],
      minAmount: [null],
      maxAmount: [null]
    });
  }

  onSearch(): void {
    const searchParam = this.searchForm.value;
    this.search.emit(searchParam);
  }

  onReset(): void {
    this.searchForm.reset();
    this.reset.emit();
  }

  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
    this.collapseChange.emit(this.isCollapse);
  }

  // 數字格式化方法 - 使用統一的型別轉換工具
  formatNumber = (value: AmountValue): string => {
    return AmountConverter.format(value).formatted;
  };

  parseNumber = (value: string): number => {
    const result = AmountConverter.parse(value);
    return result.success && result.data !== null && result.data !== undefined ? result.data : 0;
  };
}