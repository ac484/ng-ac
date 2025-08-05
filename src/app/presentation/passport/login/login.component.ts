import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-passport-login',
  template: `<router-outlet />`,
  standalone: true,
  imports: [RouterOutlet]
})
export class LoginComponent {} 