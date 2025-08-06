import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    template: `
    <h1>Dashboard</h1>
  `,
    standalone: true,
    imports: [CommonModule]
})
export class DashboardComponent { }
