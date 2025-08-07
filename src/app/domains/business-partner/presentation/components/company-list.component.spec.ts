import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { of } from 'rxjs';

import { CompanyListComponent } from './company-list.component';
import { CompanyApplicationService } from '../../application/services/company.application.service';
import { CompanyResponseDto } from '../../application/dto/create-company.dto';
import { CompanyStatusEnum } from '../../domain/value-objects/company-status.vo';
import { RiskLevelEnum } from '../../domain/value-objects/risk-level.vo';

describe('CompanyListComponent', () => {
    let component: CompanyListComponent;
    let fixture: ComponentFixture<CompanyListComponent>;
    let mockCompanyService: jasmine.SpyObj<CompanyApplicationService>;
    let mockMessageService: jasmine.SpyObj<NzMessageService>;
    let mockModalService: jasmine.SpyObj<NzModalService>;

    const mockCompany: CompanyResponseDto = {
        id: '1',
        companyName: 'Test Company',
        businessRegistrationNumber: '12345678',
        status: CompanyStatusEnum.Active,
        address: 'Test Address',
        businessPhone: '123-456-7890',
        fax: '',
        website: '',
        contractCount: 1,
        latestContractDate: new Date().toISOString(),
        partnerSince: new Date().toISOString(),
        cooperationScope: '',
        businessModel: '',
        creditScore: 85,
        riskLevel: RiskLevelEnum.Low,
        reviewHistory: '',
        blacklistReason: '',
        contacts: [
            {
                name: 'John Doe',
                title: 'Manager',
                email: 'john@test.com',
                phone: '123-456-7890',
                isPrimary: true
            }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    beforeEach(async () => {
        const companyServiceSpy = jasmine.createSpyObj('CompanyApplicationService', [
            'refreshCompanies',
            'searchCompanies',
            'createCompany',
            'updateCompany',
            'deleteCompany'
        ], {
            companies: jasmine.createSpy().and.returnValue([mockCompany]),
            loading: jasmine.createSpy().and.returnValue(false),
            error: jasmine.createSpy().and.returnValue(null)
        });

        const messageServiceSpy = jasmine.createSpyObj('NzMessageService', ['success', 'error', 'info']);
        const modalServiceSpy = jasmine.createSpyObj('NzModalService', ['confirm']);

        await TestBed.configureTestingModule({
            imports: [
                CompanyListComponent,
                ReactiveFormsModule,
                NoopAnimationsModule
            ],
            providers: [
                { provide: CompanyApplicationService, useValue: companyServiceSpy },
                { provide: NzMessageService, useValue: messageServiceSpy },
                { provide: NzModalService, useValue: modalServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CompanyListComponent);
        component = fixture.componentInstance;
        mockCompanyService = TestBed.inject(CompanyApplicationService) as jasmine.SpyObj<CompanyApplicationService>;
        mockMessageService = TestBed.inject(NzMessageService) as jasmine.SpyObj<NzMessageService>;
        mockModalService = TestBed.inject(NzModalService) as jasmine.SpyObj<NzModalService>;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Company Management', () => {
        it('should open edit modal when editCompany is called', () => {
            component.editCompany(mockCompany);
            expect(component.isModalVisible()).toBe(true);
            expect(component.isEditMode()).toBe(true);
        });

        it('should open create modal when showCreateModal is called', () => {
            component.showCreateModal();
            expect(component.isModalVisible()).toBe(true);
            expect(component.isEditMode()).toBe(false);
        });

        it('should close modal when handleCancel is called', () => {
            component.showCreateModal();
            expect(component.isModalVisible()).toBe(true);

            component.handleCancel();
            expect(component.isModalVisible()).toBe(false);
        });
    });

    describe('Inline Contact Management', () => {
        beforeEach(() => {
            // Expand the company row to show contacts
            component.onExpandChange(mockCompany.id, true);
        });

        it('should add new contact when addInlineContact is called', () => {
            component.addInlineContact(mockCompany.id);
            expect(component.editingContactIndex()).toBe(-2);
            expect(component.currentEditingCompanyId()).toBe(mockCompany.id);
        });

        it('should edit contact when editInlineContact is called', () => {
            component.editInlineContact(mockCompany.id, 0, mockCompany.contacts[0]);
            expect(component.editingContactIndex()).toBe(0);
            expect(component.currentEditingCompanyId()).toBe(mockCompany.id);
        });

        it('should cancel inline edit when cancelInlineEdit is called', () => {
            component.editInlineContact(mockCompany.id, 0, mockCompany.contacts[0]);
            expect(component.editingContactIndex()).toBe(0);

            component.cancelInlineEdit();
            expect(component.editingContactIndex()).toBe(-1);
        });
    });
});