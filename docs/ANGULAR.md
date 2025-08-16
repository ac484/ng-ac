# Angular Framework API Reference

> **Angular** is a comprehensive web application framework developed by Google that empowers developers to build fast, reliable, and scalable single-page applications (SPAs) using TypeScript, HTML, and CSS.

## Table of Contents

- [Identifier Types](#identifier-types)
- [Core Modules](#core-modules)
- [Animation System](#animation-system)
- [Component Development Kit (CDK)](#component-development-kit-cdk)
- [Common Utilities](#common-utilities)
- [Forms System](#forms-system)
- [HTTP Client](#http-client)
- [Platform Modules](#platform-modules)
- [Router System](#router-system)
- [Testing Framework](#testing-framework)
- [Service Worker](#service-worker)
- [Server-Side Rendering (SSR)](#server-side-rendering-ssr)
- [Upgrade Utilities](#upgrade-utilities)
- [Global Utilities](#global-utilities)

---

## Identifier Types

Angular uses specific symbols to categorize different types of APIs:

- **B** - Block (Control flow blocks like @if, @for, @switch)
- **C** - Class (JavaScript/TypeScript classes)
- **K** - Constant (Configuration constants and tokens)
- **@** - Decorator (Angular metadata decorators)
- **D** - Directive (DOM manipulation and behavior directives)
- **El** - Element (HTML template elements)
- **E** - Enum (TypeScript enumerations)
- **F** - Function (Utility and factory functions)
- **I** - Interface (TypeScript interfaces and contracts)
- **P** - Pipe (Data transformation pipes)
- **M** - Module (Angular modules)
- **T** - Type Alias (TypeScript type definitions)
- **IA** - Initializer API (New Angular 17+ control flow APIs)

---

## Core Modules

### @angular/core

The **core module** contains the fundamental building blocks of Angular applications.

#### Control Flow Blocks (Angular 17+)
- **@defer** - Lazy loads content when it comes into view
- **@for** - Iterates over collections with optimized change detection
- **@if** - Conditional rendering with else support
- **@let** - Creates local variables in templates
- **@switch** - Multi-way conditional rendering

#### Lifecycle Hooks
- **AfterContentChecked** - Called after content projection is checked
- **AfterContentInit** - Called after content projection is initialized
- **AfterViewChecked** - Called after view and child views are checked
- **AfterViewInit** - Called after view and child views are initialized
- **OnChanges** - Called when data-bound properties change
- **OnDestroy** - Called when component is destroyed
- **OnInit** - Called after component initialization

#### Core Decorators
- **@Component** - Defines a component with template, styles, and logic
- **@Directive** - Defines a directive for DOM manipulation
- **@Injectable** - Marks a class as available for dependency injection
- **@NgModule** - Defines a module that groups related components
- **@Pipe** - Defines a pipe for data transformation

#### Dependency Injection
- **inject()** - Function for dependency injection in functional contexts
- **InjectionToken** - Token for providing dependencies
- **Injector** - Service for retrieving dependencies

#### Signals (Angular 16+)
- **signal()** - Creates reactive primitive values
- **computed()** - Creates derived reactive values
- **effect()** - Creates side effects that run when signals change

---

## Animation System

### @angular/animations

The **animations module** provides a declarative API for defining and managing animations.

#### Core Animation Functions
- **animate()** - Defines animation timing and easing
- **state()** - Defines animation states
- **transition()** - Defines transitions between states
- **trigger()** - Groups related animations
- **keyframes()** - Defines complex multi-step animations
- **group()** - Runs multiple animations simultaneously
- **sequence()** - Runs animations in sequence
- **stagger()** - Delays animations for list items

#### Animation Metadata
- **AnimationMetadata** - Base interface for all animation definitions
- **AnimationStateMetadata** - Defines animation states
- **AnimationTransitionMetadata** - Defines state transitions
- **AnimationStyleMetadata** - Defines CSS styles for animations

#### Animation Utilities
- **AUTO_STYLE** - Constant for automatic style calculation
- **useAnimation()** - Reuses existing animations

### @angular/platform-browser/animations

#### Browser Animation Modules
- **BrowserAnimationsModule** - Enables browser animations (deprecated)
- **NoopAnimationsModule** - Disables all animations for testing/SSR

#### Animation Providers
- **provideAnimations()** - Enables animations in standalone apps
- **provideNoopAnimations()** - Disables animations in standalone apps

---

## Component Development Kit (CDK)

### @angular/cdk/drag-drop

The **CDK drag-and-drop module** provides accessible drag-and-drop functionality.

#### Core Classes
- **CdkDrag** - Makes an element draggable
- **CdkDropList** - Container for droppable items
- **CdkDropListGroup** - Groups multiple drop lists
- **DragDrop** - Service for managing drag-and-drop operations

#### Drag Events
- **CdkDragStart** - Fired when dragging begins
- **CdkDragEnd** - Fired when dragging ends
- **CdkDragMove** - Fired during dragging
- **CdkDragEnter** - Fired when entering drop zone
- **CdkDragExit** - Fired when leaving drop zone

#### Utilities
- **moveItemInArray()** - Reorders items in an array
- **transferArrayItem()** - Moves items between arrays
- **copyArrayItem()** - Copies items between arrays

### @angular/cdk/testing

The **CDK testing module** provides testing utilities for Angular applications.

#### Testing Harnesses
- **ComponentHarness** - Base class for component testing
- **HarnessEnvironment** - Environment for running harnesses
- **HarnessLoader** - Loads and manages testing harnesses

#### Testing Utilities
- **manualChangeDetection()** - Manually triggers change detection
- **parallel()** - Runs multiple operations in parallel

---

## Common Utilities

### @angular/common

The **common module** provides essential utilities and pipes.

#### Pipes
- **AsyncPipe** - Unwraps observables and promises
- **CurrencyPipe** - Formats numbers as currency
- **DatePipe** - Formats dates
- **DecimalPipe** - Formats numbers with decimal places
- **JsonPipe** - Converts objects to JSON strings
- **LowerCasePipe** - Converts text to lowercase
- **UpperCasePipe** - Converts text to uppercase
- **TitleCasePipe** - Converts text to title case
- **SlicePipe** - Extracts portions of arrays/strings

#### Directives
- **NgClass** - Conditionally applies CSS classes
- **NgStyle** - Conditionally applies CSS styles
- **NgIf** - Conditionally renders content
- **NgFor** - Iterates over collections
- **NgSwitch** - Multi-way conditional rendering

#### Location Services
- **Location** - Service for URL manipulation
- **LocationStrategy** - Strategy for URL handling
- **HashLocationStrategy** - Hash-based routing
- **PathLocationStrategy** - Path-based routing

#### Platform Detection
- **isPlatformBrowser()** - Checks if running in browser
- **isPlatformServer()** - Checks if running on server

---

## Forms System

### @angular/forms

The **forms module** provides both template-driven and reactive forms.

#### Template-Driven Forms
- **FormsModule** - Module for template-driven forms
- **NgModel** - Two-way data binding directive
- **NgForm** - Form container directive
- **NgModelGroup** - Groups form controls

#### Reactive Forms
- **ReactiveFormsModule** - Module for reactive forms
- **FormBuilder** - Service for building form groups
- **FormGroup** - Container for form controls
- **FormControl** - Individual form control
- **FormArray** - Array of form controls

#### Form Validation
- **Validators** - Built-in validation functions
- **AsyncValidator** - Interface for async validation
- **ValidationErrors** - Type for validation error objects

#### Value Accessors
- **ControlValueAccessor** - Interface for custom form controls
- **DefaultValueAccessor** - Default input value accessor
- **CheckboxControlValueAccessor** - Checkbox value accessor
- **SelectControlValueAccessor** - Select value accessor

---

## HTTP Client

### @angular/common/http

The **HTTP client module** provides HTTP communication capabilities.

#### Core Classes
- **HttpClient** - Main service for HTTP requests
- **HttpHeaders** - HTTP headers management
- **HttpParams** - HTTP parameters management
- **HttpRequest** - HTTP request configuration
- **HttpResponse** - HTTP response wrapper

#### HTTP Events
- **HttpEvent** - Union type for all HTTP events
- **HttpSentEvent** - Fired when request is sent
- **HttpProgressEvent** - Fired during upload/download
- **HttpResponse** - Fired when response is received
- **HttpErrorResponse** - Fired when errors occur

#### HTTP Features
- **HTTP_INTERCEPTORS** - Token for HTTP interceptors
- **HttpInterceptor** - Interface for HTTP interceptors
- **withInterceptors()** - Configures HTTP interceptors
- **withFetch()** - Uses Fetch API instead of XMLHttpRequest

#### HTTP Testing
- **HttpTestingController** - Controller for HTTP testing
- **TestRequest** - Mock HTTP request for testing

---

## Platform Modules

### @angular/platform-browser

The **platform-browser module** provides browser-specific functionality.

#### Core Services
- **DomSanitizer** - Sanitizes HTML, CSS, and URLs
- **Title** - Service for managing document title
- **Meta** - Service for managing meta tags
- **ViewportScroller** - Service for viewport scrolling

#### Browser Features
- **provideClientHydration()** - Enables client-side hydration
- **withEventReplay()** - Replays events after hydration
- **withIncrementalHydration()** - Enables incremental hydration

### @angular/platform-server

The **platform-server module** provides server-side rendering capabilities.

#### Core Services
- **renderApplication()** - Renders Angular app on server
- **renderModule()** - Renders Angular module on server
- **provideServerRendering()** - Enables SSR

---

## Router System

### @angular/router

The **router module** provides client-side routing capabilities.

#### Core Classes
- **Router** - Main routing service
- **ActivatedRoute** - Current route information
- **RouterState** - Current router state
- **RouteReuseStrategy** - Strategy for route reuse

#### Route Configuration
- **Route** - Interface for route definitions
- **Routes** - Array of route definitions
- **RouterModule** - Module for routing functionality
- **forRoot()** - Configures root routing
- **forChild()** - Configures child routing

#### Navigation Events
- **RouterEvent** - Base class for router events
- **NavigationStart** - Navigation begins
- **NavigationEnd** - Navigation completes
- **NavigationCancel** - Navigation cancelled
- **NavigationError** - Navigation error occurs

#### Route Guards
- **CanActivate** - Interface for route activation guards
- **CanDeactivate** - Interface for route deactivation guards
- **CanMatch** - Interface for route matching guards
- **Resolve** - Interface for route data resolvers

#### Router Features
- **withComponentInputBinding()** - Binds route params to component inputs
- **withDebugTracing()** - Enables router debugging
- **withHashLocation()** - Uses hash-based routing
- **withViewTransitions()** - Enables view transitions API

---

## Testing Framework

### @angular/core/testing

The **core testing module** provides testing utilities.

#### Core Testing
- **TestBed** - Main testing utility
- **ComponentFixture** - Wrapper for testing components
- **fakeAsync()** - Simulates async operations
- **tick()** - Advances fake async time
- **flush()** - Flushes pending async operations

#### Testing Utilities
- **inject()** - Injects dependencies in tests
- **waitForAsync()** - Waits for async operations
- **discardPeriodicTasks()** - Cleans up periodic tasks

### @angular/router/testing

The **router testing module** provides routing testing utilities.

- **RouterTestingModule** - Module for testing routing
- **RouterTestingHarness** - Harness for testing routing

---

## Service Worker

### @angular/service-worker

The **service worker module** provides PWA capabilities.

#### Core Services
- **SwUpdate** - Service for service worker updates
- **SwPush** - Service for push notifications
- **SwRegistrationOptions** - Options for service worker registration

#### Events
- **VersionDetectedEvent** - New version detected
- **VersionReadyEvent** - New version ready to activate
- **VersionInstallationFailedEvent** - Version installation failed

---

## Server-Side Rendering (SSR)

### @angular/ssr

The **SSR module** provides server-side rendering capabilities.

#### Core Services
- **AngularAppEngine** - Main SSR engine
- **renderApplication()** - Renders app on server
- **provideServerRendering()** - Enables SSR

#### Node.js Support
- **AngularNodeAppEngine** - Node.js-specific SSR engine
- **CommonEngine** - Common SSR functionality

---

## Upgrade Utilities

### @angular/upgrade/static

The **upgrade module** helps migrate from AngularJS to Angular.

#### Core Services
- **UpgradeModule** - Module for hybrid applications
- **downgradeComponent()** - Downgrades Angular components
- **downgradeInjectable()** - Downgrades Angular services
- **UpgradeComponent** - Base class for upgrade components

---

## Global Utilities

### window.ng

The **window.ng globals** provide debugging and development utilities.

#### Debug Functions
- **getComponent()** - Gets component instance
- **getDirectives()** - Gets directive instances
- **getInjector()** - Gets injector instance
- **enableProfiling()** - Enables performance profiling

---

## Version Information

- **Current Version**: Angular 20
- **Framework Type**: Full-featured web application framework
- **Language**: TypeScript/JavaScript
- **Architecture**: Component-based with dependency injection
- **Rendering**: Client-side and server-side rendering support
- **Testing**: Comprehensive testing framework included
- **Build Tools**: Angular CLI for development and build processes

---

## Key Features

- **Component Architecture**: Reusable, encapsulated UI components
- **Dependency Injection**: Built-in DI system for service management
- **Reactive Programming**: RxJS integration for async operations
- **Type Safety**: Full TypeScript support with type checking
- **Performance**: Optimized change detection and rendering
- **Accessibility**: Built-in accessibility features and ARIA support
- **Internationalization**: Multi-language support with i18n
- **Progressive Web Apps**: Service worker and PWA capabilities
- **Universal**: Server-side rendering and pre-rendering support

---

## Browser Support

Angular supports all modern browsers including:
- Chrome, Firefox, Safari, Edge (latest versions)
- Internet Explorer 11+ (with polyfills)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Getting Started

```bash
# Install Angular CLI
npm install -g @angular/cli

# Create new project
ng new my-app

# Serve development server
ng serve

# Build for production
ng build --prod
```

---

*This document provides a comprehensive reference to Angular's core APIs and modules. For detailed usage examples and tutorials, refer to the official Angular documentation.*
