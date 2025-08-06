import { Component, Input, Output, EventEmitter, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';

import { Layout, LayoutMode, ThemeMode } from '../../../domain/layout/layout.entity';
import { LogoutUseCase } from '../../../application/auth/logout.use-case';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    NzLayoutModule,
    NzButtonModule,
    NzIconModule,
    NzDropDownModule,
    NzMenuModule,
    NzAvatarModule
  ]
})
export class HeaderComponent {
  @Input() layout: Layout | null = null;
  @Output() toggleCollapsed = new EventEmitter<void>();
  @Output() setMode = new EventEmitter<LayoutMode>();
  @Output() setTheme = new EventEmitter<ThemeMode>();

  private readonly logoutUseCase = inject(LogoutUseCase);

  onToggleCollapsed(): void {
    this.toggleCollapsed.emit();
  }

  onSetMode(mode: LayoutMode): void {
    this.setMode.emit(mode);
  }

  onSetTheme(theme: ThemeMode): void {
    this.setTheme.emit(theme);
  }

  onLogout(): void {
    this.logoutUseCase.execute();
  }
} 