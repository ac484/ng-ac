import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactApplicationService } from '../../../application/services/contact.application.service';
import { CreateContactDto, UpdateContactDto } from '../../../application/dto/contact.dto';

@Component({
    selector: 'app-contact-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="contact-form-container">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">{{ isEditMode ? 'Edit' : 'Add New' }} Contact</h5>
          
          <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
            <div class="form-group mb-3">
              <label for="firstName">First Name *</label>
              <input 
                type="text" 
                class="form-control" 
                id="firstName"
                placeholder="Enter First Name" 
                formControlName="firstName"
                [class.is-invalid]="isFieldInvalid('firstName')">
              <div class="invalid-feedback" *ngIf="isFieldInvalid('firstName')">
                <div *ngIf="contactForm.get('firstName')?.errors?.['required']">First Name is required.</div>
                <div *ngIf="contactForm.get('firstName')?.errors?.['minlength']">First Name must be at least 2 characters long.</div>
              </div>
            </div>

            <div class="form-group mb-3">
              <label for="lastName">Last Name *</label>
              <input 
                type="text" 
                class="form-control" 
                id="lastName"
                placeholder="Enter Last Name" 
                formControlName="lastName"
                [class.is-invalid]="isFieldInvalid('lastName')">
              <div class="invalid-feedback" *ngIf="isFieldInvalid('lastName')">
                <div *ngIf="contactForm.get('lastName')?.errors?.['required']">Last Name is required.</div>
                <div *ngIf="contactForm.get('lastName')?.errors?.['minlength']">Last Name must be at least 2 characters long.</div>
              </div>
            </div>

            <div class="form-group mb-3">
              <label for="email">Email *</label>
              <input 
                type="email" 
                class="form-control" 
                id="email"
                placeholder="Enter Email" 
                formControlName="email"
                [class.is-invalid]="isFieldInvalid('email')">
              <div class="invalid-feedback" *ngIf="isFieldInvalid('email')">
                <div *ngIf="contactForm.get('email')?.errors?.['required']">Email is required.</div>
                <div *ngIf="contactForm.get('email')?.errors?.['email']">Email is invalid.</div>
              </div>
            </div>

            <div class="form-group mb-3">
              <label for="phone">Phone *</label>
              <input 
                type="tel" 
                class="form-control" 
                id="phone"
                placeholder="Enter Phone" 
                formControlName="phone"
                [class.is-invalid]="isFieldInvalid('phone')">
              <div class="invalid-feedback" *ngIf="isFieldInvalid('phone')">
                <div *ngIf="contactForm.get('phone')?.errors?.['required']">Phone number is required.</div>
                <div *ngIf="contactForm.get('phone')?.errors?.['minlength']">Phone number must be at least 8 characters long.</div>
                <div *ngIf="contactForm.get('phone')?.errors?.['pattern']">Phone number is invalid.</div>
              </div>
            </div>

            <div class="form-check mb-3">
              <input 
                type="checkbox" 
                class="form-check-input" 
                id="status" 
                formControlName="status">
              <label class="form-check-label" for="status">Active Contact</label>
            </div>

            <hr>

            <div class="d-grid gap-2">
              <button 
                type="submit" 
                class="btn btn-success" 
                [disabled]="!contactForm.valid || isSubmitting">
                {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Update' : 'Add') }}
              </button>
              <button type="button" class="btn btn-secondary" (click)="cancel()">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .contact-form-container {
      padding: 16px;
    }
    
    .form-group label {
      font-weight: 500;
      margin-bottom: 8px;
    }
    
    .d-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
    }
    
    @media (min-width: 768px) {
      .d-grid {
        grid-template-columns: 1fr 1fr;
      }
    }
  `]
})
export class ContactFormComponent implements OnInit {
    contactForm: FormGroup;
    isEditMode: boolean = false;
    isSubmitting: boolean = false;
    contactId: string | null = null;

    constructor(
        private fb: FormBuilder,
        private contactApplicationService: ContactApplicationService
    ) {
        this.contactForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(2)]],
            lastName: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^[-+\s/0-9]*$/)]],
            status: [true]
        });
    }

    ngOnInit(): void {
        // Check if we're in edit mode (would typically get from route params)
        // For now, we'll assume we're in add mode
        this.isEditMode = false;
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.contactForm.get(fieldName);
        return field ? field.invalid && (field.dirty || field.touched) : false;
    }

    onSubmit(): void {
        if (this.contactForm.valid) {
            this.isSubmitting = true;

            const formData = this.contactForm.value;

            if (this.isEditMode && this.contactId) {
                const updateDto: UpdateContactDto = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    status: formData.status
                };

                this.contactApplicationService.updateContact(this.contactId, updateDto).subscribe({
                    next: () => {
                        console.log('Contact updated successfully');
                        this.isSubmitting = false;
                        this.cancel();
                    },
                    error: (error) => {
                        console.error('Error updating contact:', error);
                        this.isSubmitting = false;
                    }
                });
            } else {
                const createDto: CreateContactDto = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    status: formData.status
                };

                this.contactApplicationService.createContact(createDto).subscribe({
                    next: () => {
                        console.log('Contact created successfully');
                        this.isSubmitting = false;
                        this.cancel();
                    },
                    error: (error) => {
                        console.error('Error creating contact:', error);
                        this.isSubmitting = false;
                    }
                });
            }
        }
    }

    cancel(): void {
        // This would typically navigate back or reset the form
        console.log('Form cancelled');
    }
}

