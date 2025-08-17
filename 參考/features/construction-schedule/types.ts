// Construction Schedule feature types
export interface ConstructionTask {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  dependencies: string[];
}

export interface ScheduleMilestone {
  id: string;
  name: string;
  targetDate: Date;
  description: string;
  status: 'pending' | 'achieved' | 'delayed';
  projectId: string;
}

export interface ScheduleConfig {
  projectId: string;
  startDate: Date;
  endDate: Date;
  workingDays: number[];
  holidays: Date[];
}
