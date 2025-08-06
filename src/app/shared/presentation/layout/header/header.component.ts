import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.less'],
    standalone: true,
    imports: [CommonModule, NzIconModule, NzAvatarModule, NzDropDownModule, NzMenuModule]
})
export class HeaderComponent {
    @Input() isCollapsed!: boolean;
    @Input() username: string = 'Admin';
    @Output() isCollapsedChange = new EventEmitter<boolean>();

    toggleCollapse(): void {
        this.isCollapsed = !this.isCollapsed;
        this.isCollapsedChange.emit(this.isCollapsed);
    }

    logout(): void {
        console.log('logout');
    }
}

