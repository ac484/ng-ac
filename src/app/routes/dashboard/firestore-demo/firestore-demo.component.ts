/**
 * Firestore 服務使用範例 - 工業應用簡化版
 * 
 * 展示如何使用 Firestore 服務進行 CRUD 操作
 */

import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { 
  UserService, 
  ContractService,
  User,
  Contract
} from '../../../core/services';
import { PageHeaderType, PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-firestore-demo',
  templateUrl: './firestore-demo.component.html',
  styleUrls: ['./firestore-demo.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    NzCardModule,
    NzTabsModule,
    NzFormModule,
    ReactiveFormsModule,
    FormsModule,
    NzGridModule,
    NzInputModule,
    NzInputNumberModule,
    NzSelectModule,
    NzButtonModule,
    NzSpinModule,
    NzListModule,
    NzTagModule
  ]
})
export class FirestoreDemoComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Firestore 服務範例',
    desc: '展示如何使用 Firestore 服務進行用戶和合約管理',
    breadcrumb: ['首頁', '儀表板', 'Firestore 範例']
  };

  // 表單
  userForm!: FormGroup;
  contractForm!: FormGroup;

  // 數據
  users: User[] = [];
  contracts: Contract[] = [];

  // 載入狀態
  loading = {
    users: false,
    contracts: false
  };

  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private message = inject(NzMessageService);
  private userService = inject(UserService);
  private contractService = inject(ContractService);

  ngOnInit(): void {
    this.initForms();
    this.loadAllData();
  }

  private initForms(): void {
    // 用戶表單
    this.userForm = this.fb.group({
      uid: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', [Validators.required]],
      phoneNumber: [''],
      department: [''],
      position: [''],
      employeeId: [''],
      isActive: [true]
    });

    // 合約表單
    this.contractForm = this.fb.group({
      contractCode: ['', [Validators.required]],
      clientName: ['', [Validators.required]],
      projectManager: ['', [Validators.required]], // 改為 projectManager
      contractName: ['', [Validators.required]],
      totalAmount: [null, [Validators.required, Validators.min(0)]], // 改為 totalAmount
      status: ['active', [Validators.required]],
      description: ['']
    });
  }

  private loadAllData(): void {
    this.loadUsers();
    this.loadContracts();
  }

  // 用戶操作
  loadUsers(): void {
    this.loading.users = true;
    this.userService.getActiveUsers([], [], 10).subscribe({
      next: (users: User[]) => {
        this.users = users;
        this.loading.users = false;
        this.cdr.markForCheck();
      },
      error: (error: any) => {
        console.error('載入用戶失敗:', error);
        this.message.error('載入用戶失敗');
        this.loading.users = false;
        this.cdr.markForCheck();
      }
    });
  }

  createUser(): void {
    if (this.userForm.valid) {
      const userData = {
        ...this.userForm.value,
        emailVerified: false,
        lastLoginAt: new Date(),
        roles: ['user']
      };

      this.userService.replace(userData.uid, userData).subscribe({
        next: () => {
          this.message.success('用戶創建成功');
          this.userForm.reset();
          this.loadUsers();
        },
        error: (error: any) => {
          console.error('創建用戶失敗:', error);
          this.message.error('創建用戶失敗');
        }
      });
    }
  }

  // 合約操作
  loadContracts(): void {
    this.loading.contracts = true;
    this.contractService.findAll([], [], 10).subscribe({
      next: (contracts: Contract[]) => {
        this.contracts = contracts;
        this.loading.contracts = false;
        this.cdr.markForCheck();
      },
      error: (error: any) => {
        console.error('載入合約失敗:', error);
        this.message.error('載入合約失敗');
        this.loading.contracts = false;
        this.cdr.markForCheck();
      }
    });
  }

  createContract(): void {
    if (this.contractForm.valid) {
      const contractData = {
        ...this.contractForm.value,
        contractCode: this.contractService.generateContractCode()
      };

      this.contractService.create(contractData).subscribe({
        next: () => {
          this.message.success('合約創建成功');
          this.contractForm.reset({
            status: 'active'
          });
          this.loadContracts();
        },
        error: (error: any) => {
          console.error('創建合約失敗:', error);
          this.message.error('創建合約失敗');
        }
      });
    }
  }

  updateContractProgress(contractId: string, progress: number): void {
    this.contractService.update(contractId, {
      progress,
      status: progress >= 100 ? 'completed' : 'active'
    }).subscribe({
      next: () => {
        this.message.success('合約進度更新成功');
        this.loadContracts();
      },
      error: (error: any) => {
        console.error('更新合約進度失敗:', error);
        this.message.error('更新合約進度失敗');
      }
    });
  }

  // 工具方法
  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'draft': 'default',
      'preparing': 'processing',
      'active': 'processing',
      'completed': 'success'
    };
    return colors[status] || 'default';
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'draft': '草稿',
      'preparing': '籌備中',
      'active': '進行中',
      'completed': '已完成'
    };
    return statusMap[status] || status;
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(amount);
  }

  formatDate(date: any): string {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('zh-TW');
  }
}