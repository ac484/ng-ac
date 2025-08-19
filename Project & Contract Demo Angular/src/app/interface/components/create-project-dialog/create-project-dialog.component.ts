/**
 * @ai-context {
 *   "role": "Interface/Component",
 *   "purpose": "創建專案對話框-新專案表單",
 *   "constraints": ["表單驗證", "用戶體驗", "數據完整性"],
 *   "dependencies": ["MatDialogModule", "ReactiveFormsModule", "ProjectService"],
 *   "security": "medium",
 *   "lastmod": "2025-08-19"
 * }
 * @usage <app-create-project-dialog></app-create-project-dialog>
 * @see docs/architecture/components.md
 */
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ProjectService } from '@app/application/services/project.service';

@Component({
  selector: 'app-create-project-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>Create New Project</h2>

    <form [formGroup]="projectForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <div class="form-fields">
          <mat-form-field appearance="outline">
            <mat-label>Project Title</mat-label>
            <input matInput formControlName="title" required>
            @if (projectForm.get('title')?.invalid && projectForm.get('title')?.touched) {
              <mat-error>
                @if (projectForm.get('title')?.errors?.['required']) {
                  Title is required
                }
                @if (projectForm.get('title')?.errors?.['minlength']) {
                  Title must be at least 3 characters
                }
              </mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" rows="3" required></textarea>
            @if (projectForm.get('description')?.invalid && projectForm.get('description')?.touched) {
              <mat-error>
                @if (projectForm.get('description')?.errors?.['required']) {
                  Description is required
                }
              </mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Total Value</mat-label>
            <input matInput type="number" formControlName="value" required>
            <span matTextPrefix>$</span>
            @if (projectForm.get('value')?.invalid && projectForm.get('value')?.touched) {
              <mat-error>
                @if (projectForm.get('value')?.errors?.['required']) {
                  Total value is required
                }
                @if (projectForm.get('value')?.errors?.['min']) {
                  Value must be greater than 0
                }
              </mat-error>
            }
          </mat-form-field>

          <div class="date-fields">
            <mat-form-field appearance="outline">
              <mat-label>Start Date</mat-label>
              <input matInput [matDatepicker]="startPicker" formControlName="startDate" required>
              <mat-datepicker-toggle matIconSuffix [for]="startPicker"></mat-datepicker-toggle>
              <mat-datepicker #startPicker></mat-datepicker>
              @if (projectForm.get('startDate')?.invalid && projectForm.get('startDate')?.touched) {
                <mat-error>Start date is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>End Date</mat-label>
              <input matInput [matDatepicker]="endPicker" formControlName="endDate" required>
              <mat-datepicker-toggle matIconSuffix [for]="endPicker"></mat-datepicker-toggle>
              <mat-datepicker #endPicker></mat-datepicker>
              @if (projectForm.get('endDate')?.invalid && projectForm.get('endDate')?.touched) {
                <mat-error>
                  @if (projectForm.get('endDate')?.errors?.['required']) {
                    End date is required
                  }
                  @if (projectForm.get('endDate')?.errors?.['dateRange']) {
                    End date must be after start date
                  }
                </mat-error>
              }
            </mat-form-field>
          </div>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="projectForm.invalid || isSubmitting">
          @if (isSubmitting) {
            <ng-container>
              <mat-icon>hourglass_empty</mat-icon>
              Creating...
            </ng-container>
          } @else {
            <ng-container>
              <mat-icon>add</mat-icon>
              Create Project
            </ng-container>
          }
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .form-fields {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-width: 400px;
    }

    .date-fields {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    mat-dialog-content {
      padding: 1rem 0;
    }

    mat-dialog-actions {
      padding: 1rem 0 0 0;
    }

    @media (max-width: 600px) {
      .form-fields {
        min-width: 300px;
      }

      .date-fields {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CreateProjectDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CreateProjectDialogComponent>);
  private readonly projectService = inject(ProjectService);

  protected isSubmitting = false;

  protected readonly projectForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', Validators.required],
    value: [0, [Validators.required, Validators.min(1)]],
    startDate: [new Date(), Validators.required],
    endDate: [new Date(), Validators.required]
  }, { validators: this.dateRangeValidator });

  private dateRangeValidator(form: any) {
    const startDate = form.get('startDate')?.value;
    const endDate = form.get('endDate')?.value;

    if (startDate && endDate && endDate <= startDate) {
      form.get('endDate')?.setErrors({ dateRange: true });
      return { dateRange: true };
    }

    return null;
  }

  protected async onSubmit(): Promise<void> {
    if (this.projectForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      try {
        const formValue = this.projectForm.value;
        await this.projectService.createProject({
          title: formValue.title!,
          description: formValue.description!,
          value: formValue.value!,
          startDate: formValue.startDate!,
          endDate: formValue.endDate!
        });

        this.dialogRef.close(true);
      } catch (error) {
        console.error('Failed to create project:', error);
        // Handle error (could show a snackbar or error message)
      } finally {
        this.isSubmitting = false;
      }
    }
  }

  protected onCancel(): void {
    this.dialogRef.close(false);
  }
}
