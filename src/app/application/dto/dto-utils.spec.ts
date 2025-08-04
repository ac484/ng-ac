/**
 * 簡化的 DTO 工具函數測試
 * 只測試實際需要的核心功能
 */

import {
    dateToISOString,
    isoStringToDate,
    createListResponse,
    createOperationResult,
    createValidationResult,
    removeUndefinedProperties
} from './dto-utils';

describe('DTO Utils', () => {
    describe('Date Conversion', () => {
        describe('dateToISOString', () => {
            it('should convert Date to ISO string', () => {
                const date = new Date('2024-01-01T12:00:00.000Z');
                const result = dateToISOString(date);
                expect(result).toBe('2024-01-01T12:00:00.000Z');
            });

            it('should return undefined for null/undefined', () => {
                expect(dateToISOString(null)).toBeUndefined();
                expect(dateToISOString(undefined)).toBeUndefined();
            });
        });

        describe('isoStringToDate', () => {
            it('should convert ISO string to Date', () => {
                const result = isoStringToDate('2024-01-01T12:00:00.000Z');
                expect(result).toEqual(new Date('2024-01-01T12:00:00.000Z'));
            });

            it('should return undefined for null/undefined', () => {
                expect(isoStringToDate(null)).toBeUndefined();
                expect(isoStringToDate(undefined)).toBeUndefined();
            });
        });
    });

    describe('Response Creators', () => {
        describe('createListResponse', () => {
            it('should create standardized list response', () => {
                const items = [{ id: '1' }, { id: '2' }];
                const result = createListResponse(items, 10, 2, 5);

                expect(result.items).toEqual(items);
                expect(result.total).toBe(10);
                expect(result.page).toBe(2);
                expect(result.pageSize).toBe(5);
                expect(result.hasNext).toBe(true); // (2 * 5) < 10
                expect(result.hasPrevious).toBe(true); // 2 > 1
            });

            it('should calculate hasNext and hasPrevious correctly', () => {
                // First page
                const firstPage = createListResponse([], 10, 1, 5);
                expect(firstPage.hasNext).toBe(true);
                expect(firstPage.hasPrevious).toBe(false);

                // Last page
                const lastPage = createListResponse([], 10, 2, 5);
                expect(lastPage.hasNext).toBe(false);
                expect(lastPage.hasPrevious).toBe(true);
            });
        });

        describe('createOperationResult', () => {
            it('should create success result', () => {
                const result = createOperationResult(true, 'Success', { id: '123' });

                expect(result.success).toBe(true);
                expect(result.message).toBe('Success');
                expect(result.data).toEqual({ id: '123' });
                expect(result.errors).toBeUndefined();
            });

            it('should create error result', () => {
                const result = createOperationResult(false, 'Failed', undefined, ['Error 1', 'Error 2']);

                expect(result.success).toBe(false);
                expect(result.message).toBe('Failed');
                expect(result.data).toBeUndefined();
                expect(result.errors).toEqual(['Error 1', 'Error 2']);
            });
        });

        describe('createValidationResult', () => {
            it('should create valid result', () => {
                const result = createValidationResult(true);

                expect(result.isValid).toBe(true);
                expect(result.errors).toEqual([]);
                expect(result.warnings).toEqual([]);
                expect(result.fieldErrors).toBeUndefined();
            });

            it('should create invalid result with field errors', () => {
                const result = createValidationResult(
                    false,
                    ['General error'],
                    ['Warning'],
                    { email: ['Invalid email'], password: ['Too short'] }
                );

                expect(result.isValid).toBe(false);
                expect(result.errors).toEqual(['General error']);
                expect(result.warnings).toEqual(['Warning']);
                expect(result.fieldErrors).toEqual({
                    email: ['Invalid email'],
                    password: ['Too short']
                });
            });
        });
    });

    describe('Object Utilities', () => {
        describe('removeUndefinedProperties', () => {
            it('should remove undefined properties', () => {
                const obj = {
                    id: '123',
                    name: 'John',
                    email: undefined,
                    age: null,
                    active: true
                };

                const result = removeUndefinedProperties(obj);

                expect(result).toEqual({
                    id: '123',
                    name: 'John',
                    age: null,
                    active: true
                });
                expect('email' in result).toBe(false);
            });
        });
    });
});