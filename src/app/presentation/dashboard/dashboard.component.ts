import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { LogoutUseCase } from '../../application/auth/logout.use-case';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  template: `
    <div style="padding: 24px;">
      <h1>Welcome to NG-AC!</h1>
      <div *ngIf="userInfo">
        <p>Hello, {{ userInfo['name'] }}!</p>
        <p>Email: {{ userInfo['email'] }}</p>
      </div>
      <button nz-button nzType="primary" (click)="logout()">Logout</button>
    </div>
  `,
  standalone: true,
  imports: [NzButtonModule, CommonModule]
})
export class DashboardComponent {
  private readonly logoutUseCase = inject(LogoutUseCase);
  private readonly router = inject(Router);
  private readonly tokenService: ITokenService = inject(DA_SERVICE_TOKEN);

  get userInfo() {
    return this.tokenService.get();
  }

  logout(): void {
    this.logoutUseCase.execute();
    this.router.navigate(['/passport/login']);
  }
} 