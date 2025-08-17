// Site Weather feature types
export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  timestamp: Date;
  siteId: string;
}

export interface SiteWeatherConfig {
  siteId: string;
  location: string;
  updateInterval: number;
  alertsEnabled: boolean;
}

export interface WeatherAlert {
  id: string;
  type: 'storm' | 'heat' | 'cold' | 'wind';
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: Date;
  siteId: string;
}
