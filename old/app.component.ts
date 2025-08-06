import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { StartupApplicationService } from './application/startup/startup.application.service';
import { BehaviorSubject } from 'rxjs';
import { stepPreloader } from '@delon/theme';
import { TitleService } from '@delon/theme';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <ng-container *ngIf="isLoading$ | async; else content">
        <div class="loading-container">
          <nz-spin nzSize="large" nzTip="Loading..."></nz-spin>
        </div>
      </ng-container>
      <ng-template #content>
        <router-outlet />
      </ng-template>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      width: 100vw;
    }
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      width: 100vw;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
  `],
  imports: [RouterOutlet, CommonModule, NzSpinModule],
  standalone: true
})
export class AppComponent implements OnInit {
  private startupService = inject(StartupApplicationService);
  private router = inject(Router);
  private titleSrv = inject(TitleService);
  private modalSrv = inject(NzModalService);
  private loadingSubject = new BehaviorSubject<boolean>(true);
  isLoading$ = this.loadingSubject.asObservable();
  
  // 使用 stepPreloader 管理加載狀態
  private donePreloader = stepPreloader();

  ngOnInit(): void {
    // 監聽路由事件，完成預加載器
    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        this.donePreloader();
        this.titleSrv.setTitle();
        this.modalSrv.closeAll();
      }
    });

    // 啟動服務完成後隱藏加載指示器
    this.startupService.load().subscribe({
      next: () => {
        this.loadingSubject.next(false);
      },
      error: () => {
        this.loadingSubject.next(false);
      }
    });
  }
}
