import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, map, switchMap, catchError, finalize, shareReplay, of } from 'rxjs';
import { Company } from '../../domain/entities/company.entity';
import { COMPANY_REPOSITORY, CompanyRepository } from '../../domain/repositories/company.repository.interface';
import { CreateCompanyDto, UpdateCompanyDto, CompanyResponseDto } from '../dto/create-company.dto';
import { CompanyStatus } from '../../domain/value-objects/company-status.vo';
import { RiskLevel } from '../../domain/value-objects/risk-level.vo';
import { Contact, ContactProps } from '../../domain/entities/contact.entity';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
    providedIn: 'root'
})
export class CompanyApplicationService {
    private readonly companyRepository = inject(COMPANY_REPOSITORY);

    // 使用 Signals 進行狀態管理
    private readonly companiesSignal = signal<CompanyResponseDto[]>([]);
    private readonly loadingSignal = signal(false);
    private readonly errorSignal = signal<string | null>(null);

    // 使用 computed 進行派生狀態
    readonly companies = computed(() => this.companiesSignal());
    readonly loading = computed(() => this.loadingSignal());
    readonly error = computed(() => this.errorSignal());

    constructor() {
        // 在服務初始化時自動載入數據
        this.loadInitialData();
    }

    private loadInitialData(): void {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);

        this.companyRepository.getAll().pipe(
            map(companies => companies.map(company => this.toResponseDto(company))),
            finalize(() => {
                this.loadingSignal.set(false);
                console.log('Initial data loading completed');
            }),
            catchError(error => {
                console.error('Load initial data error:', error);
                this.errorSignal.set('無法載入合作夥伴清單');
                this.loadingSignal.set(false);
                // 返回空數組而不是提前結束 Observable
                return of([]);
            })
        ).subscribe({
            next: (companies) => {
                console.log('Initial data loaded:', companies.length, 'companies');
                this.companiesSignal.set(companies);
            },
            error: (error) => {
                console.error('Load initial data error:', error);
                this.errorSignal.set('無法載入合作夥伴清單');
                this.loadingSignal.set(false);
                this.companiesSignal.set([]);
            }
        });
    }

    getAllCompanies(): Observable<CompanyResponseDto[]> {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);

        return this.companyRepository.getAll().pipe(
            map(companies => companies.map(company => this.toResponseDto(company))),
            finalize(() => this.loadingSignal.set(false)),
            catchError(error => {
                this.errorSignal.set('無法載入合作夥伴清單');
                throw error;
            })
        );
    }

    getCompanyById(id: string): Observable<CompanyResponseDto | null> {
        return this.companyRepository.getById(id).pipe(
            map(company => company ? this.toResponseDto(company) : null),
            catchError(error => {
                this.errorSignal.set('無法載入公司詳細資料');
                throw error;
            })
        );
    }

    createCompany(dto: CreateCompanyDto): Observable<CompanyResponseDto> {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);

        try {
            // 確保聯絡人數據正確格式化，處理可能為空的情況
            const contacts = (dto.contacts || []).map(contact => ({
                name: contact.name || '',
                title: contact.title || '',
                email: contact.email || '',
                phone: contact.phone || '',
                isPrimary: contact.isPrimary || false
            }));

            const company = Company.create({
                ...dto,
                status: CompanyStatus.create(dto.status),
                riskLevel: RiskLevel.create(dto.riskLevel),
                contacts: contacts.map(c => Contact.create(c))
            });

            return this.companyRepository.create(company).pipe(
                map(createdCompany => this.toResponseDto(createdCompany)),
                finalize(() => this.loadingSignal.set(false)),
                catchError(error => {
                    console.error('Create company error:', error);
                    this.errorSignal.set('新增合作夥伴失敗');
                    throw error;
                })
            );
        } catch (error) {
            console.error('Error creating company:', error);
            this.loadingSignal.set(false);
            this.errorSignal.set('新增合作夥伴失敗');
            throw error;
        }
    }

    updateCompany(id: string, dto: UpdateCompanyDto): Observable<CompanyResponseDto> {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);

        return this.companyRepository.getById(id).pipe(
            switchMap(company => {
                if (!company) {
                    throw new Error('Company not found');
                }

                // 使用最現代化的不可變更新方式
                // 創建新的 Company 實例而不是修改現有實例
                let updatedCompany = company;

                // 更新狀態
                if (dto.status) {
                    updatedCompany = updatedCompany.updateStatus(CompanyStatus.create(dto.status));
                }

                // 更新風險等級
                if (dto.riskLevel) {
                    updatedCompany = updatedCompany.updateRiskLevel(RiskLevel.create(dto.riskLevel));
                }

                // 如果需要更新聯絡人，使用 addContact 方法逐步添加
                if (dto.contacts !== undefined) {
                    // 先清除所有現有聯絡人
                    for (let i = updatedCompany.contacts.length - 1; i >= 0; i--) {
                        updatedCompany = updatedCompany.removeContact(i);
                    }

                    // 添加新的聯絡人
                    const newContacts = dto.contacts.map(c => Contact.create(c));
                    newContacts.forEach(contact => {
                        updatedCompany = updatedCompany.addContact(contact);
                    });
                }

                return this.companyRepository.update(id, updatedCompany);
            }),
            map(updatedCompany => this.toResponseDto(updatedCompany)),
            finalize(() => this.loadingSignal.set(false)),
            catchError(error => {
                this.errorSignal.set('更新合作夥伴失敗');
                throw error;
            })
        );
    }

    deleteCompany(id: string): Observable<void> {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);

        return this.companyRepository.delete(id).pipe(
            finalize(() => this.loadingSignal.set(false)),
            catchError(error => {
                this.errorSignal.set('刪除合作夥伴失敗');
                throw error;
            })
        );
    }

    searchCompanies(query: string): Observable<CompanyResponseDto[]> {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);

        return this.companyRepository.search(query).pipe(
            map(companies => companies.map(company => this.toResponseDto(company))),
            finalize(() => this.loadingSignal.set(false)),
            catchError(error => {
                this.errorSignal.set('搜尋失敗');
                throw error;
            })
        );
    }

    // 清除錯誤狀態
    clearError(): void {
        this.errorSignal.set(null);
    }

    // 重新載入資料
    refreshCompanies(): void {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);

        this.companyRepository.getAll().pipe(
            map(companies => companies.map(company => this.toResponseDto(company))),
            finalize(() => {
                this.loadingSignal.set(false);
                console.log('Refresh data loading completed');
            }),
            catchError(error => {
                console.error('Refresh companies error:', error);
                this.errorSignal.set('無法載入合作夥伴清單');
                this.loadingSignal.set(false);
                return of([]);
            })
        ).subscribe({
            next: (companies) => {
                console.log('Refresh data loaded:', companies.length, 'companies');
                this.companiesSignal.set(companies);
            },
            error: (error) => {
                console.error('Refresh companies error:', error);
                this.errorSignal.set('無法載入合作夥伴清單');
                this.loadingSignal.set(false);
                this.companiesSignal.set([]);
            }
        });
    }

    private toResponseDto(company: Company): CompanyResponseDto {
        // 使用最現代化的方式處理不可變性
        // 將 readonly Contact[] 轉換為 readonly ContactProps[]
        const contactProps: readonly ContactProps[] = company.contacts.map(contact => ({
            name: contact.name,
            title: contact.title,
            email: contact.email,
            phone: contact.phone,
            isPrimary: contact.isPrimary
        }));

        return {
            id: company.companyId.value,
            companyName: company.companyName,
            businessRegistrationNumber: company.businessRegistrationNumber,
            status: company.status.value,
            address: company.address,
            businessPhone: company.businessPhone,
            fax: company.fax,
            website: company.website,
            contractCount: company.contractCount,
            latestContractDate: company.latestContractDate?.toISOString() ?? null,
            partnerSince: company.partnerSince.toISOString(),
            cooperationScope: company.cooperationScope,
            businessModel: company.businessModel,
            creditScore: company.creditScore,
            riskLevel: company.riskLevel.value,
            reviewHistory: company.reviewHistory,
            blacklistReason: company.blacklistReason,
            contacts: contactProps,
            createdAt: company.createdAt.toISOString(),
            updatedAt: company.updatedAt.toISOString()
        } as const;
    }
}
