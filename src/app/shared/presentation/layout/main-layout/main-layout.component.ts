import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzButtonModule,
    NzAvatarModule,
    NzDropDownModule
  ],
  template: `
    <nz-layout class="layout">
      <nz-header class="header">
        <div class="logo">
          <img src="assets/logo-color.svg" alt="Logo" />
        </div>
        <ul nz-menu nzMode="horizontal" class="menu">
          <li nz-menu-item nzMatchRouter>
            <span nz-icon nzType="dashboard"></span>
            <span>Dashboard</span>
          </li>
          <li nz-menu-item nzMatchRouter>
            <span nz-icon nzType="user"></span>
            <span>Users</span>
          </li>
          <li nz-menu-item nzMatchRouter>
            <span nz-icon nzType="setting"></span>
            <span>Settings</span>
          </li>
        </ul>
        <div class="header-right">
          <nz-dropdown>
            <a class="ant-dropdown-link" nz-dropdown>
              <nz-avatar nzIcon="user"></nz-avatar>
              <span>User</span>
            </a>
            <ul nz-menu nz-dropdown>
              <li nz-menu-item>
                <span nz-icon nzType="user"></span>
                Profile
              </li>
              <li nz-menu-item>
                <span nz-icon nzType="setting"></span>
                Settings
              </li>
              <li nz-menu-divider></li>
              <li nz-menu-item>
                <span nz-icon nzType="logout"></span>
                Logout
              </li>
            </ul>
          </nz-dropdown>
        </div>
      </nz-header>
      
      <nz-layout>
        <nz-sider class="sidebar" nzWidth="200" nzCollapsible nzCollapsedWidth="0">
          <ul nz-menu nzMode="inline" nzTheme="dark">
            <li nz-submenu nzTitle="Dashboard" nzIcon="dashboard">
              <ul>
                <li nz-menu-item>Overview</li>
                <li nz-menu-item>Analytics</li>
              </ul>
            </li>
            <li nz-submenu nzTitle="User Management" nzIcon="user">
              <ul>
                <li nz-menu-item>Users List</li>
                <li nz-menu-item>Create User</li>
              </ul>
            </li>
            <li nz-submenu nzTitle="Settings" nzIcon="setting">
              <ul>
                <li nz-menu-item>General</li>
                <li nz-menu-item>Security</li>
              </ul>
            </li>
          </ul>
        </nz-sider>
        
        <nz-layout>
          <nz-content class="content">
            <router-outlet></router-outlet>
          </nz-content>
        </nz-layout>
      </nz-layout>
    </nz-layout>
  `,
  styles: [`
    .layout {
      height: 100vh;
    }
    
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #fff;
      padding: 0 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }
    
    .logo {
      display: flex;
      align-items: center;
    }
    
    .logo img {
      height: 32px;
      margin-right: 16px;
    }
    
    .menu {
      flex: 1;
      margin-left: 48px;
    }
    
    .header-right {
      display: flex;
      align-items: center;
    }
    
    .ant-dropdown-link {
      display: flex;
      align-items: center;
      gap: 8px;
      color: rgba(0, 0, 0, 0.85);
    }
    
    .sidebar {
      background: #001529;
    }
    
    .content {
      padding: 24px;
      background: #f0f2f5;
      min-height: calc(100vh - 64px);
    }
  `]
})
export class MainLayoutComponent {} 