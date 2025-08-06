import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TabData } from '../../services/tab.service';

@Component({
  selector: 'app-tab-bar',
  standalone: true,
  imports: [
    CommonModule,
    NzTabsModule,
    NzIconModule
  ],
  template: `
    <div class="tab-bar">
      <nz-tabset
        [nzSelectedIndex]="activeTabIndex"
        (nzSelectedIndexChange)="onTabChange($event)"
        [nzType]="'card'"
        [nzAnimated]="false"
        [nzTabBarGutter]="0"
        [nzTabBarStyle]="{ marginBottom: '0', borderBottom: '1px solid #f0f0f0' }">
        
        <nz-tab
          *ngFor="let tab of tabs; trackBy: trackByTabId"
          [nzTitle]="tabTitle"
          [nzClosable]="tab.closable"
          (nzClose)="onTabClose(tab)">
          
          <ng-template #tabTitle>
            <div class="tab-title">
              <i *ngIf="tab.icon" nz-icon [nzType]="tab.icon"></i>
              <span>{{ tab.title }}</span>
            </div>
          </ng-template>
          
        </nz-tab>
      </nz-tabset>
    </div>
  `,
  styles: [`
    .tab-bar {
      background-color: #fff;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .tab-title {
      display: flex;
      align-items: center;
      gap: 4px;
      min-width: 0;
    }
    
    .tab-title span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    :host ::ng-deep .ant-tabs-tab {
      padding: 8px 16px;
      margin-right: 0;
      border-right: 1px solid #f0f0f0;
      background-color: #fafafa;
    }
    
    :host ::ng-deep .ant-tabs-tab-active {
      background-color: #fff;
      border-bottom: 2px solid #1890ff;
    }
    
    :host ::ng-deep .ant-tabs-tab-remove {
      margin-left: 8px;
      color: #999;
    }
    
    :host ::ng-deep .ant-tabs-tab-remove:hover {
      color: #ff4d4f;
    }
    
    :host ::ng-deep .ant-tabs-content-holder {
      display: none;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabBarComponent {
  @Input() tabs: TabData[] = [];
  @Input() activeTabId?: string;
  
  @Output() tabChange = new EventEmitter<string>();
  @Output() tabClose = new EventEmitter<string>();

  get activeTabIndex(): number {
    if (!this.activeTabId) return 0;
    const index = this.tabs.findIndex(tab => tab.id === this.activeTabId);
    return index >= 0 ? index : 0;
  }

  trackByTabId(index: number, tab: TabData): string {
    return tab.id;
  }

  onTabChange(index: number): void {
    const tab = this.tabs[index];
    if (tab) {
      this.tabChange.emit(tab.id);
    }
  }

  onTabClose(tab: TabData): void {
    this.tabClose.emit(tab.id);
  }
}
