// src/app/domain/daily-log/infrastructure/repositories/daily-log-firebase.repository.ts
import { Injectable } from '@angular/core';
import { DailyLogRepository } from '../../domain/repositories/daily-log.repository';
import { DailyLog } from '../../domain/entities/daily-log.entity';
import { DailyLogId } from '../../domain/value-objects/daily-log-id.vo';

@Injectable({ providedIn: 'root' })
export class DailyLogFirebaseRepository extends DailyLogRepository {
    findById(id: DailyLogId): Promise<DailyLog | null> {
        throw new Error('Method not implemented.');
    }
    findAll(): Promise<DailyLog[]> {
        throw new Error('Method not implemented.');
    }
    save(dailyLog: DailyLog): Promise<void> {
        throw new Error('Method not implemented.');
    }
    delete(id: DailyLogId): Promise<void> {
        throw new Error('Method not implemented.');
    }
} 