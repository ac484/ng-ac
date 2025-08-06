# Contract Extraction Domain

## Overview

The Contract Extraction domain implements a sophisticated pipeline for extracting, parsing, and structuring contract content from PDF documents. It follows Domain-Driven Design (DDD) principles and provides a modern, scalable architecture for contract analysis.

## Architecture

```
📄 PDF Contract
    ↓
🔍 Google OCR (Vision AI)
    ↓
📐 NLP Processing
    ↓
📊 Content Extraction
    ↓
🧠 Rule Application
    ↓
📤 Structured Output
```

## Domain Structure

### Domain Layer
- **Entities**: `ContractExtraction`, `Task`, `Milestone`, `ContractTerm`
- **Value Objects**: `ExtractionId`, `ExtractionStatus`, `TaskId`, `MilestoneId`, `ContractTermId`
- **Services**: `ContractExtractionService`
- **Repositories**: `ContractExtractionRepository`

### Application Layer
- **Use Cases**: 
  - `StartContractExtractionUseCase`
  - `GetExtractionResultsUseCase`

### Infrastructure Layer
- **Firebase Implementation**: `FirebaseContractExtractionRepository`

### Presentation Layer
- **Components**: `ContractExtractionComponent`

## Key Features

### 1. OCR Processing
- Google Vision AI integration for PDF text extraction
- Confidence scoring for extracted text
- Multi-page document support

### 2. NLP Processing
- Sentence segmentation
- Entity recognition
- Named entity extraction
- Semantic analysis

### 3. Content Extraction
- **Tasks**: Identify actionable items with priorities and due dates
- **Milestones**: Extract key project milestones and deadlines
- **Contract Terms**: Parse legal clauses and conditions

### 4. Structured Output
- JSON-formatted results
- Confidence scoring for each extraction
- Source text references
- Metadata preservation

## Usage

### Starting an Extraction

```typescript
const useCase = new StartContractExtractionUseCase(
    contractExtractionService,
    contractExtractionRepository
);

const request: StartContractExtractionRequest = {
    contractId: 'contract-123',
    pdfUrl: 'https://example.com/contract.pdf'
};

const response = await useCase.execute(request);
```

### Retrieving Results

```typescript
const useCase = new GetExtractionResultsUseCase(
    contractExtractionRepository
);

const request: GetExtractionResultsRequest = {
    extractionId: 'extraction-456'
};

const results = await useCase.execute(request);
```

## Data Models

### ContractExtraction Entity
```typescript
{
    id: ExtractionId;
    contractId: ContractId;
    status: ExtractionStatus;
    originalPdfUrl: string;
    extractedText: string;
    tasks: Task[];
    milestones: Milestone[];
    contractTerms: ContractTerm[];
    processingError?: string;
}
```

### Task Entity
```typescript
{
    id: TaskId;
    extractionId: ExtractionId;
    title: string;
    description: string;
    taskType: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    dueDate?: Date;
    assignedTo?: string;
    sourceText: string;
    confidence: number;
}
```

### Milestone Entity
```typescript
{
    id: MilestoneId;
    extractionId: ExtractionId;
    title: string;
    description: string;
    dueDate: Date;
    milestoneType: string;
    sourceText: string;
    confidence: number;
    isCompleted: boolean;
}
```

### ContractTerm Entity
```typescript
{
    id: ContractTermId;
    extractionId: ExtractionId;
    termType: string;
    title: string;
    content: string;
    clauseNumber?: string;
    section?: string;
    sourceText: string;
    confidence: number;
    isCritical: boolean;
}
```

## Processing Pipeline

### 1. Initialization
- Create extraction entity with contract ID and PDF URL
- Set status to 'PENDING'

### 2. OCR Processing
- Call Google Vision AI API
- Extract text with confidence scores
- Update extraction with extracted text

### 3. NLP Processing
- Segment text into sentences
- Identify entities and relationships
- Apply language models for understanding

### 4. Content Extraction
- Apply rule-based extraction for tasks
- Identify milestone patterns
- Parse contract terms and clauses

### 5. Entity Creation
- Create Task entities from extracted data
- Create Milestone entities
- Create ContractTerm entities

### 6. Completion
- Update extraction status to 'COMPLETED'
- Save all entities to repository

## Error Handling

The system includes comprehensive error handling:

- **OCR Failures**: Retry mechanisms and fallback options
- **NLP Errors**: Graceful degradation with basic text processing
- **Extraction Failures**: Detailed error logging and recovery
- **Repository Errors**: Transaction rollback and data consistency

## Configuration

### Google Vision AI
```typescript
// Configure in environment
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_PRIVATE_KEY=your-private-key
GOOGLE_CLOUD_CLIENT_EMAIL=your-client-email
```

### Firebase Configuration
```typescript
// Collections
contract_extractions
extraction_tasks
extraction_milestones
extraction_contract_terms
```

## Performance Considerations

- **Async Processing**: All operations are asynchronous
- **Batch Processing**: Support for multiple document processing
- **Caching**: Extracted text and results are cached
- **Compression**: Large documents are compressed for storage

## Security

- **Authentication**: Firebase Auth integration
- **Authorization**: Role-based access control
- **Data Encryption**: Sensitive data encrypted at rest
- **Audit Logging**: Complete audit trail for all operations

## Testing

### Unit Tests
- Entity behavior testing
- Value object validation
- Service method testing

### Integration Tests
- Repository operations
- Use case execution
- Component rendering

### End-to-End Tests
- Complete extraction pipeline
- Error scenarios
- Performance testing

## Future Enhancements

1. **Machine Learning Integration**
   - Custom ML models for specific contract types
   - Continuous learning from user feedback
   - Automated model retraining

2. **Advanced NLP**
   - Named entity recognition for legal terms
   - Sentiment analysis for contract tone
   - Relationship extraction between clauses

3. **Real-time Processing**
   - WebSocket integration for live updates
   - Progress tracking and notifications
   - Real-time collaboration features

4. **Multi-language Support**
   - International contract processing
   - Language detection and translation
   - Cultural context awareness

## Contributing

When contributing to the Contract Extraction domain:

1. Follow DDD principles
2. Maintain separation of concerns
3. Write comprehensive tests
4. Update documentation
5. Follow the established naming conventions

## Dependencies

- Angular Framework
- Firebase Firestore
- Google Cloud Vision AI
- NLP Libraries (TBD)
- Testing Framework (Jasmine/Karma) 