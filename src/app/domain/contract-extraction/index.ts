// src/app/domain/contract-extraction/index.ts

// Domain Layer
export * from './domain/entities/contract-extraction.entity';
export * from './domain/entities/task.entity';
export * from './domain/entities/milestone.entity';
export * from './domain/entities/contract-term.entity';

export * from './domain/value-objects/extraction-id.vo';
export * from './domain/value-objects/extraction-status.vo';
export * from './domain/value-objects/task-id.vo';
export * from './domain/value-objects/milestone-id.vo';
export * from './domain/value-objects/contract-term-id.vo';

export * from './domain/services/contract-extraction.service';
export * from './domain/repositories/contract-extraction.repository';

// Application Layer
export * from './application/use-cases/start-contract-extraction.use-case';
export * from './application/use-cases/get-extraction-results.use-case';

// Infrastructure Layer
export * from './infrastructure/firebase/firebase-contract-extraction.repository';

// Presentation Layer
export * from './presentation/components/contract-extraction.component'; 