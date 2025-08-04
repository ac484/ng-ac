import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalRef, NZ_MODAL_DATA, NzModalModule } from 'ng-zorro-antd/modal';

import { PrincipalApplicationService } from '../../../application/services/principal-application.service';
import { Contact } from '../../../domain/entities/contact.entity';

@Component({
  selector: 'app-principal-contact',
  templateUrl: './principal-contact.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzFormModule, NzInputModule, NzButtonModule, NzModalModule]
})
export class PrincipalContactComponent implements OnInit {
  contactFormGroup!: FormGroup;
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
    if (this.data.mode === 'edit' && this.data.contact) {
      this.contactFormGroup.patchValue({
        name: this.data.contact.name.getValue(),
        email: this.data.contact.email.getValue(),
        phone: this.data.contact.phone.getValue()
      });
    }
  }

  private initForm(): void {
    this.contactFormGroup = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      phone: ['', [Validators.required, Validators.maxLength(20)]]
    });
  }

  submitForm(): Promise<boolean> {
    return new Promise(resolve => {
      if (this.contactFormGroup.valid) {
        this.loading = true;
        const formValue = this.contactFormGroup.value;

        if (this.data.mode === 'add') {
          this.principalService
            .createContact({
              principalId: this.data.principalId,
              name: formValue.name,
              email: formValue.email,
              phone: formValue.phone
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
            .updateContact({
              principalId: this.data.principalId,
              contactId: this.data.contact.id,
              name: formValue.name,
              email: formValue.email,
              phone: formValue.phone
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
        Object.values(this.contactFormGroup.controls).forEach(control => {
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
