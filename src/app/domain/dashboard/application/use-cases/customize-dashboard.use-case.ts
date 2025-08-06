import { Injectable } from '@angular/core';
import { UseCase } from 'src/app/shared/application/interfaces/use-case.interface';
import { UpdateLayoutCommand } from '../dto/commands/update-layout.command';
import { DashboardRepository } from '../../domain/repositories/dashboard.repository';
import { DashboardLayout } from '../../domain/entities/dashboard-layout.entity';

@Injectable({
    providedIn: 'root'
})
export class CustomizeDashboardUseCase implements UseCase<UpdateLayoutCommand, void> {
    constructor(private readonly dashboardRepository: DashboardRepository) { }

    async execute(command: UpdateLayoutCommand): Promise<void> {
        const layout = new DashboardLayout('default', command.layout);
        await this.dashboardRepository.save(layout);
    }
}
