import { Component, Input, Output, EventEmitter, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

import { Layout } from '../../../domain/layout/layout.entity';
import { Menu } from '../../../domain/layout/menu.entity';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, NzMenuModule, NzIconModule, NzLayoutModule]
})
export class SidebarComponent {
  @Input() layout: Layout | null = null;
  @Output() menuClick = new EventEmitter<{ title: string; path: string }>();

  private readonly router = inject(Router);

  menus: Menu[] = [
    new Menu({
      text: 'Dashboard',
      link: '/dashboard',
      icon: 'dashboard'
    }),
    new Menu({
      text: 'User Management',
      link: '/users',
      icon: 'user'
    }),
    new Menu({
      text: 'Settings',
      link: '/settings',
      icon: 'setting'
    })
  ];

  onMenuClick(menu: Menu): void {
    if (menu.link) {
      this.menuClick.emit({
        title: menu.text,
        path: menu.link
      });
      this.router.navigate([menu.link]);
    }
  }

  isMenuActive(menu: Menu): boolean {
    return this.router.url === menu.link;
  }
} 