// src/app/domain/schedule-management/domain/repositories/schedule.repository.ts
import { Schedule } from '../entities/schedule.entity';
import { ScheduleId } from '../value-objects/schedule-id.vo';

export abstract class ScheduleRepository {
    abstract findById(id: ScheduleId): Promise<Schedule | null>;
    abstract findAll(): Promise<Schedule[]>;
    abstract save(schedule: Schedule): Promise<void>;
    abstract delete(id: ScheduleId): Promise<void>;
} 