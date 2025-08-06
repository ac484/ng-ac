import { BaseEntity } from '../../../../shared/domain/base-entity';

export class DashboardLayout extends BaseEntity<string> {
    constructor(id: string, public readonly layout: any) {
        super(id);
    }
}
