import { Injectable } from '@angular/core';
import { LoadDashboardUseCase } from 'src/app/domain/dashboard/application/use-cases/load-dashboard.use-case';
import { CustomizeDashboardUseCase } from 'src/app/domain/dashboard/application/use-cases/customize-dashboard.use-case';
import { DashboardResponse } from 'src/app/domain/dashboard/application/dto/responses/dashboard.response';
import { UpdateLayoutCommand } from 'src/app/domain/dashboard/application/dto/commands/update-layout.command';

@Injectable({
  providedIn: 'root'
})
export class DashboardApplicationService {
  constructor(
    private readonly loadDashboardUseCase: LoadDashboardUseCase,
    private readonly customizeDashboardUseCase: CustomizeDashboardUseCase
  ) { }

  loadDashboard(): Promise<DashboardResponse> {
    return this.loadDashboardUseCase.execute();
  }

  customizeDashboard(command: UpdateLayoutCommand): Promise<void> {
    return this.customizeDashboardUseCase.execute(command);
  }
}
