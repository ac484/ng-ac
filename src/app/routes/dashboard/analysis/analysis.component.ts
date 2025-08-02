import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, inject, NgZone, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { inNextTick } from 'ng-zorro-antd/core/util';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

interface DataItem {
  name: string;
  chinese: number;
  math: number;
  english: number;
}

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NzCardModule,
    NzBreadCrumbModule,
    NzGridModule,
    NzIconModule,
    NzButtonModule,
    NzToolTipModule,
    NzDividerModule,
    NzTabsModule,
    NzBadgeModule,
    NzRadioModule,
    NzDatePickerModule,
    NzTypographyModule,
    NzTableModule
  ]
})
export class AnalysisComponent implements AfterViewInit {
  destroyRef = inject(DestroyRef);
  cardPadding = { padding: '20px 24px 8px' };
  
  // 模擬數據
  salesData = {
    total: '￥126,560',
    daily: '￥12,423',
    dayCompare: '11%',
    weekCompare: '12%'
  };

  visitData = {
    total: '8,846',
    daily: '1,234'
  };

  paymentData = {
    total: '6,560',
    conversion: '60%'
  };

  activityData = {
    total: '78%',
    daily: '￥12,423'
  };

  // 表格數據
  listOfColumn = [
    {
      title: '排名',
      compare: null,
      priority: false
    },
    {
      title: '搜索關鍵詞',
      compare: (a: DataItem, b: DataItem) => a.chinese - b.chinese,
      priority: 3
    },
    {
      title: '用戶數',
      compare: (a: DataItem, b: DataItem) => a.math - b.math,
      priority: 2
    },
    {
      title: '週漲幅',
      compare: (a: DataItem, b: DataItem) => a.english - b.english,
      priority: 1
    }
  ];

  listOfData: DataItem[] = [
    { name: 'Angular', chinese: 98, math: 60, english: 70 },
    { name: 'React', chinese: 95, math: 66, english: 89 },
    { name: 'Vue', chinese: 92, math: 90, english: 70 },
    { name: 'TypeScript', chinese: 88, math: 99, english: 89 },
    { name: 'JavaScript', chinese: 85, math: 85, english: 75 }
  ];

  // 門店數據
  storeRankings = Array.from({ length: 7 }, (_, i) => ({
    rank: i + 1,
    name: `工專路 ${i + 1} 號店`,
    sales: 323234 - i * 10000
  }));

  private ngZone = inject(NgZone);

  ngAfterViewInit(): void {
    inNextTick()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.ngZone.runOutsideAngular(() => {
          this.initCharts();
        });
      });
  }

  private initCharts(): void {
    // 初始化各種圖表
    this.initMinibar();
    this.initMiniArea();
    this.initProgress();
    this.initHistogram();
    this.initSearchArea();
    this.initSearchAvgArea();
    this.initRing();
  }

  private initMinibar(): void {
    const element = document.getElementById('miniBar');
    if (element) {
      element.innerHTML = '<div class="chart-placeholder">迷你柱狀圖</div>';
    }
  }

  private initMiniArea(): void {
    const element = document.getElementById('miniArea');
    if (element) {
      element.innerHTML = '<div class="chart-placeholder">迷你面積圖</div>';
    }
  }

  private initProgress(): void {
    const element = document.getElementById('progress');
    if (element) {
      element.innerHTML = '<div class="chart-placeholder">進度條圖表</div>';
    }
  }

  private initHistogram(): void {
    const element = document.getElementById('histogram');
    if (element) {
      element.innerHTML = '<div class="chart-placeholder">銷售趨勢圖表</div>';
    }
  }

  private initSearchArea(): void {
    const element = document.getElementById('searchUserChart');
    if (element) {
      element.innerHTML = '<div class="chart-placeholder">搜索用戶圖表</div>';
    }
  }

  private initSearchAvgArea(): void {
    const element = document.getElementById('searchUserAvgChart');
    if (element) {
      element.innerHTML = '<div class="chart-placeholder">平均搜索圖表</div>';
    }
  }

  private initRing(): void {
    const element = document.getElementById('ringPie');
    if (element) {
      element.innerHTML = '<div class="chart-placeholder">環形餅圖</div>';
    }
  }
}