// src/app/domain/schedule-management/application/dto/schedule.dto.ts
export interface CreateScheduleCommand {
    taskId: string;
    startTime: Date;
    endTime: Date;
}

export interface UpdateScheduleCommand {
    id: string;
    startTime?: Date;
    endTime?: Date;
    status?: string;
}

export interface ScheduleDto {
    id: string;
    taskId: string;
    startTime: Date;
    endTime: Date;
    status: string;
} 