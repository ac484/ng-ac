// src/app/domain/daily-log/domain/repositories/daily-log.repository.ts
import { DailyLog } from '../entities/daily-log.entity';
import { DailyLogId } from '../value-objects/daily-log-id.vo';

export abstract class DailyLogRepository {
    abstract findById(id: DailyLogId): Promise<DailyLog | null>;
    abstract findAll(): Promise<DailyLog[]>;
    abstract save(dailyLog: DailyLog): Promise<void>;
    abstract delete(id: DailyLogId): Promise<void>;
} 