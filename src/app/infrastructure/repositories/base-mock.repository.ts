import { SearchCriteria, PaginatedResult } from '../../domain/interfaces/search-criteria.interface';

/**
 * Abstract base class for Mock repositories
 * Provides common CRUD operations for in-memory storage
 */
export abstract class BaseMockRepository<T> {
    protected entities = new Map<string, T>();

    constructor() {
        this.initializeMockData();
    }

    /**
     * Find entity by ID
     */
    async findById(id: string): Promise<T | null> {
        await this.delay(100);
        this.logOperation('findById', { id });

        const entity = this.entities.get(id) || null;
        this.logOperation('findById', { id, found: !!entity });

        return entity;
    }

    /**
     * Find all entities with optional search criteria
     */
    async findAll(criteria?: SearchCriteria): Promise<T[]> {
        await this.delay(200);
        this.logOperation('findAll', { criteria });

        let entities = Array.from(this.entities.values());

        if (criteria) {
            entities = this.applySearchCriteria(entities, criteria);
        }

        // Default sorting by createdAt desc
        entities = this.sortEntities(entities, criteria?.sortBy || 'createdAt', criteria?.sortOrder || 'desc');

        this.logOperation('findAll', { criteria, count: entities.length });
        return entities;
    }

    /**
     * Find entities with pagination
     */
    async findWithPagination(criteria?: SearchCriteria): Promise<PaginatedResult<T>> {
        await this.delay(200);
        this.logOperation('findWithPagination', { criteria });

        const page = criteria?.page || 1;
        const pageSize = criteria?.pageSize || 10;
        const offset = (page - 1) * pageSize;

        let entities = Array.from(this.entities.values());

        if (criteria) {
            entities = this.applySearchCriteria(entities, criteria);
        }

        // Sort entities
        entities = this.sortEntities(entities, criteria?.sortBy || 'createdAt', criteria?.sortOrder || 'desc');

        const total = entities.length;
        const items = entities.slice(offset, offset + pageSize);
        const hasNext = offset + pageSize < total;
        const hasPrevious = page > 1;

        const result: PaginatedResult<T> = {
            items,
            total,
            page,
            pageSize,
            hasNext,
            hasPrevious
        };

        this.logOperation('findWithPagination', {
            criteria,
            resultCount: items.length,
            hasNext,
            hasPrevious: result.hasPrevious
        });

        return result;
    }

    /**
     * Save entity (create or update)
     */
    async save(entity: T): Promise<void> {
        await this.delay(150);
        const entityId = (entity as any).id;
        this.logOperation('save', { id: entityId });

        this.entities.set(entityId, entity);
        this.logOperation('save', { id: entityId, success: true });
    }

    /**
     * Delete entity by ID
     */
    async delete(id: string): Promise<void> {
        await this.delay(100);
        this.logOperation('delete', { id });

        this.entities.delete(id);
        this.logOperation('delete', { id, success: true });
    }

    /**
     * Check if entity exists by ID
     */
    async exists(id: string): Promise<boolean> {
        await this.delay(50);
        this.logOperation('exists', { id });

        const exists = this.entities.has(id);
        this.logOperation('exists', { id, exists });

        return exists;
    }

    /**
     * Count total entities
     */
    async count(criteria?: SearchCriteria): Promise<number> {
        await this.delay(50);
        this.logOperation('count', { criteria });

        let entities = Array.from(this.entities.values());

        if (criteria) {
            entities = this.applySearchCriteria(entities, criteria);
        }

        const count = entities.length;
        this.logOperation('count', { criteria, count });

        return count;
    }

    /**
     * Apply search criteria to entities array
     */
    protected applySearchCriteria(entities: T[], criteria: SearchCriteria): T[] {
        let filtered = entities;

        // Apply status filter
        if (criteria.status) {
            filtered = filtered.filter(entity => (entity as any).status === criteria.status);
        }

        // Apply date range filters
        if (criteria.startDate) {
            filtered = filtered.filter(entity => {
                const createdAt = (entity as any).createdAt;
                return createdAt && createdAt >= criteria.startDate!;
            });
        }

        if (criteria.endDate) {
            filtered = filtered.filter(entity => {
                const createdAt = (entity as any).createdAt;
                return createdAt && createdAt <= criteria.endDate!;
            });
        }

        // Apply custom filters
        if (criteria.filters) {
            Object.entries(criteria.filters).forEach(([field, value]) => {
                if (value !== undefined && value !== null) {
                    filtered = filtered.filter(entity => (entity as any)[field] === value);
                }
            });
        }

        // Apply keyword search (override in subclasses for specific logic)
        if (criteria.keyword) {
            filtered = this.applyKeywordSearch(filtered, criteria.keyword);
        }

        return filtered;
    }

    /**
     * Apply keyword search - override in subclasses for specific logic
     */
    protected applyKeywordSearch(entities: T[], keyword: string): T[] {
        // Default implementation - override in subclasses
        return entities;
    }

    /**
     * Sort entities by field and order
     */
    protected sortEntities(entities: T[], sortBy: string, sortOrder: 'asc' | 'desc'): T[] {
        return entities.sort((a, b) => {
            const aValue = (a as any)[sortBy];
            const bValue = (b as any)[sortBy];

            if (aValue === bValue) return 0;

            let comparison = 0;
            if (aValue > bValue) {
                comparison = 1;
            } else if (aValue < bValue) {
                comparison = -1;
            }

            return sortOrder === 'desc' ? -comparison : comparison;
        });
    }

    /**
     * Simulate network delay
     */
    protected delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Log repository operations for debugging and monitoring
     */
    protected logOperation(operation: string, data: any): void {
        console.log(`[Mock${this.constructor.name}] ${operation}:`, data);
    }

    /**
     * Clear all mock data (for testing)
     */
    clearMockData(): void {
        this.entities.clear();
    }

    /**
     * Add mock entity (for testing)
     */
    addMockEntity(entity: T): void {
        const entityId = (entity as any).id;
        this.entities.set(entityId, entity);
    }

    /**
     * Initialize mock data - override in subclasses
     */
    protected abstract initializeMockData(): void;
}