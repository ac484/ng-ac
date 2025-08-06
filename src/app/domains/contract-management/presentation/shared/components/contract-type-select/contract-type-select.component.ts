import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ContractType } from '../../../../domain/entities/contract.entity';

@Component({
  selector: 'app-contract-type-select',
  standalone: true,
  imports: [CommonModule, FormsModule, NzSelectModule],
  template: `
    <nz-select
      [ngModel]="value"
      (ngModelChange)="onChange($event)"
      [nzPlaceHolder]="placeholder"
      [nzAllowClear]="allowClear">
      <nz-option
        *ngFor="let type of contractTypes"
        [nzValue]="type.value"
        [nzLabel]="type.label">
      </nz-option>
    </nz-select>
  `
})
export class ContractTypeSelectComponent {
  @Input() value?: ContractType;
  @Input() placeholder = '請選擇合約類型';
  @Input() allowClear = true;
  @Output() valueChange = new EventEmitter<ContractType>();

  contractTypes = [
    { value: ContractType.SERVICE, label: '服務合約' },
    { value: ContractType.PRODUCT, label: '產品合約' },
    { value: ContractType.LICENSING, label: '授權合約' },
    { value: ContractType.PARTNERSHIP, label: '合作合約' },
    { value: ContractType.EMPLOYMENT, label: '僱傭合約' }
  ];

  onChange(value: ContractType): void {
    this.valueChange.emit(value);
  }
}
