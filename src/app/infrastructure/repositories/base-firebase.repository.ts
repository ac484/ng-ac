import {
    Firestore,
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    Query,
    DocumentData,
    QueryConstraint
} from '@angular/fire/firestore';
import { SearchCriteria, PaginatedResult } from '../../domain/interfaces/search-criteria.interface';
import { RepositoryError } from '../../domain/exceptions/repository.error';

/**
 * Abstract base class for Firebase repositories
 * Provides common CRUD operations and standardized error handling
 */
export abstract class BaseFirebaseRepository<T> {

    constructor(
        protected firestore: Firestore,
        protected collectionName: string
    ) { }

    /**
     * Find entity by ID
     */
    async findById(id: string): Promise<T | null> {
        try {
            this.logOperation('findById', { id });

            const docRef = doc(this.firestore, this.collectionName, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const result = this.fromFirestore(docSnap.data(), docSnap.id);
                this.logOperation('findById', { id, found: true });
                return result;
            }

            this.logOperation('findById', { id, found: false });
            return null;
        } catch (error) {
            this.logError('findById', error, { id });
            throw new RepositoryError(`查詢 ${this.collectionName} 失敗`, error as Error);
        }
    }

    /**
     * Find all entities with optional search criteria
     */
    async findAll(criteria?: SearchCriteria): Promise<T[]> {
        try {
            this.logOperation('findAll', { criteria });

            const collectionRef = collection(this.firestore, this.collectionName);
            let q: Query<DocumentData> = collectionRef;

            if (criteria) {
                q = this.applySearchCriteria(q, criteria);
            }

            const snapshot = await getDocs(q);
            const results = snapshot.docs.map(doc => this.fromFirestore(doc.data(), doc.id));

            this.logOperation('findAll', { criteria, count: results.length });
            return results;
        } catch (error) {
            this.logError('findAll', error, { criteria });
            throw new RepositoryError(`查詢 ${this.collectionName} 列表失敗`, error as Error);
        }
    }

    /**
     * Find entities with pagination
     */
    async findWithPagination(criteria?: SearchCriteria): Promise<PaginatedResult<T>> {
        try {
            this.logOperation('findWithPagination', { criteria });

            const page = criteria?.page || 1;
            const pageSize = criteria?.pageSize || 10;
            const offset = (page - 1) * pageSize;

            const collectionRef = collection(this.firestore, this.collectionName);
            let q: Query<DocumentData> = collectionRef;

            if (criteria) {
                q = this.applySearchCriteria(q, criteria);
            }

            // Apply pagination
            q = query(q, limit(pageSize + 1)); // Get one extra to check if there's a next page

            const snapshot = await getDocs(q);
            const docs = snapshot.docs;

            const hasNext = docs.length > pageSize;
            const items = docs
                .slice(0, pageSize)
                .map(doc => this.fromFirestore(doc.data(), doc.id));

            // For total count, we'd need a separate query in a real implementation
            // For now, we'll estimate based on current page
            const total = offset + items.length + (hasNext ? 1 : 0);

            const result: PaginatedResult<T> = {
                items,
                total,
                page,
                pageSize,
                hasNext,
                hasPrevious: page > 1
            };

            this.logOperation('findWithPagination', {
                criteria,
                resultCount: items.length,
                hasNext,
                hasPrevious: result.hasPrevious
            });

            return result;
        } catch (error) {
            this.logError('findWithPagination', error, { criteria });
            throw new RepositoryError(`分頁查詢 ${this.collectionName} 失敗`, error as Error);
        }
    }

    /**
     * Save entity (create or update)
     */
    async save(entity: T): Promise<void> {
        try {
            const entityId = (entity as any).id;
            this.logOperation('save', { id: entityId });

            const data = this.toFirestore(entity);
            const docRef = doc(this.firestore, this.collectionName, entityId);
            await setDoc(docRef, data, { merge: true });

            this.logOperation('save', { id: entityId, success: true });
        } catch (error) {
            const entityId = (entity as any).id;
            this.logError('save', error, { id: entityId });
            throw new RepositoryError(`儲存 ${this.collectionName} 失敗`, error as Error);
        }
    }

    /**
     * Delete entity by ID
     */
    async delete(id: string): Promise<void> {
        try {
            this.logOperation('delete', { id });

            const docRef = doc(this.firestore, this.collectionName, id);
            await deleteDoc(docRef);

            this.logOperation('delete', { id, success: true });
        } catch (error) {
            this.logError('delete', error, { id });
            throw new RepositoryError(`刪除 ${this.collectionName} 失敗`, error as Error);
        }
    }

    /**
     * Check if entity exists by ID
     */
    async exists(id: string): Promise<boolean> {
        try {
            this.logOperation('exists', { id });

            const docRef = doc(this.firestore, this.collectionName, id);
            const docSnap = await getDoc(docRef);
            const exists = docSnap.exists();

            this.logOperation('exists', { id, exists });
            return exists;
        } catch (error) {
            this.logError('exists', error, { id });
            throw new RepositoryError(`檢查 ${this.collectionName} 是否存在失敗`, error as Error);
        }
    }

    /**
     * Count total entities
     */
    async count(criteria?: SearchCriteria): Promise<number> {
        try {
            this.logOperation('count', { criteria });

            const collectionRef = collection(this.firestore, this.collectionName);
            let q: Query<DocumentData> = collectionRef;

            if (criteria) {
                q = this.applySearchCriteria(q, criteria);
            }

            const snapshot = await getDocs(q);
            const count = snapshot.size;

            this.logOperation('count', { criteria, count });
            return count;
        } catch (error) {
            this.logError('count', error, { criteria });
            throw new RepositoryError(`計算 ${this.collectionName} 數量失敗`, error as Error);
        }
    }

    /**
     * Apply search criteria to Firestore query
     * Default implementation handles common criteria
     * Subclasses can override for specific needs
     */
    protected applySearchCriteria(q: Query<DocumentData>, criteria: SearchCriteria): Query<DocumentData> {
        const constraints: QueryConstraint[] = [];

        // Apply status filter
        if (criteria.status) {
            constraints.push(where('status', '==', criteria.status));
        }

        // Apply date range filters
        if (criteria.startDate) {
            constraints.push(where('createdAt', '>=', criteria.startDate));
        }

        if (criteria.endDate) {
            constraints.push(where('createdAt', '<=', criteria.endDate));
        }

        // Apply custom filters
        if (criteria.filters) {
            Object.entries(criteria.filters).forEach(([field, value]) => {
                if (value !== undefined && value !== null) {
                    constraints.push(where(field, '==', value));
                }
            });
        }

        // Apply sorting
        const sortBy = criteria.sortBy || 'createdAt';
        const sortOrder = criteria.sortOrder || 'desc';
        constraints.push(orderBy(sortBy, sortOrder));

        // Apply pagination limit
        if (criteria.pageSize) {
            constraints.push(limit(criteria.pageSize));
        }

        return query(q, ...constraints);
    }

    /**
     * Log repository operations for debugging and monitoring
     */
    protected logOperation(operation: string, data: any): void {
        console.log(`[${this.collectionName}Repository] ${operation}:`, data);
    }

    /**
     * Log repository errors
     */
    protected logError(operation: string, error: any, context?: any): void {
        console.error(`[${this.collectionName}Repository] ${operation} failed:`, {
            error: error.message || error,
            context,
            stack: error.stack
        });
    }

    /**
     * Abstract method to convert Firestore document to entity
     * Must be implemented by concrete repository classes
     */
    protected abstract fromFirestore(data: DocumentData, id: string): T;

    /**
     * Abstract method to convert entity to Firestore document
     * Must be implemented by concrete repository classes
     */
    protected abstract toFirestore(entity: T): DocumentData;
}