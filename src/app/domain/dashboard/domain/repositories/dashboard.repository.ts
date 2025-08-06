import { Repository } from 'src/app/shared/application/interfaces/repository.interface';
import { DashboardLayout } from '../entities/dashboard-layout.entity';

export abstract class DashboardRepository implements Repository<DashboardLayout, string> {
    abstract findById(id: string): Promise<DashboardLayout | null>;
    abstract findAll(): Promise<DashboardLayout[]>;
    abstract save(entity: DashboardLayout): Promise<void>;
    abstract delete(id: string): Promise<void>;
}

