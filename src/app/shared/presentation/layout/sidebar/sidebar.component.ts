import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.less'],
    standalone: true,
    imports: [CommonModule, RouterModule, NzMenuModule, NzIconModule]
})
export class SidebarComponent {
    @Input() isCollapsed!: boolean;
}

