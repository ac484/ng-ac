import * as logger from 'firebase-functions/logger';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

interface WeatherRequest {
  location: string;
  type?: 'current' | 'forecast';
}

interface WeatherResponse {
  status: 'SUCCESS' | 'ERROR';
  data?: any;
  error?: string;
}

export const getWeatherData = onCall<WeatherRequest, Promise<WeatherResponse>>(
  {
    timeoutSeconds: 30,
    memory: '256MiB',
    cors: true,
    secrets: ['CWA_API_KEY']
  },
  async ({ data: { location, type = 'current' } }) => {
    if (!location) throw new HttpsError('invalid-argument', 'location is required');

    try {
      const baseUrl = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore';
      const apiKey = 'CWA-094B64D7-E44E-4B1C-89F4-C7A9AEB7408A';

      let endpoint: string;
      switch (type) {
        case 'current':
          endpoint = `${baseUrl}/O-A0003-001?Authorization=${apiKey}&locationName=${encodeURIComponent(location)}`;
          break;
        case 'forecast':
          endpoint = `${baseUrl}/F-C0032-001?Authorization=${apiKey}&locationName=${encodeURIComponent(location)}`;
          break;
        default:
          throw new HttpsError('invalid-argument', 'Invalid weather type');
      }

      const response = await fetch(endpoint);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`CWA API error: ${response.status} ${response.statusText}`);
      }

      logger.info('Weather data retrieved', { location, type, success: data.success });

      return { status: 'SUCCESS', data };
    } catch (error: any) {
      logger.error('Weather API call failed', error);
      throw new HttpsError('internal', `Failed to get weather data: ${error.message}`);
    }
  }
);
