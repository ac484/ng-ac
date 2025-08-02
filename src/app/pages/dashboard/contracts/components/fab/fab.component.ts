import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, Input, TemplateRef, ViewChild } from '@angular/core';
import { NzFloatButtonModule } from 'ng-zorro-antd/float-button';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { FabAction } from './fab.models';

@Component({
  selector: 'hub-fab',
  standalone: true,
  imports: [CommonModule, NzFloatButtonModule, NzIconModule, DragDropModule],
  template: `
    <div
      class="fab-drag-anchor"
      cdkDrag
      [cdkDragFreeDragPosition]="{ x: dragX, y: dragY }"
      (cdkDragEnded)="onDragEnd($event)"
      (cdkDragMoved)="onDragMove($event)"
    >
      <nz-float-button-group [nzIcon]="currentIcon" nzType="primary" nzTrigger="click" [nzPlacement]="smartPlacement">
        <nz-float-button *ngFor="let action of actions" [nzIcon]="getActionIcon(action.icon)" (click)="onAction.emit(action.type)">
        </nz-float-button>
      </nz-float-button-group>

      <!-- Icon templates -->
      <ng-template #upIcon><nz-icon nzType="up" nzTheme="outline" /></ng-template>
      <ng-template #downIcon><nz-icon nzType="down" nzTheme="outline" /></ng-template>
      <ng-template #leftIcon><nz-icon nzType="left" nzTheme="outline" /></ng-template>
      <ng-template #rightIcon><nz-icon nzType="right" nzTheme="outline" /></ng-template>
      <ng-template #plusIcon><nz-icon nzType="plus" nzTheme="outline" /></ng-template>
      <ng-template #editIcon><nz-icon nzType="edit" nzTheme="outline" /></ng-template>
      <ng-template #deleteIcon><nz-icon nzType="delete" nzTheme="outline" /></ng-template>
    </div>
  `,
  styles: [
    `
      .fab-drag-anchor {
        position: fixed;
        z-index: 1000;
        right: 32px;
        bottom: 32px;
        cursor: grab;
        user-select: none;
      }
      .fab-drag-anchor:active {
        cursor: grabbing;
      }
      nz-float-button-group {
        position: absolute;
      }
    `
  ]
})
export class FabComponent {
  @Input() actions: FabAction[] = [{ id: 'add', type: 'add', icon: 'plus' }];
  @Output() onAction = new EventEmitter<string>();

  dragX = 0;
  dragY = 0;
  smartPlacement: 'top' | 'bottom' | 'left' | 'right' = 'top';
  private currentX = 0;
  private currentY = 0;

  @ViewChild('upIcon', { static: true }) upIcon!: TemplateRef<any>;
  @ViewChild('downIcon', { static: true }) downIcon!: TemplateRef<any>;
  @ViewChild('leftIcon', { static: true }) leftIcon!: TemplateRef<any>;
  @ViewChild('rightIcon', { static: true }) rightIcon!: TemplateRef<any>;
  @ViewChild('plusIcon', { static: true }) plusIcon!: TemplateRef<any>;
  @ViewChild('editIcon', { static: true }) editIcon!: TemplateRef<any>;
  @ViewChild('deleteIcon', { static: true }) deleteIcon!: TemplateRef<any>;

  get currentIcon(): TemplateRef<any> {
    const iconMap = {
      top: this.upIcon,
      bottom: this.downIcon,
      left: this.leftIcon,
      right: this.rightIcon
    };
    return iconMap[this.smartPlacement];
  }

  getActionIcon(iconName: string): TemplateRef<any> {
    const iconMap: Record<string, TemplateRef<any>> = {
      plus: this.plusIcon,
      edit: this.editIcon,
      delete: this.deleteIcon
    };
    return iconMap[iconName] || this.plusIcon;
  }

  onDragMove(event: any): void {
    const rect = event.source.element.nativeElement.getBoundingClientRect();
    this.currentX = rect.left;
    this.currentY = rect.top;
    this.smartPlacement = this.calculateSmartPlacement(this.currentX, this.currentY);
  }

  onDragEnd(event: any): void {
    this.dragX = event.source.getFreeDragPosition().x;
    this.dragY = event.source.getFreeDragPosition().y;
    this.smartPlacement = this.calculateSmartPlacement(this.currentX, this.currentY);
  }

  private calculateSmartPlacement(x: number, y: number): 'top' | 'bottom' | 'left' | 'right' {
    const fabSize = 56;
    const centerX = x + fabSize / 2;
    const centerY = y + fabSize / 2;
    const deltaX = centerX - window.innerWidth / 2;
    const deltaY = centerY - window.innerHeight / 2;
    return Math.abs(deltaX) > Math.abs(deltaY) ? (deltaX > 0 ? 'left' : 'right') : deltaY > 0 ? 'top' : 'bottom';
  }
}
