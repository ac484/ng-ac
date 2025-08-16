# Design Document

## Overview

This design addresses the systematic resolution of build errors in the DDD architecture refactoring project. The solution focuses on fixing structural issues, implementing missing functionality, and ensuring type safety while maintaining the integrity of the Domain-Driven Design patterns. The approach prioritizes fixing foundational issues first, then building up the functionality incrementally.

## Architecture

### Error Categories and Solutions

The build errors fall into several categories that require different architectural approaches:

1. **Export/Import Issues**: Missing exports and circular dependencies
2. **Domain Model Structure**: ContractAggregate design and accessibility
3. **Service Implementation**: Missing domain service methods
4. **Type System**: Interface compliance and type compatibility
5. **Code Quality**: Override modifiers and error handling

### Solution Strategy

The solution follows a layered approach:
- **Foundation Layer**: Fix exports, imports, and basic type definitions
- **Domain Layer**: Correct aggregate design and implement domain services
- **Application Layer**: Fix service integrations and type mappings
- **Infrastructure Layer**: Resolve repository and adapter issues

## Components and Interfaces

### 1. Entity Export Resolution

**Problem**: Contract and ContractVersion entities are not properly exported.

**Solution**: 
- Add explicit exports to entity files
- Ensure proper barrel exports in index files
- Resolve circular dependency issues

```typescript
// contract.entity.ts
export class ContractEntity {
  // implementation
}

// contract-version.entity.ts  
export class ContractVersionEntity {
  // implementation
}
```

### 2. ContractAggregate Redesign

**Problem**: ContractAggregate has private constructor and nested .contract property access.

**Solution**:
- Provide public factory methods or constructor
- Flatten property access to remove .contract nesting
- Maintain aggregate root principles

```typescript
export class ContractAggregate extends AggregateRoot {
  public static create(/* params */): ContractAggregate {
    // factory method
  }
  
  // Direct property access instead of nested .contract
  get contractCode(): ContractCode { /* */ }
  get clientName(): string { /* */ }
  // etc.
}
```

### 3. Domain Service Implementation

**Problem**: ContractDomainService missing critical methods.

**Solution**: Implement all required methods with proper return types:

```typescript
export class ContractDomainService {
  findContractById(id: string): Observable<ContractAggregate | null>
  findContractsByStatus(status: string): Observable<ContractAggregate[]>
  findContractsByClient(clientName: string): Observable<ContractAggregate[]>
  deleteContract(id: string): Observable<void>
  getContractStats(): Observable<ContractStats>
}
```

### 4. AggregateRoot Compliance

**Problem**: Entities missing required properties for AggregateRoot interface.

**Solution**: Add version property to all aggregate root entities:

```typescript
export class ContractVersionEntity implements AggregateRoot {
  version: number = 1;
  // other properties
}

export class UserEntity implements AggregateRoot {
  version: number = 1;
  // other properties
}
```

### 5. Type System Fixes

**Problem**: Date vs Timestamp incompatibility and method signature mismatches.

**Solution**:
- Use Firebase Timestamp consistently for date fields
- Add proper type conversions where needed
- Fix constructor and method signatures

```typescript
// Use Timestamp instead of Date
interface ContractVersion {
  createdAt: Timestamp; // not Date
}

// Add conversion utilities
export class DateUtils {
  static toTimestamp(date: Date): Timestamp
  static fromTimestamp(timestamp: Timestamp): Date
}
```

## Data Models

### ContractAggregate Structure

```typescript
export class ContractAggregate extends AggregateRoot {
  private _contractCode: ContractCode;
  private _clientName: string;
  private _contractName: string;
  private _status: ContractStatus;
  private _totalAmount: Money;
  private _versions: ContractVersionEntity[];
  
  // Direct property access
  get contractCode(): ContractCode { return this._contractCode; }
  get clientName(): string { return this._clientName; }
  // etc.
  
  // Business methods
  updateStatus(status: ContractStatus): void
  updateProgress(progress: ContractProgress): void
  addVersion(version: ContractVersionEntity): void
}
```

### Repository Interface Updates

```typescript
export interface ContractRepository extends BaseRepository<ContractAggregate> {
  findByStatus(status: string): Observable<ContractAggregate[]>;
  findByClient(clientName: string): Observable<ContractAggregate[]>;
  getStats(): Observable<ContractStats>;
}
```

## Error Handling

### Exception System

**Problem**: Error.captureStackTrace not available in all environments.

**Solution**: Add environment detection and fallback:

```typescript
export abstract class BaseException extends Error {
  constructor(message: string) {
    super(message);
    
    // Environment-safe stack trace capture
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error()).stack;
    }
  }
}
```

### Export Conflict Resolution

**Problem**: Duplicate exports causing ambiguity.

**Solution**: Use explicit re-exports to resolve conflicts:

```typescript
// shared/index.ts
export { ValidationError } from './exceptions/validation.exceptions';
export type { ValidationError as ValidationErrorInterface } from './interfaces';

// interfaces/index.ts  
export type { DomainEvent } from './common.interfaces';
export type { EventHandler, EventPublisher } from './event.interfaces';
```

## Testing Strategy

### Unit Testing Approach

1. **Entity Tests**: Verify proper exports and instantiation
2. **Aggregate Tests**: Test direct property access and business methods
3. **Service Tests**: Mock dependencies and test method implementations
4. **Type Tests**: Compile-time type checking with strict TypeScript

### Integration Testing

1. **Repository Tests**: Test aggregate persistence and retrieval
2. **Service Integration**: Test application service to domain service communication
3. **Build Tests**: Automated build verification in CI/CD

### Error Validation

1. **Compilation Tests**: Ensure no TypeScript errors
2. **Runtime Tests**: Verify error handling works in different environments
3. **Type Safety Tests**: Validate strict mode compliance

## Implementation Phases

### Phase 1: Foundation Fixes
- Fix exports and imports
- Resolve type definition issues
- Add missing properties to entities

### Phase 2: Domain Layer
- Redesign ContractAggregate
- Implement domain service methods
- Fix repository interfaces

### Phase 3: Application Layer
- Update application services
- Fix adapter implementations
- Resolve type mappings

### Phase 4: Quality & Testing
- Add override modifiers
- Improve error handling
- Add comprehensive tests