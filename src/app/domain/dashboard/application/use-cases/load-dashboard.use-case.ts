import { Injectable } from '@angular/core';
import { UseCase } from 'src/app/shared/application/interfaces/use-case.interface';
import { DashboardResponse } from '../dto/responses/dashboard.response';
import { DashboardRepository } from '../../domain/repositories/dashboard.repository';

@Injectable({
    providedIn: 'root'
})
export class LoadDashboardUseCase implements UseCase<void, DashboardResponse> {
    constructor(private readonly dashboardRepository: DashboardRepository) { }

    async execute(): Promise<DashboardResponse> {
        const layout = await this.dashboardRepository.findById('default'); // or some user-specific id
        return new DashboardResponse(layout?.layout || {});
    }
}
