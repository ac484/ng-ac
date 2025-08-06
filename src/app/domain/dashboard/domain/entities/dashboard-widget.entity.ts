import { BaseEntity } from '../../../../shared/domain/base-entity';

export class DashboardWidget extends BaseEntity<string> {
    constructor(id: string, public readonly type: string, public readonly config: any) {
        super(id);
    }
}
