import { ImageAnnotatorClient } from '@google-cloud/vision';
import * as logger from 'firebase-functions/logger';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

const visionClient = new ImageAnnotatorClient();

interface PdfScanRequest {
  gcsUri: string;
}

interface PdfScanResponse {
  status: 'DONE' | 'ERROR';
  extractedText?: string;
  error?: string;
}

export const extractPdfText = onCall<PdfScanRequest, Promise<PdfScanResponse>>(
  { timeoutSeconds: 540, memory: '1GiB', cors: true },
  async ({ data: { gcsUri } }) => {
    if (!gcsUri) throw new HttpsError('invalid-argument', 'gcsUri is required');

    try {
      const [result] = await visionClient.batchAnnotateFiles({
        requests: [
          {
            inputConfig: { gcsSource: { uri: gcsUri }, mimeType: 'application/pdf' },
            features: [{ type: 'DOCUMENT_TEXT_DETECTION' as const }]
          }
        ]
      });

      const extractedText =
        result.responses
          ?.flatMap(fileResponse => fileResponse.responses || [])
          .map(pageResponse => pageResponse.fullTextAnnotation?.text || '')
          .join('\n')
          .trim() || '';

      logger.info('PDF extraction completed', { textLength: extractedText.length });

      return { status: 'DONE', extractedText };
    } catch (error: any) {
      logger.error('PDF extraction failed', error);
      throw new HttpsError('internal', `Failed to extract PDF text: ${error.message}`);
    }
  }
);
