import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { UserResponse } from 'src/app/domain/user/application/dto/responses/user.response';

@Component({
  selector: 'app-user-form',
  template: `
    <form nz-form [formGroup]="userForm" (ngSubmit)="submitForm()">
      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="email" nzRequired>Email</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="The input is not valid E-mail!">
          <input nz-input formControlName="email" id="email" />
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="displayName" nzRequired>Display Name</nz-form-label>
        <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Please input your display name!">
          <input nz-input formControlName="displayName" id="displayName" />
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-control [nzXs]="{ span: 24, offset: 0 }" [nzSm]="{ span: 14, offset: 6 }">
          <button nz-button nzType="primary" [disabled]="!userForm.valid">Submit</button>
        </nz-form-control>
      </nz-form-item>
    </form>
  `,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule
  ]
})
export class UserFormComponent implements OnInit {
  @Input() user?: UserResponse;
  userForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      email: [this.user?.email, [Validators.email, Validators.required]],
      displayName: [this.user?.displayName, [Validators.required]]
    });
  }

  submitForm(): void {
    // EventEmitter to emit the form value
  }
}
