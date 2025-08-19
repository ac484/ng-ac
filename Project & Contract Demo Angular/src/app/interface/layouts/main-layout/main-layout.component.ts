/**
 * @ai-context {
 *   "role": "Interface/Layout",
 *   "purpose": "主要布局組件-應用程式主要布局結構",
 *   "constraints": ["響應式設計", "Material Design", "導航管理"],
 *   "dependencies": ["MatSidenavModule", "MatToolbarModule", "MatIconModule"],
 *   "security": "low",
 *   "lastmod": "2025-08-19"
 * }
 * @usage <app-main-layout></app-main-layout>
 * @see docs/architecture/layouts.md
 */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #drawer class="sidenav" fixedInViewport
          [attr.role]="'navigation'"
          [mode]="'side'"
          [opened]="true">
        <mat-toolbar>Navigation</mat-toolbar>
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/projects" routerLinkActive="active">
            <mat-icon matListItemIcon>work</mat-icon>
            <span matListItemTitle>Projects</span>
          </a>
          <a mat-list-item routerLink="/contracts" routerLinkActive="active">
            <mat-icon matListItemIcon>description</mat-icon>
            <span matListItemTitle>Contracts</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <button
            type="button"
            aria-label="Toggle sidenav"
            mat-icon-button
            (click)="drawer.toggle()">
            <mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
          </button>
          <span>Project & Contract Demo</span>
        </mat-toolbar>
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }

    .sidenav {
      width: 250px;
    }

    .sidenav .mat-toolbar {
      background: inherit;
    }

    .mat-toolbar.mat-primary {
      position: sticky;
      top: 0;
      z-index: 1;
    }

    .content {
      padding: 20px;
      height: calc(100vh - 64px);
      overflow-y: auto;
    }

    .active {
      background-color: rgba(0, 0, 0, 0.04);
    }

    @media (max-width: 768px) {
      .sidenav {
        width: 200px;
      }

      .content {
        padding: 16px;
      }
    }
  `]
})
export class MainLayoutComponent {
  constructor(private router: Router) {}
}
