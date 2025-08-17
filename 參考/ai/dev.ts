/**
 * Development configuration for AI flows
 * Unified configuration integrating flows from DocuParse, PartnerVerse, and Portfolio projects
 * 
 * This file imports all AI flows for their side effects, making them available
 * for development and testing through the Genkit development server.
 */

// Environment configuration
// Note: Next.js automatically loads .env files, so no need for dotenv in this context

// Only import AI flows in development environment
if (process.env.NODE_ENV === 'development') {
  // DocuParse flows - Document processing and work item extraction
  import('./flows/extract-work-items').catch(() => {
    // Silently fail if flow is not available
  });

  // PartnerVerse flows - Partner management and workflow optimization  
  import('./flows/workflow-optimization').catch(() => {
    // Silently fail if flow is not available
  });

  // Portfolio flows - Project management and contract processing
  import('./flows/generate-subtasks-flow').catch(() => {
    // Silently fail if flow is not available
  });
  import('./flows/summarize-contract').catch(() => {
    // Silently fail if flow is not available
  });
}

// Additional flows can be imported here as they are added to the platform

// AI development environment initialized
// DocuParse flows: extract-work-items
// PartnerVerse flows: workflow-optimization
// Portfolio flows: generate-subtasks-flow, summarize-contract
// All flows loaded and ready for development