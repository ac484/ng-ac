import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { Tab } from '../../../domain/layout/tab.entity';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzTabsModule,
    NzDropDownModule,
    NzMenuModule,
    NzIconModule,
    NzButtonModule
  ]
})
export class TabComponent {
  @Input() tabs: Tab[] = [];
  @Input() currentTab: Tab | null = null;
  @Output() tabClick = new EventEmitter<string>();
  @Output() tabClose = new EventEmitter<string>();
  @Output() closeOtherTabs = new EventEmitter<string>();
  @Output() closeRightTabs = new EventEmitter<string>();
  @Output() closeLeftTabs = new EventEmitter<string>();
  @Output() refreshTab = new EventEmitter<string>();

  onTabClick(tabId: string): void {
    this.tabClick.emit(tabId);
  }

  onTabClose(tabId: string, event: Event): void {
    event.stopPropagation();
    this.tabClose.emit(tabId);
  }

  onCloseOtherTabs(tabId: string): void {
    this.closeOtherTabs.emit(tabId);
  }

  onCloseRightTabs(tabId: string): void {
    this.closeRightTabs.emit(tabId);
  }

  onCloseLeftTabs(tabId: string): void {
    this.closeLeftTabs.emit(tabId);
  }

  onRefreshTab(tabId: string): void {
    this.refreshTab.emit(tabId);
  }

  trackByTab(index: number, tab: Tab): string {
    return tab.id;
  }
} 