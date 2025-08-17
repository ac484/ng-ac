// Daily Construction Log feature types
export interface DailyLogEntry {
  id: string;
  date: Date;
  siteId: string;
  weather: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  workCompleted: string;
  materialsUsed: string;
  equipmentUsed: string;
  personnelCount: number;
  issues: string;
  notes: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LogTemplate {
  id: string;
  name: string;
  fields: LogField[];
  isDefault: boolean;
  siteId?: string;
}

export interface LogField {
  name: string;
  type: 'text' | 'number' | 'select' | 'date' | 'boolean';
  required: boolean;
  options?: string[];
  defaultValue?: any;
}
