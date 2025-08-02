import { DecimalPipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, inject, NgZone, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { inNextTick } from 'ng-zorro-antd/core/util';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-workbench',
  templateUrl: './workbench.component.html',
  styleUrls: ['./workbench.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NzGridModule,
    NzCardModule,
    NzTypographyModule,
    NzListModule,
    NzButtonModule,
    NzWaveModule,
    NzIconModule,
    NzAvatarModule,
    NzStatisticModule,
    DecimalPipe
  ]
})
export class WorkbenchComponent implements OnInit, AfterViewInit {
  @ViewChild('pageHeaderContent', { static: false }) pageHeaderContent!: TemplateRef<NzSafeAny>;
  destroyRef = inject(DestroyRef);
  
  private ngZone = inject(NgZone);
  msg = inject(NzMessageService);

  // 模擬數據
  projects = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    title: `專案 ${i + 1}`,
    description: '這是一個示例專案描述，展示專案的基本信息和進度。',
    author: '開發者',
    time: `${i + 1}天前`,
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png'
  }));

  activities = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    user: '用戶名',
    action: '在高效開發團隊新建專案',
    project: '月度迭代',
    time: `${i + 1}天前`,
    avatar: 'assets/imgs/default_face.svg'
  }));

  quickActions = Array.from({ length: 6 }, (_, i) => `操作${i + 1}`);

  teams = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    name: `開發團隊${i + 1}`,
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png'
  }));

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // 初始化圖表等操作
    inNextTick()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        // 這裡可以初始化圖表
        console.log('工作臺頁面初始化完成');
      });
  }

  onQuickAction(action: string): void {
    this.msg.success(`點擊了${action}`);
  }
}