import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, map, catchError, finalize, of } from 'rxjs';

import { CreateCompanyDto, UpdateCompanyDto, CompanyResponseDto, ContactDto } from '../dto/company.dto';
import { CreateCompanyUseCase } from '../use-cases/create-company.use-case';
import { DeleteCompanyUseCase } from '../use-cases/delete-company.use-case';
import { GetCompaniesUseCase } from '../use-cases/get-companies.use-case';
import { UpdateCompanyContactUseCase } from '../use-cases/update-company-contact.use-case';
import { UpdateCompanyUseCase } from '../use-cases/update-company.use-case';

/**
 * 公司應用服務
 * 極簡設計，使用 Angular Signals 進行狀態管理
 * 作為用例的 Facade，提供統一的 API
 */
@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private readonly createCompanyUseCase = inject(CreateCompanyUseCase);
  private readonly updateCompanyUseCase = inject(UpdateCompanyUseCase);
  private readonly deleteCompanyUseCase = inject(DeleteCompanyUseCase);
  private readonly getCompaniesUseCase = inject(GetCompaniesUseCase);
  private readonly updateCompanyContactUseCase = inject(UpdateCompanyContactUseCase);

  // Signals 狀態管理
  private readonly companiesSignal = signal<CompanyResponseDto[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  // Computed 派生狀態
  readonly companies = computed(() => this.companiesSignal());
  readonly loading = computed(() => this.loadingSignal());
  readonly error = computed(() => this.errorSignal());
  readonly hasCompanies = computed(() => this.companies().length > 0);

  constructor() {
    // 自動載入初始數據
    this.loadCompanies();
  }

  /**
   * 載入公司列表
   */
  loadCompanies(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.getCompaniesUseCase
      .execute()
      .pipe(
        finalize(() => this.loadingSignal.set(false)),
        catchError(error => {
          console.error('載入公司列表失敗:', error);
          this.errorSignal.set('載入公司列表失敗');
          return of([]);
        })
      )
      .subscribe(companies => {
        this.companiesSignal.set(companies);
      });
  }

  /**
   * 創建公司
   */
  createCompany(dto: CreateCompanyDto): Observable<CompanyResponseDto> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.createCompanyUseCase.execute(dto).pipe(
      map(company => {
        // 更新本地狀態
        const currentCompanies = this.companiesSignal();
        this.companiesSignal.set([...currentCompanies, company]);
        return company;
      }),
      finalize(() => this.loadingSignal.set(false)),
      catchError(error => {
        console.error('創建公司失敗:', error);
        this.errorSignal.set('創建公司失敗');
        throw error;
      })
    );
  }

  /**
   * 搜尋公司
   */
  searchCompanies(query: string): Observable<CompanyResponseDto[]> {
    if (!query.trim()) {
      return of(this.companies());
    }

    const filteredCompanies = this.companies().filter(
      company => company.companyName.toLowerCase().includes(query.toLowerCase()) || company.businessRegistrationNumber.includes(query)
    );

    return of(filteredCompanies);
  }

  /**
   * 清除錯誤
   */
  clearError(): void {
    this.errorSignal.set(null);
  }

  /**
   * 重新載入
   */
  refresh(): void {
    this.loadCompanies();
  }

  /**
   * 更新公司
   */
  updateCompany(id: string, dto: UpdateCompanyDto): Observable<CompanyResponseDto> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.updateCompanyUseCase.execute(id, dto).pipe(
      map(updatedCompany => {
        // 更新本地狀態
        const currentCompanies = this.companiesSignal();
        const updatedCompanies = currentCompanies.map(company => (company.id === id ? updatedCompany : company));
        this.companiesSignal.set(updatedCompanies);
        return updatedCompany;
      }),
      finalize(() => this.loadingSignal.set(false)),
      catchError(error => {
        console.error('更新公司失敗:', error);
        this.errorSignal.set('更新公司失敗');
        throw error;
      })
    );
  }

  /**
   * 刪除公司
   */
  deleteCompany(id: string): Observable<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.deleteCompanyUseCase.execute(id).pipe(
      map(() => {
        // 更新本地狀態
        const currentCompanies = this.companiesSignal();
        const filteredCompanies = currentCompanies.filter(company => company.id !== id);
        this.companiesSignal.set(filteredCompanies);
      }),
      finalize(() => this.loadingSignal.set(false)),
      catchError(error => {
        console.error('刪除公司失敗:', error);
        this.errorSignal.set('刪除公司失敗');
        throw error;
      })
    );
  }

  /**
   * 更新公司列表（用於本地狀態更新）
   */
  updateCompanies(companies: CompanyResponseDto[]): void {
    this.companiesSignal.set(companies);
  }

  /**
   * 新增聯絡人
   */
  addContact(companyId: string, contact: ContactDto): Observable<CompanyResponseDto> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.updateCompanyContactUseCase.addContact(companyId, contact).pipe(
      map(updatedCompany => {
        // 更新本地狀態
        const currentCompanies = this.companiesSignal();
        const updatedCompanies = currentCompanies.map(company => (company.id === companyId ? updatedCompany : company));
        this.companiesSignal.set(updatedCompanies);
        return updatedCompany;
      }),
      finalize(() => this.loadingSignal.set(false)),
      catchError(error => {
        console.error('新增聯絡人失敗:', error);
        this.errorSignal.set('新增聯絡人失敗');
        throw error;
      })
    );
  }

  /**
   * 更新聯絡人
   */
  updateContact(companyId: string, contactIndex: number, contact: ContactDto): Observable<CompanyResponseDto> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.updateCompanyContactUseCase.updateContact(companyId, contactIndex, contact).pipe(
      map(updatedCompany => {
        // 更新本地狀態
        const currentCompanies = this.companiesSignal();
        const updatedCompanies = currentCompanies.map(company => (company.id === companyId ? updatedCompany : company));
        this.companiesSignal.set(updatedCompanies);
        return updatedCompany;
      }),
      finalize(() => this.loadingSignal.set(false)),
      catchError(error => {
        console.error('更新聯絡人失敗:', error);
        this.errorSignal.set('更新聯絡人失敗');
        throw error;
      })
    );
  }

  /**
   * 刪除聯絡人
   */
  removeContact(companyId: string, contactIndex: number): Observable<CompanyResponseDto> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.updateCompanyContactUseCase.removeContact(companyId, contactIndex).pipe(
      map(updatedCompany => {
        // 更新本地狀態
        const currentCompanies = this.companiesSignal();
        const updatedCompanies = currentCompanies.map(company => (company.id === companyId ? updatedCompany : company));
        this.companiesSignal.set(updatedCompanies);
        return updatedCompany;
      }),
      finalize(() => this.loadingSignal.set(false)),
      catchError(error => {
        console.error('刪除聯絡人失敗:', error);
        this.errorSignal.set('刪除聯絡人失敗');
        throw error;
      })
    );
  }
}
