// src/app/domain/task-management/application/dto/task.dto.ts
export interface CreateTaskCommand {
    title: string;
    description: string;
}

export interface UpdateTaskCommand {
    id: string;
    title?: string;
    description?: string;
    status?: string;
}

export interface TaskDto {
    id: string;
    title: string;
    description: string;
    status: string;
} 