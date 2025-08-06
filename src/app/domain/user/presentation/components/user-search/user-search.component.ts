import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-user-search',
  template: `
    <nz-input-group nzSearch [nzAddOnAfter]="suffixIconButton">
      <input type="text" nz-input placeholder="input search text" [(ngModel)]="searchTerm" (keyup.enter)="onSearch()"/>
    </nz-input-group>
    <ng-template #suffixIconButton>
      <button nz-button nzType="primary" nzSearch (click)="onSearch()"><i nz-icon nzType="search"></i></button>
    </ng-template>
  `,
  standalone: true,
  imports: [CommonModule, NzInputModule, NzButtonModule, FormsModule, NzIconModule]
})
export class UserSearchComponent {
  @Output() search = new EventEmitter<string>();
  searchTerm = '';

  onSearch(): void {
    this.search.emit(this.searchTerm);
  }
}
