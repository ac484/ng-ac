// src/app/domain/schedule-management/domain/entities/schedule.entity.ts
import { BaseEntity } from '../../../../shared/domain/base-entity';
import { ScheduleId } from '../value-objects/schedule-id.vo';
import { ScheduleStatus } from '../value-objects/schedule-status.vo';
import { TaskId } from '../../../task-management/domain/value-objects/task-id.vo';

export class Schedule extends BaseEntity<ScheduleId> {
    taskId: TaskId;
    startTime: Date;
    endTime: Date;
    status: ScheduleStatus;

    constructor(id: ScheduleId, taskId: TaskId, startTime: Date, endTime: Date) {
        super(id);
        this.taskId = taskId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = ScheduleStatus.create('PLANNED');
    }
} 