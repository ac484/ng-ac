import { ValueObject } from '../../../../shared/domain/value-object';

export class LayoutConfig extends ValueObject<any> {
    private constructor(props: any) {
        super(props);
    }

    public static create(props: any): LayoutConfig {
        return new LayoutConfig(props);
    }
}
