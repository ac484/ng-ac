import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { ContractType } from '../../../../domain/entities/contract.entity';

@Component({
  selector: 'app-contract-type-select',
  standalone: true,
  imports: [CommonModule, FormsModule, NzSelectModule],
  template: `
    <nz-select [ngModel]="value" (ngModelChange)="onChange($event)" [nzPlaceHolder]="placeholder" [nzAllowClear]="allowClear">
      <nz-option *ngFor="let type of contractTypes" [nzValue]="type.value" [nzLabel]="type.label"> </nz-option>
    </nz-select>
  `
})
export class ContractTypeSelectComponent {
  @Input() value?: ContractType;
  @Input() placeholder = '請選擇合約類型';
  @Input() allowClear = true;
  @Output() readonly valueChange = new EventEmitter<ContractType>();

  contractTypes = [
    { value: ContractType.PURE_LABOR, label: '純工' },
    { value: ContractType.MATERIAL_INCLUDED, label: '帶料' },
    { value: ContractType.SUBCONTRACT, label: '分包' },
    { value: ContractType.OUTSOURCING, label: '外包' }
  ];

  onChange(value: ContractType): void {
    this.valueChange.emit(value);
  }
}
