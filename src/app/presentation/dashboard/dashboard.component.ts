import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { LogoutUseCase } from '../../application/auth/logout.use-case';

@Component({
  selector: 'app-dashboard',
  template: `
    <h1>Welcome to the Dashboard!</h1>
    <button nz-button nzType="primary" (click)="logout()">Logout</button>
  `,
  standalone: true,
  imports: [NzButtonModule]
})
export class DashboardComponent {
  private readonly logoutUseCase = inject(LogoutUseCase);
  private readonly router = inject(Router);

  logout(): void {
    this.logoutUseCase.execute();
    this.router.navigate(['/passport/login']);
  }
} 