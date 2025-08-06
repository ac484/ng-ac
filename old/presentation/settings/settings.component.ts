import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-settings',
  template: `
    <div style="padding: 24px;">
      <h1>Settings</h1>
      <p>This is the settings page.</p>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, NzCardModule, NzFormModule, NzButtonModule]
})
export class SettingsComponent {} 