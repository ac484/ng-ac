import { DecimalPipe, PercentPipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, inject, NgZone } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzCardModule } from 'ng-zorro-antd/card';
import { inNextTick } from 'ng-zorro-antd/core/util';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NzCardModule, 
    NzBreadCrumbModule, 
    NzGridModule, 
    NzStatisticModule, 
    NzTypographyModule, 
    DecimalPipe, 
    PercentPipe
  ]
})
export class MonitorComponent implements AfterViewInit {
  deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30;
  destroyRef = inject(DestroyRef);
  
  private ngZone = inject(NgZone);

  // 模擬數據
  todayTransaction = 124543233;
  salesTarget = 0.92;
  transactionPerSecond = 234;

  ngAfterViewInit(): void {
    inNextTick()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.ngZone.runOutsideAngular(() => {
          // 這裡可以初始化各種圖表
          this.initCharts();
        });
      });
  }

  private initCharts(): void {
    // 初始化儀表板
    this.initDashBoard();
    // 初始化迷你區域圖
    this.initArea();
    // 初始化液體填充圖
    this.initLiquidPlot();
    // 初始化環形進度圖
    for (let i = 1; i <= 3; i++) {
      this.initRingProgress(i);
    }
    // 初始化詞雲
    this.initWordCloud();
    // 初始化地圖
    this.initMap();
  }

  private initDashBoard(): void {
    // 模擬儀表板初始化
    const element = document.getElementById('dashBoard');
    if (element) {
      element.innerHTML = '<div class="chart-placeholder">儀表板圖表</div>';
    }
  }

  private initArea(): void {
    // 模擬迷你區域圖初始化
    const element = document.getElementById('miniArea');
    if (element) {
      element.innerHTML = '<div class="chart-placeholder">趨勢圖表</div>';
    }
  }

  private initLiquidPlot(): void {
    // 模擬液體填充圖初始化
    const element = document.getElementById('liquidPlot');
    if (element) {
      element.innerHTML = '<div class="chart-placeholder">液體填充圖</div>';
    }
  }

  private initRingProgress(i: number): void {
    // 模擬環形進度圖初始化
    const element = document.getElementById(`ringProgress${i}`);
    if (element) {
      element.innerHTML = '<div class="chart-placeholder">環形圖</div>';
    }
  }

  private initWordCloud(): void {
    // 模擬詞雲初始化
    const element = document.getElementById('wordCloud');
    if (element) {
      element.innerHTML = '<div class="chart-placeholder">詞雲圖</div>';
    }
  }

  private initMap(): void {
    // 模擬地圖初始化
    const element = document.getElementById('map');
    if (element) {
      element.innerHTML = '<div class="chart-placeholder">地圖區域</div>';
    }
  }
}