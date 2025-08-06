// src/app/domain/daily-log/application/dto/daily-log.dto.ts
export interface CreateDailyLogCommand {
    date: Date;
    log: string;
}

export interface UpdateDailyLogCommand {
    id: string;
    date?: Date;
    log?: string;
}

export interface DailyLogDto {
    id: string;
    date: Date;
    log: string;
} 