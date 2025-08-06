// src/app/domain/daily-log/domain/entities/daily-log.entity.ts
import { BaseEntity } from '../../../../shared/domain/base-entity';
import { DailyLogId } from '../value-objects/daily-log-id.vo';

export class DailyLog extends BaseEntity<DailyLogId> {
    date: Date;
    log: string;

    constructor(id: DailyLogId, date: Date, log: string) {
        super(id);
        this.date = date;
        this.log = log;
    }
} 