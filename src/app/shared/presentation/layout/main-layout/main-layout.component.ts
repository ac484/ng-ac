import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  template: `
    <app-header></app-header>
    <app-sidebar></app-sidebar>
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, FooterComponent, RouterModule],
})
export class MainLayoutComponent {}
