// src/app/domain/schedule-management/infrastructure/repositories/schedule-firebase.repository.ts
import { Injectable } from '@angular/core';
import { ScheduleRepository } from '../../domain/repositories/schedule.repository';
import { Schedule } from '../../domain/entities/schedule.entity';
import { ScheduleId } from '../../domain/value-objects/schedule-id.vo';

@Injectable({ providedIn: 'root' })
export class ScheduleFirebaseRepository extends ScheduleRepository {
    findById(id: ScheduleId): Promise<Schedule | null> {
        throw new Error('Method not implemented.');
    }
    findAll(): Promise<Schedule[]> {
        throw new Error('Method not implemented.');
    }
    save(schedule: Schedule): Promise<void> {
        throw new Error('Method not implemented.');
    }
    delete(id: ScheduleId): Promise<void> {
        throw new Error('Method not implemented.');
    }
} 