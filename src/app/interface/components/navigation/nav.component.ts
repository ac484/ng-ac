import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, NzMenuModule, NzLayoutModule, NzIconModule],
  template: `
    <nz-layout>
      <nz-header style="background: #fff; padding: 0;">
        <div class="logo">DDD Application</div>
        <ul nz-menu nzMode="horizontal" nzTheme="light" style="line-height: 64px;">
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/dashboard">
              <span nz-icon nzType="dashboard"></span>
              Dashboard
            </a>
          </li>
          <li nz-submenu nzTitle="Users" nzIcon="user">
            <ul>
              <li nz-menu-item nzMatchRouter>
                <a routerLink="/users">User List</a>
              </li>
              <li nz-menu-item nzMatchRouter>
                <a routerLink="/users/create">Create User</a>
              </li>
            </ul>
          </li>
          <li nz-submenu nzTitle="Accounts" nzIcon="bank">
            <ul>
              <li nz-menu-item nzMatchRouter>
                <a routerLink="/accounts">Account List</a>
              </li>
              <li nz-menu-item nzMatchRouter>
                <a routerLink="/accounts/create">Create Account</a>
              </li>
            </ul>
          </li>
          <li nz-submenu nzTitle="Transactions" nzIcon="transaction">
            <ul>
              <li nz-menu-item nzMatchRouter>
                <a routerLink="/transactions">Transaction List</a>
              </li>
              <li nz-menu-item nzMatchRouter>
                <a routerLink="/transactions/create">Create Transaction</a>
              </li>
            </ul>
          </li>
          <li nz-submenu nzTitle="Auth" nzIcon="safety">
            <ul>
              <li nz-menu-item nzMatchRouter>
                <a routerLink="/auth/login">Login</a>
              </li>
              <li nz-menu-item nzMatchRouter>
                <a routerLink="/auth/register">Register</a>
              </li>
              <li nz-menu-item nzMatchRouter>
                <a routerLink="/auth/profile">Profile</a>
              </li>
            </ul>
          </li>
        </ul>
      </nz-header>

      <nz-content style="padding: 0 50px;">
        <div style="background: #fff; padding: 24px; min-height: 280px;">
          <router-outlet></router-outlet>
        </div>
      </nz-content>
    </nz-layout>
  `,
  styles: [
    `
      .logo {
        float: left;
        width: 120px;
        height: 31px;
        margin: 16px 24px 16px 0;
        background: rgba(255, 255, 255, 0.3);
        text-align: center;
        line-height: 31px;
        font-weight: bold;
      }
    `
  ]
})
export class NavComponent {}
