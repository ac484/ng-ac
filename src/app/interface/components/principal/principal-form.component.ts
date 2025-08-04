import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalRef, NZ_MODAL_DATA, NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { PrincipalApplicationService } from '../../../application/services/principal-application.service';
import { Principal } from '../../../domain/entities/principal.entity';

@Component({
  selector: 'app-principal-form',
  templateUrl: './principal-form.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzCardModule, NzFormModule, NzInputModule, NzButtonModule, NzModalModule, NzSelectModule]
})
export class PrincipalFormComponent implements OnInit {
  principalFormGroup!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private principalService: PrincipalApplicationService,
    private modalRef: NzModalRef,
    @Inject(NZ_MODAL_DATA) public data: any
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    if (this.data.mode === 'edit' && this.data.principal) {
      this.principalFormGroup.patchValue({
        name: this.data.principal.name.getValue(),
        status: this.data.principal.status,
        description: this.data.principal.description || ''
      });
    }
  }

  private initForm(): void {
    this.principalFormGroup = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      status: ['active', [Validators.required]],
      description: ['', [Validators.maxLength(500)]]
    });
  }

  submitForm(): Promise<boolean> {
    return new Promise(resolve => {
      if (this.principalFormGroup.valid) {
        this.loading = true;
        const formValue = this.principalFormGroup.value;

        if (this.data.mode === 'add') {
          this.principalService
            .createPrincipal({
              name: formValue.name,
              status: formValue.status,
              description: formValue.description
            })
            .subscribe({
              next: () => {
                this.loading = false;
                this.modalRef.close(true);
                resolve(true);
              },
              error: () => {
                this.loading = false;
                resolve(false);
              }
            });
        } else if (this.data.mode === 'edit') {
          this.principalService
            .updatePrincipal({
              id: this.data.principal.id.getValue(),
              name: formValue.name,
              status: formValue.status,
              description: formValue.description
            })
            .subscribe({
              next: () => {
                this.loading = false;
                this.modalRef.close(true);
                resolve(true);
              },
              error: () => {
                this.loading = false;
                resolve(false);
              }
            });
        }
      } else {
        Object.values(this.principalFormGroup.controls).forEach(control => {
          if (control.invalid) {
            control.markAsTouched();
            control.updateValueAndValidity();
          }
        });
        resolve(false);
      }
    });
  }

  handleCancel(): void {
    this.modalRef.close();
  }
}
