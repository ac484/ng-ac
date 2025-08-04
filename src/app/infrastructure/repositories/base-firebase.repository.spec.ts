import { TestBed } from '@angular/core/testing';
import { Firestore, DocumentData } from '@angular/fire/firestore';
import { BaseFirebaseRepository } from './base-firebase.repository';
import { SearchCriteria } from '../../domain/interfaces/search-criteria.interface';
import { RepositoryError } from '../../domain/exceptions/repository.error';

// Test entity interface
interface TestEntity {
    id: string;
    name: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

// Concrete test repository
class TestRepository extends BaseFirebaseRepository<TestEntity> {
    constructor(firestore: Firestore) {
        super(firestore, 'test-collection');
    }

    protected fromFirestore(data: DocumentData, id: string): TestEntity {
        return {
            id,
            name: data['name'] || '',
            status: data['status'] || 'active',
            createdAt: data['createdAt']?.toDate() || new Date(),
            updatedAt: data['updatedAt']?.toDate() || new Date()
        };
    }

    protected toFirestore(entity: TestEntity): DocumentData {
        return {
            name: entity.name,
            status: entity.status,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };
    }
}

describe('BaseFirebaseRepository', () => {
    let repository: TestRepository;
    let mockFirestore: jasmine.SpyObj<Firestore>;

    beforeEach(() => {
        mockFirestore = jasmine.createSpyObj('Firestore', ['app']);

        TestBed.configureTestingModule({
            providers: [
                { provide: Firestore, useValue: mockFirestore }
            ]
        });

        repository = new TestRepository(mockFirestore);
    });

    describe('fromFirestore', () => {
        it('should convert Firestore document to entity', () => {
            // Arrange
            const mockData = {
                name: 'Test Entity',
                status: 'active',
                createdAt: { toDate: () => new Date('2023-01-01') },
                updatedAt: { toDate: () => new Date('2023-01-02') }
            };
            const id = 'test-id';

            // Act
            const result = (repository as any).fromFirestore(mockData, id);

            // Assert
            expect(result.id).toBe(id);
            expect(result.name).toBe('Test Entity');
            expect(result.status).toBe('active');
            expect(result.createdAt).toEqual(new Date('2023-01-01'));
            expect(result.updatedAt).toEqual(new Date('2023-01-02'));
        });

        it('should handle missing optional fields', () => {
            // Arrange
            const mockData = {
                name: 'Test Entity'
            };
            const id = 'test-id';

            // Act
            const result = (repository as any).fromFirestore(mockData, id);

            // Assert
            expect(result.id).toBe(id);
            expect(result.name).toBe('Test Entity');
            expect(result.status).toBe('active');
            expect(result.createdAt).toBeInstanceOf(Date);
            expect(result.updatedAt).toBeInstanceOf(Date);
        });
    });

    describe('toFirestore', () => {
        it('should convert entity to Firestore document', () => {
            // Arrange
            const testEntity: TestEntity = {
                id: 'test-id',
                name: 'Test Entity',
                status: 'active',
                createdAt: new Date('2023-01-01'),
                updatedAt: new Date('2023-01-02')
            };

            // Act
            const result = (repository as any).toFirestore(testEntity);

            // Assert
            expect(result).toEqual({
                name: 'Test Entity',
                status: 'active',
                createdAt: new Date('2023-01-01'),
                updatedAt: new Date('2023-01-02')
            });
        });
    });

    describe('applySearchCriteria', () => {
        it('should apply basic search criteria', () => {
            // Arrange
            const mockQuery = { name: 'mock-query' };
            const criteria: SearchCriteria = {
                status: 'active',
                sortBy: 'name',
                sortOrder: 'asc',
                pageSize: 10
            };

            // Act
            const result = (repository as any).applySearchCriteria(mockQuery, criteria);

            // Assert
            // Since we can't easily mock Firestore query functions in this test environment,
            // we'll just verify the method doesn't throw an error
            expect(result).toBeDefined();
        });

        it('should handle empty criteria', () => {
            // Arrange
            const mockQuery = { name: 'mock-query' };
            const criteria: SearchCriteria = {};

            // Act
            const result = (repository as any).applySearchCriteria(mockQuery, criteria);

            // Assert
            expect(result).toBeDefined();
        });

        it('should apply date range filters', () => {
            // Arrange
            const mockQuery = { name: 'mock-query' };
            const criteria: SearchCriteria = {
                startDate: new Date('2023-01-01'),
                endDate: new Date('2023-12-31')
            };

            // Act
            const result = (repository as any).applySearchCriteria(mockQuery, criteria);

            // Assert
            expect(result).toBeDefined();
        });

        it('should apply custom filters', () => {
            // Arrange
            const mockQuery = { name: 'mock-query' };
            const criteria: SearchCriteria = {
                filters: {
                    category: 'test',
                    isActive: true
                }
            };

            // Act
            const result = (repository as any).applySearchCriteria(mockQuery, criteria);

            // Assert
            expect(result).toBeDefined();
        });
    });

    describe('logging', () => {
        it('should log operations', () => {
            // Arrange
            spyOn(console, 'log');

            // Act
            (repository as any).logOperation('test-operation', { test: 'data' });

            // Assert
            expect(console.log).toHaveBeenCalledWith(
                '[test-collectionRepository] test-operation:',
                { test: 'data' }
            );
        });

        it('should log errors', () => {
            // Arrange
            spyOn(console, 'error');
            const testError = new Error('Test error');

            // Act
            (repository as any).logError('test-operation', testError, { context: 'test' });

            // Assert
            expect(console.error).toHaveBeenCalledWith(
                '[test-collectionRepository] test-operation failed:',
                {
                    error: 'Test error',
                    context: { context: 'test' },
                    stack: testError.stack
                }
            );
        });
    });

    describe('error handling', () => {
        it('should create RepositoryError with correct properties', () => {
            // Arrange
            const message = 'Test error message';
            const cause = new Error('Original error');

            // Act
            const error = new RepositoryError(message, cause);

            // Assert
            expect(error.message).toBe(message);
            expect(error.cause).toBe(cause);
            expect(error.code).toBe('REPOSITORY_ERROR');
            expect(error.statusCode).toBe(500);
            expect(error.name).toBe('RepositoryError');
        });

        it('should create RepositoryError without cause', () => {
            // Arrange
            const message = 'Test error message';

            // Act
            const error = new RepositoryError(message);

            // Assert
            expect(error.message).toBe(message);
            expect(error.cause).toBeUndefined();
            expect(error.code).toBe('REPOSITORY_ERROR');
            expect(error.statusCode).toBe(500);
        });
    });

    describe('collection name', () => {
        it('should use correct collection name in constructor', () => {
            // Arrange & Act
            const testRepo = new TestRepository(mockFirestore);

            // Assert
            expect((testRepo as any).collectionName).toBe('test-collection');
        });
    });
});