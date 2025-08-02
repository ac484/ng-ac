import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzFloatButtonModule } from 'ng-zorro-antd/float-button';
import { NzIconModule } from 'ng-zorro-antd/icon';

export interface FloatActionButton {
    key: string;
    tooltip: string;
    icon: string;
    type?: 'primary' | 'default';
}

@Component({
    selector: 'app-float-action-buttons',
    templateUrl: './float-action-buttons.component.html',
    styleUrls: ['./float-action-buttons.component.less'],
    imports: [NzFloatButtonModule, NzIconModule],
    standalone: true
})
export class FloatActionButtonsComponent {
    @Input() buttons: FloatActionButton[] = [];
    @Output() buttonClick = new EventEmitter<string>();

    onButtonClick(key: string): void {
        this.buttonClick.emit(key);
    }
} 