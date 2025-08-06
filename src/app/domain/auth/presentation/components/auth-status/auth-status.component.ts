import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth, user, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth-status',
  template: `
    <div *ngIf="user$ | async as user; else showLogin">
      Hello, {{ user.displayName || user.email }}!
      <button (click)="logout()">Logout</button>
    </div>
    <ng-template #showLogin>
      <a routerLink="/auth/login">Login</a>
    </ng-template>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class AuthStatusComponent implements OnInit {
  user$: Observable<User | null>;

  constructor(private auth: Auth) {
    this.user$ = user(this.auth);
  }

  ngOnInit(): void {}

  logout(): void {
    this.auth.signOut();
  }
}
