import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-settings',
  template: `
    <h2>User Settings</h2>
    <p>Settings form goes here.</p>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class UserSettingsComponent {}
