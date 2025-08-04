import { Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SimplifiedAuthService } from '../../../application/services/simplified-auth.service';

@Component({
  selector: 'app-simplified-anonymous-login',
  standalone: true,
  imports: [NzButtonModule, NzIconModule],
  template: `
    <button 
      nz-button 
      nzType="primary" 
      [nzLoading]="loading"
      (click)="loginAnonymously()"
    >
      <i nz-icon nzType="user"></i>
      匿名登入
    </button>
  `,
  styles: [`
    button {
      margin: 8px;
    }
  `]
})
export class SimplifiedAnonymousLoginComponent {
  private readonly authService = inject(SimplifiedAuthService);
  loading = false;

  async loginAnonymously(): Promise<void> {
    if (this.loading) return;
    
    this.loading = true;
    try {
      await this.authService.quickAnonymousLogin();
    } finally {
      this.loading = false;
    }
  }
} 