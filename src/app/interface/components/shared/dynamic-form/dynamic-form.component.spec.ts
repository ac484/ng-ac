import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { DynamicFormComponent } from './dynamic-form.component';
import { FormConfig } from './form-field.interface';

describe('DynamicFormComponent', () => {
  let component: DynamicFormComponent;
  let fixture: ComponentFixture<DynamicFormComponent>;

  const mockFormConfig: FormConfig = {
    fields: [
      {
        key: 'name',
        label: '姓名',
        type: 'text',
        required: true,
        placeholder: '請輸入姓名'
      },
      {
        key: 'email',
        label: '電子郵件',
        type: 'email',
        required: true,
        validators: [{ type: 'email', message: '請輸入有效的電子郵件地址' }]
      },
      {
        key: 'age',
        label: '年齡',
        type: 'number',
        attributes: { min: 0, max: 120 }
      },
      {
        key: 'role',
        label: '角色',
        type: 'select',
        options: [
          { label: '管理員', value: 'admin' },
          { label: '用戶', value: 'user' }
        ]
      }
    ],
    layout: 'vertical'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DynamicFormComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        NzFormModule,
        NzInputModule,
        NzSelectModule,
        NzButtonModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicFormComponent);
    component = fixture.componentInstance;
    component.config = mockFormConfig;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with correct controls', () => {
    fixture.detectChanges();

    expect(component.form.get('name')).toBeTruthy();
    expect(component.form.get('email')).toBeTruthy();
    expect(component.form.get('age')).toBeTruthy();
    expect(component.form.get('role')).toBeTruthy();
  });

  it('should set initial values correctly', () => {
    const initialValue = {
      name: 'John Doe',
      email: 'john@example.com',
      age: 30
    };
    component.initialValue = initialValue;
    fixture.detectChanges();

    expect(component.form.get('name')?.value).toBe('John Doe');
    expect(component.form.get('email')?.value).toBe('john@example.com');
    expect(component.form.get('age')?.value).toBe(30);
  });

  it('should validate required fields', () => {
    fixture.detectChanges();

    const nameControl = component.form.get('name');
    const emailControl = component.form.get('email');

    expect(nameControl?.hasError('required')).toBeTruthy();
    expect(emailControl?.hasError('required')).toBeTruthy();
  });

  it('should validate email format', () => {
    fixture.detectChanges();

    const emailControl = component.form.get('email');
    emailControl?.setValue('invalid-email');

    expect(emailControl?.hasError('email')).toBeTruthy();

    emailControl?.setValue('valid@example.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
  });

  it('should emit formSubmit when form is valid and submitted', () => {
    spyOn(component.formSubmit, 'emit');
    fixture.detectChanges();

    // Set valid values
    component.form.patchValue({
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      role: 'user'
    });

    component.onSubmit();

    expect(component.formSubmit.emit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      role: 'user'
    });
  });

  it('should not emit formSubmit when form is invalid', () => {
    spyOn(component.formSubmit, 'emit');
    fixture.detectChanges();

    // Leave required fields empty
    component.onSubmit();

    expect(component.formSubmit.emit).not.toHaveBeenCalled();
  });

  it('should reset form correctly', () => {
    const initialValue = { name: 'John', email: 'john@example.com' };
    component.initialValue = initialValue;
    fixture.detectChanges();

    // Change values
    component.form.patchValue({
      name: 'Jane',
      email: 'jane@example.com'
    });

    // Reset form
    component.onReset();

    expect(component.form.get('name')?.value).toBe('John');
    expect(component.form.get('email')?.value).toBe('john@example.com');
  });

  it('should emit formReset when reset is called', () => {
    spyOn(component.formReset, 'emit');
    fixture.detectChanges();

    component.onReset();

    expect(component.formReset.emit).toHaveBeenCalled();
  });

  it('should emit formCancel when cancel is called', () => {
    spyOn(component.formCancel, 'emit');
    fixture.detectChanges();

    component.onCancel();

    expect(component.formCancel.emit).toHaveBeenCalled();
  });

  it('should filter visible fields correctly', () => {
    const configWithHiddenField: FormConfig = {
      fields: [
        { key: 'visible', label: 'Visible', type: 'text' },
        { key: 'hidden', label: 'Hidden', type: 'text', hidden: true }
      ]
    };

    component.config = configWithHiddenField;
    fixture.detectChanges();

    expect(component.visibleFields.length).toBe(1);
    expect(component.visibleFields[0].key).toBe('visible');
  });

  it('should get form value correctly', () => {
    fixture.detectChanges();

    const testValue = {
      name: 'Test User',
      email: 'test@example.com',
      age: 25,
      role: 'admin'
    };

    component.form.patchValue(testValue);

    expect(component.getFormValue()).toEqual(testValue);
  });

  it('should set form value correctly', () => {
    fixture.detectChanges();

    const testValue = {
      name: 'New User',
      email: 'new@example.com'
    };

    component.setFormValue(testValue);

    expect(component.form.get('name')?.value).toBe('New User');
    expect(component.form.get('email')?.value).toBe('new@example.com');
  });

  it('should reset specific field correctly', () => {
    fixture.detectChanges();

    // Set a value
    component.form.get('name')?.setValue('Test Name');
    expect(component.form.get('name')?.value).toBe('Test Name');

    // Reset the field
    component.resetField('name');
    expect(component.form.get('name')?.value).toBe('');
  });

  it('should set field disabled state correctly', () => {
    fixture.detectChanges();

    const nameControl = component.form.get('name');
    expect(nameControl?.disabled).toBeFalsy();

    component.setFieldDisabled('name', true);
    expect(nameControl?.disabled).toBeTruthy();

    component.setFieldDisabled('name', false);
    expect(nameControl?.disabled).toBeFalsy();
  });

  it('should validate form and mark fields as touched', () => {
    fixture.detectChanges();

    const nameControl = component.form.get('name');
    const emailControl = component.form.get('email');

    expect(nameControl?.touched).toBeFalsy();
    expect(emailControl?.touched).toBeFalsy();

    const isValid = component.validateForm();

    expect(isValid).toBeFalsy();
    expect(nameControl?.touched).toBeTruthy();
    expect(emailControl?.touched).toBeTruthy();
  });

  it('should return correct default span based on layout', () => {
    // Test vertical layout
    component.config = { ...mockFormConfig, layout: 'vertical' };
    expect(component.getDefaultSpan()).toBe(24);

    // Test inline layout
    component.config = { ...mockFormConfig, layout: 'inline' };
    expect(component.getDefaultSpan()).toBe(8);

    // Test horizontal layout
    component.config = { ...mockFormConfig, layout: 'horizontal' };
    expect(component.getDefaultSpan()).toBe(24);
  });

  it('should emit form changes', () => {
    spyOn(component.formChange, 'emit');
    fixture.detectChanges();

    component.form.get('name')?.setValue('Test Name');

    expect(component.formChange.emit).toHaveBeenCalled();
  });

  it('should emit form status changes', () => {
    spyOn(component.formStatusChange, 'emit');
    fixture.detectChanges();

    component.form.get('name')?.setValue('Test Name');

    expect(component.formStatusChange.emit).toHaveBeenCalled();
  });

  it('should get error tip for invalid field', () => {
    fixture.detectChanges();

    const emailControl = component.form.get('email');
    emailControl?.setValue('invalid-email');
    emailControl?.markAsTouched();

    const errorTip = component.getErrorTip('email');
    expect(errorTip).toBeTruthy();
  });

  it('should return empty error tip for valid field', () => {
    fixture.detectChanges();

    const emailControl = component.form.get('email');
    emailControl?.setValue('valid@example.com');
    emailControl?.markAsTouched();

    const errorTip = component.getErrorTip('email');
    expect(errorTip).toBe('');
  });
});
