import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TabComponent } from '../tab/tab.component';

@Component({
    selector: 'app-main-layout',
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.less'],
    standalone: true,
    imports: [CommonModule, RouterModule, NzLayoutModule, HeaderComponent, SidebarComponent, TabComponent]
})
export class MainLayoutComponent {
    isCollapsed = false;
}

