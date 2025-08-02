import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService, Client } from '../../../core/services/firestore/client.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzGridModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzTableModule
  ],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.less']
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  addForm: FormGroup;
  loading = false;
  editing = false;
  editingClientId: string | null = null;
  statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' }
  ];

  constructor(private fb: FormBuilder, private clientService: ClientService) {
    this.addForm = this.fb.group({
      clientCode: [{ value: this.clientService.generateClientCode(), disabled: true }],
      clientName: ['', Validators.required],
      contactPerson: [''],
      phoneNumber: [''],
      email: ['', [Validators.email]],
      address: [''],
      industry: [''],
      companySize: [''],
      status: ['active', Validators.required],
      notes: [''],
      lastContactDate: [null]
    });
  }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading = true;
    this.clientService.findAll().subscribe((data: Client[]) => {
      this.clients = data;
      this.loading = false;
    });
  }

  onSubmit(): void {
    if (this.addForm.invalid) {
      Object.values(this.addForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      return;
    }
    const formValue = this.addForm.getRawValue();
    if (this.editing && this.editingClientId) {
      this.clientService.update(this.editingClientId, formValue).subscribe(() => {
        this.resetForm();
        this.loadClients();
      });
    } else {
      this.clientService.create(formValue).subscribe(() => {
        this.resetForm();
        this.loadClients();
      });
    }
  }

  onEdit(client: Client): void {
    this.editing = true;
    this.editingClientId = client.id || null;
    this.addForm.patchValue({
      clientCode: client.clientCode,
      clientName: client.clientName,
      contactPerson: client.contactPerson,
      phoneNumber: client.phoneNumber,
      email: client.email,
      address: client.address,
      industry: client.industry,
      companySize: client.companySize,
      status: client.status,
      notes: client.notes,
      lastContactDate: client.lastContactDate || null
    });
  }

  onDelete(id: string): void {
    this.clientService.delete(id).subscribe(() => this.loadClients());
  }

  onCancel(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.editing = false;
    this.editingClientId = null;
    this.addForm.reset({
      clientCode: this.clientService.generateClientCode(),
      clientName: '',
      contactPerson: '',
      phoneNumber: '',
      email: '',
      address: '',
      industry: '',
      companySize: '',
      status: 'active',
      notes: '',
      lastContactDate: null
    });
  }
}
