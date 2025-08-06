import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TitleService, stepPreloader } from '@delon/theme';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SHARED_IMPORTS } from './shared/shared-imports';
import { ThemeBtnComponent } from '@delon/theme/theme-btn';
import { SettingDrawerModule } from '@delon/theme/setting-drawer';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet />
    <theme-btn />
    @if (showSettingDrawer) {
      <setting-drawer />
    }
  `,
  imports: [RouterOutlet, ...SHARED_IMPORTS, ThemeBtnComponent, SettingDrawerModule],
  standalone: true
})
export class AppComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly titleSrv = inject(TitleService);
  private readonly modalSrv = inject(NzModalService);

  showSettingDrawer = !environment.production;
  private donePreloader = stepPreloader();

  ngOnInit(): void {
    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        this.donePreloader();
        this.titleSrv.setTitle();
        this.modalSrv.closeAll();
      }
    });
  }
}
