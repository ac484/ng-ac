/**
 * 基礎 DTO 介面測試
 * 驗證標準化 DTO 模式的正確性和一致性
 */

import {
  BaseCreateDto,
  BaseUpdateDto,
  BaseResponseDto,
  ListResponseDto,
  SearchCriteriaDto,
  BaseStatsDto,
  OperationResultDto,
  ValidationResultDto,
  ExportDataDto,
  BatchOperationDto,
  BatchOperationResultDto
} from './base.dto';

describe('Base DTO Interfaces', () => {
  describe('BaseCreateDto', () => {
    it('should allow extending with specific create fields', () => {
      interface TestCreateDto extends BaseCreateDto {
        name: string;
        email: string;
        age?: number;
      }

      const createDto: TestCreateDto = {
        name: 'Test User',
        email: 'test@example.com',
        age: 25
      };

      expect(createDto.name).toBe('Test User');
      expect(createDto.email).toBe('test@example.com');
      expect(createDto.age).toBe(25);
    });
  });

  describe('BaseUpdateDto', () => {
    it('should allow extending with optional update fields', () => {
      interface TestUpdateDto extends BaseUpdateDto {
        name?: string;
        email?: string;
        age?: number;
      }

      const updateDto: TestUpdateDto = {
        name: 'Updated Name'
        // email and age are optional
      };

      expect(updateDto.name).toBe('Updated Name');
      expect(updateDto.email).toBeUndefined();
      expect(updateDto.age).toBeUndefined();
    });
  });

  describe('BaseResponseDto', () => {
    it('should include required system fields', () => {
      interface TestResponseDto extends BaseResponseDto {
        name: string;
        email: string;
      }

      const responseDto: TestResponseDto = {
        id: 'test-id-123',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T12:00:00.000Z',
        name: 'Test User',
        email: 'test@example.com'
      };

      expect(responseDto.id).toBe('test-id-123');
      expect(responseDto.createdAt).toBe('2024-01-01T00:00:00.000Z');
      expect(responseDto.updatedAt).toBe('2024-01-01T12:00:00.000Z');
      expect(responseDto.name).toBe('Test User');
      expect(responseDto.email).toBe('test@example.com');
    });
  });

  describe('ListResponseDto', () => {
    it('should provide standardized list response format', () => {
      interface TestItem {
        id: string;
        name: string;
      }

      const listResponse: ListResponseDto<TestItem> = {
        items: [
          { id: '1', name: 'Item 1' },
          { id: '2', name: 'Item 2' }
        ],
        total: 10,
        page: 1,
        pageSize: 2,
        hasNext: true,
        hasPrevious: false
      };

      expect(listResponse.items.length).toBe(2);
      expect(listResponse.total).toBe(10);
      expect(listResponse.page).toBe(1);
      expect(listResponse.pageSize).toBe(2);
      expect(listResponse.hasNext).toBe(true);
      expect(listResponse.hasPrevious).toBe(false);
    });
  });

  describe('SearchCriteriaDto', () => {
    it('should provide standardized search criteria format', () => {
      const searchCriteria: SearchCriteriaDto = {
        keyword: 'test',
        status: 'active',
        startDate: '2024-01-01T00:00:00.000Z',
        endDate: '2024-12-31T23:59:59.999Z',
        page: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      expect(searchCriteria.keyword).toBe('test');
      expect(searchCriteria.status).toBe('active');
      expect(searchCriteria.startDate).toBe('2024-01-01T00:00:00.000Z');
      expect(searchCriteria.endDate).toBe('2024-12-31T23:59:59.999Z');
      expect(searchCriteria.page).toBe(1);
      expect(searchCriteria.pageSize).toBe(10);
      expect(searchCriteria.sortBy).toBe('createdAt');
      expect(searchCriteria.sortOrder).toBe('desc');
    });

    it('should allow partial search criteria', () => {
      const partialCriteria: SearchCriteriaDto = {
        keyword: 'test',
        page: 1
      };

      expect(partialCriteria.keyword).toBe('test');
      expect(partialCriteria.page).toBe(1);
      expect(partialCriteria.status).toBeUndefined();
      expect(partialCriteria.pageSize).toBeUndefined();
    });
  });

  describe('BaseStatsDto', () => {
    it('should provide standardized statistics format', () => {
      interface TestStatsDto extends BaseStatsDto {
        active: number;
        inactive: number;
        pending: number;
      }

      const stats: TestStatsDto = {
        total: 100,
        active: 80,
        inactive: 15,
        pending: 5
      };

      expect(stats.total).toBe(100);
      expect(stats.active).toBe(80);
      expect(stats.inactive).toBe(15);
      expect(stats.pending).toBe(5);
    });
  });

  describe('OperationResultDto', () => {
    it('should provide standardized operation result format', () => {
      const successResult: OperationResultDto = {
        success: true,
        message: 'Operation completed successfully',
        data: { id: 'test-123' }
      };

      const errorResult: OperationResultDto = {
        success: false,
        message: 'Operation failed',
        errors: ['Validation error', 'Database error']
      };

      expect(successResult.success).toBe(true);
      expect(successResult.message).toBe('Operation completed successfully');
      expect(successResult.data).toEqual({ id: 'test-123' });

      expect(errorResult.success).toBe(false);
      expect(errorResult.message).toBe('Operation failed');
      expect(errorResult.errors).toEqual(['Validation error', 'Database error']);
    });
  });

  describe('ValidationResultDto', () => {
    it('should provide standardized validation result format', () => {
      const validResult: ValidationResultDto = {
        isValid: true,
        errors: [],
        warnings: []
      };

      const invalidResult: ValidationResultDto = {
        isValid: false,
        errors: ['Email is required', 'Password too short'],
        warnings: ['Name should be capitalized'],
        fieldErrors: {
          email: ['Email is required', 'Invalid email format'],
          password: ['Password too short']
        }
      };

      expect(validResult.isValid).toBe(true);
      expect(validResult.errors).toEqual([]);
      expect(validResult.warnings).toEqual([]);

      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.errors).toEqual(['Email is required', 'Password too short']);
      expect(invalidResult.warnings).toEqual(['Name should be capitalized']);
      expect(invalidResult.fieldErrors?.['email']).toEqual(['Email is required', 'Invalid email format']);
      expect(invalidResult.fieldErrors?.['password']).toEqual(['Password too short']);
    });
  });

  describe('ExportDataDto', () => {
    it('should provide standardized export data format', () => {
      interface TestItem {
        id: string;
        name: string;
      }

      const exportData: ExportDataDto<TestItem> = {
        data: [
          { id: '1', name: 'Item 1' },
          { id: '2', name: 'Item 2' }
        ],
        exportDate: '2024-01-01T12:00:00.000Z',
        format: 'csv',
        filters: {
          keyword: 'test',
          status: 'active'
        },
        metadata: {
          exportedBy: 'user-123',
          totalRecords: 2
        }
      };

      expect(exportData.data.length).toBe(2);
      expect(exportData.exportDate).toBe('2024-01-01T12:00:00.000Z');
      expect(exportData.format).toBe('csv');
      expect(exportData.filters?.keyword).toBe('test');
      expect(exportData.metadata?.exportedBy).toBe('user-123');
    });
  });

  describe('BatchOperationDto', () => {
    it('should provide standardized batch operation format', () => {
      interface TestItem {
        id: string;
        name: string;
      }

      const batchOperation: BatchOperationDto<TestItem> = {
        items: [
          { id: '1', name: 'Item 1' },
          { id: '2', name: 'Item 2' }
        ],
        operation: 'delete',
        options: {
          force: true,
          reason: 'Cleanup'
        }
      };

      expect(batchOperation.items.length).toBe(2);
      expect(batchOperation.operation).toBe('delete');
      expect(batchOperation.options?.force).toBe(true);
      expect(batchOperation.options?.reason).toBe('Cleanup');
    });
  });

  describe('BatchOperationResultDto', () => {
    it('should provide standardized batch operation result format', () => {
      interface TestResult {
        id: string;
        success: boolean;
        message?: string;
      }

      const batchResult: BatchOperationResultDto<TestResult> = {
        totalCount: 3,
        successCount: 2,
        failureCount: 1,
        results: [
          { id: '1', success: true },
          { id: '2', success: true },
          { id: '3', success: false, message: 'Access denied' }
        ],
        errors: ['Failed to process item 3: Access denied']
      };

      expect(batchResult.totalCount).toBe(3);
      expect(batchResult.successCount).toBe(2);
      expect(batchResult.failureCount).toBe(1);
      expect(batchResult.results.length).toBe(3);
      expect(batchResult.errors).toEqual(['Failed to process item 3: Access denied']);
    });
  });

  describe('Type Safety', () => {
    it('should enforce type safety for generic DTOs', () => {
      interface User {
        id: string;
        name: string;
        email: string;
      }

      // This should compile without errors
      const userList: ListResponseDto<User> = {
        items: [{ id: '1', name: 'John', email: 'john@example.com' }],
        total: 1,
        page: 1,
        pageSize: 10,
        hasNext: false,
        hasPrevious: false
      };

      expect(userList.items[0].name).toBe('John');
      expect(userList.items[0].email).toBe('john@example.com');
    });
  });

  describe('Backward Compatibility', () => {
    it('should maintain backward compatibility with existing interfaces', () => {
      // Test that existing code patterns still work
      interface LegacyUserDto {
        id: string;
        name: string;
        createdAt: Date; // Legacy uses Date instead of string
        updatedAt: Date;
      }

      interface ModernUserDto extends BaseResponseDto {
        name: string;
        // createdAt and updatedAt are strings in BaseResponseDto
      }

      const legacyUser: LegacyUserDto = {
        id: '1',
        name: 'Legacy User',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const modernUser: ModernUserDto = {
        id: '1',
        name: 'Modern User',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T12:00:00.000Z'
      };

      expect(legacyUser.id).toBe('1');
      expect(modernUser.id).toBe('1');
      expect(typeof legacyUser.createdAt).toBe('object'); // Date object
      expect(typeof modernUser.createdAt).toBe('string'); // ISO string
    });
  });
});
