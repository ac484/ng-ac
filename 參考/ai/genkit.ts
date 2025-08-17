import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Unified AI configuration for the integrated platform
// Integrates configurations from DocuParse, PartnerVerse, and Portfolio projects
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});