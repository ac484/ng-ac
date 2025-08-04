import { TestBed } from '@angular/core/testing';
import { ConversionUtilitiesService } from './conversion-utilities.service';
import { UserStatus } from '../entities/user.entity';

describe('ConversionUtilitiesService', () => {
    let service: ConversionUtilitiesService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ConversionUtilitiesService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('stringToUserStatus', () => {
        it('should convert valid status strings to UserStatus', () => {
            expect(service.stringToUserStatus('active')).toBe('active');
            expect(service.stringToUserStatus('ACTIVE')).toBe('active');
            expect(service.stringToUserStatus('inactive')).toBe('inactive');
            expect(service.stringToUserStatus('suspended')).toBe('suspended');
        });

        it('should throw error for invalid status strings', () => {
            expect(() => service.stringToUserStatus('invalid')).toThrowError('Invalid user status: invalid');
            expect(() => service.stringToUserStatus('')).toThrowError('Status string is required');
        });
    });

    describe('display string conversions', () => {
        it('should convert UserStatus to display string', () => {
            expect(service.userStatusToDisplayString('active')).toBe('Active');
            expect(service.userStatusToDisplayString('inactive')).toBe('Inactive');
            expect(service.userStatusToDisplayString('suspended')).toBe('Suspended');
        });
    });

    describe('options for UI dropdowns', () => {
        it('should return user status options', () => {
            const options = service.getUserStatusOptions();
            expect(options.length).toBe(3);
            expect(options[0]).toEqual({ value: 'active', label: 'Active' });
        });

        it('should return account status options', () => {
            const options = service.getAccountStatusOptions();
            expect(options.length).toBe(4);
            expect(options[0]).toEqual({ value: 'ACTIVE', label: 'Active' });
        });
    });

    describe('batch conversion', () => {
        it('should batch convert user statuses', () => {
            const statuses = ['active', 'inactive', 'suspended'];
            const converted = service.batchConvertStatuses<UserStatus>(statuses, 'user');
            expect(converted).toEqual(['active', 'inactive', 'suspended']);
        });

        it('should throw error for invalid conversion type', () => {
            expect(() => service.batchConvertStatuses(['active'], 'invalid' as any))
                .toThrowError('Invalid conversion type: invalid');
        });
    });
});