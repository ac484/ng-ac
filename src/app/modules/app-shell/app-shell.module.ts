/**
 * App Shell 模組
 * 負責 App Shell 相關組件和服務的模組化組織
 *
 * @author NG-AC Team
 * @since 2024-12-19
 * @version 1.0.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppShellService, OfflineService } from '../../application/services/app-shell';
import { AppShellComponent } from '../../interface/components/layout/app-shell';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AppShellComponent
  ],
  providers: [
    AppShellService,
    OfflineService
  ],
  exports: [
    AppShellComponent
  ]
})
export class AppShellModule {}
