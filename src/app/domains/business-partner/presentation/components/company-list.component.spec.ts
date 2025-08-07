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

describe('CompanyListComponent - Contact Management', () => {
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

    describe('Contact Management', () => {
        beforeEach(() => {
            component.manageContacts(mockCompany);
        });

        it('should open contact modal when manageContacts is called', () => {
            expect(component.isContactModalVisible()).toBe(true);
            expect(component.currentCompanyId()).toBe('1');
        });

        it('should initialize contact form with existing contacts', () => {
            expect(component.contactsFormArray.length).toBe(1);
            expect(component.contactsFormArray.at(0).get('name')?.value).toBe('John Doe');
            expect(component.contactsFormArray.at(0).get('email')?.value).toBe('john@test.com');
        });

        it('should add new contact when addContact is called', () => {
            const initialLength = component.contactsFormArray.length;

            component.addContact();

            expect(component.contactsFormArray.length).toBe(initialLength + 1);
        });

        it('should remove contact when removeContact is called', () => {
            // Add another contact first
            component.addContact();
            expect(component.contactsFormArray.length).toBe(2);

            component.removeContact(1);

            expect(component.contactsFormArray.length).toBe(1);
        });

        it('should not remove the last contact but reset it instead', () => {
            component.removeContact(0);

            expect(component.contactsFormArray.length).toBe(1);
            expect(component.contactsFormArray.at(0).get('name')?.value).toBe('');
            expect(mockMessageService.info).toHaveBeenCalledWith('已重置聯絡人表單');
        });

        it('should save contacts when handleContactSave is called', () => {
            mockCompanyService.updateCompany.and.returnValue(of(mockCompany));

            component.contactsFormArray.at(0).patchValue({
                name: 'Jane Doe',
                title: 'Director',
                email: 'jane@test.com',
                phone: '098-765-4321',
                isPrimary: false
            });

            component.handleContactSave();

            expect(mockCompanyService.updateCompany).toHaveBeenCalledWith('1', {
                contacts: jasmine.any(Array)
            });
        });

        it('should close contact modal when handleContactCancel is called', () => {
            component.handleContactCancel();

            expect(component.isContactModalVisible()).toBe(false);
            expect(component.currentCompanyId()).toBe(null);
        });
    });

    describe('Contact Form Validation', () => {
        beforeEach(() => {
            component.manageContacts(mockCompany);
        });

        it('should show error when trying to save invalid contact form', () => {
            // Clear the form to make it invalid
            component.contactsFormArray.at(0).patchValue({
                name: '',
                title: '',
                email: 'invalid-email',
                phone: '',
                isPrimary: false
            });

            component.handleContactSave();

            expect(mockMessageService.error).toHaveBeenCalledWith('請檢查聯絡人資料');
        });

        it('should filter out empty contacts when saving', () => {
            mockCompanyService.updateCompany.and.returnValue(of(mockCompany));

            // Add an empty contact
            component.addContact();

            // Keep first contact valid, leave second empty
            component.contactsFormArray.at(0).patchValue({
                name: 'Valid Contact',
                title: 'Manager',
                email: 'valid@test.com',
                phone: '123-456-7890',
                isPrimary: true
            });

            component.handleContactSave();

            expect(mockCompanyService.updateCompany).toHaveBeenCalledWith('1', {
                contacts: [
                    {
                        name: 'Valid Contact',
                        title: 'Manager',
                        email: 'valid@test.com',
                        phone: '123-456-7890',
                        isPrimary: true
                    }
                ]
            });
        });
    });
});