# Business Partner Domain

This domain implements a contact management system using Domain-Driven Design (DDD) architecture. It was extracted from the original contact book application and refactored to follow clean architecture principles.

## Architecture Overview

The domain is organized into four layers following DDD principles:

### 1. Domain Layer (`domain/`)
- **Entities**: Core business objects (`Contact`)
- **Repositories**: Interfaces defining data access contracts
- **Services**: Domain business logic
- **Value Objects**: Immutable objects representing domain concepts

### 2. Application Layer (`application/`)
- **DTOs**: Data Transfer Objects for API communication
- **Services**: Application orchestration and use cases

### 3. Infrastructure Layer (`infrastructure/`)
- **Repositories**: Concrete implementations of repository interfaces
- **External Services**: Integration with external APIs (Firebase)

### 4. Presentation Layer (`presentation/`)
- **Components**: UI components for user interaction
- **Pages**: Main page components

## Key Components

### Domain Entities
- `Contact`: Core business entity with domain logic
  - Properties: id, firstName, lastName, email, phone, status, timestamps
  - Methods: update(), toggleStatus(), fullName, initials

### Application Services
- `ContactApplicationService`: Orchestrates domain operations
- Handles DTO mapping between layers
- Manages contact selection state

### Infrastructure
- `ContactRepositoryImpl`: Firebase-based implementation
- Handles data persistence and retrieval
- Supports CRUD operations and search

### Presentation Components
- `ContactListComponent`: Displays contact list with search
- `ContactDetailComponent`: Shows contact details
- `ContactFormComponent`: Add/edit contact form
- `ContactManagerComponent`: Main container component

## Data Flow

1. **Presentation** → **Application**: User actions trigger application services
2. **Application** → **Domain**: Application services orchestrate domain operations
3. **Domain** → **Infrastructure**: Domain services use repository interfaces
4. **Infrastructure** → **External**: Repository implementations call external APIs

## Features

- ✅ Contact CRUD operations
- ✅ Real-time search functionality
- ✅ Contact status management
- ✅ Responsive UI design
- ✅ Form validation
- ✅ Error handling
- ✅ Firebase integration

## Usage

```typescript
// Import the domain
import { ContactManagerComponent } from '@app/domains/business-partner';

// Use in your app
<app-contact-manager></app-contact-manager>
```

## Dependencies

- Angular Core
- Angular Forms
- Angular Common
- RxJS
- Firebase (for data persistence)

## Migration from Original

The original contact book functionality has been:
- Extracted from `contactBook-main/src/app/contact-book/`
- Refactored to follow DDD principles
- Enhanced with better separation of concerns
- Improved with type safety and error handling
- Modernized with Angular standalone components

