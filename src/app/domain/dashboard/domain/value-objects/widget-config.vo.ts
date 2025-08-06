import { ValueObject } from '../../../../shared/domain/value-object';

export class WidgetConfig extends ValueObject<any> {
    private constructor(props: any) {
        super(props);
    }

    public static create(props: any): WidgetConfig {
        return new WidgetConfig(props);
    }
}
