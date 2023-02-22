import { BaseZmooth } from './BaseZmooth';

export class ZmoothObject<T extends string = string> extends BaseZmooth<Record<string, number>> {
    onChange?: (obj: Record<string, number>) => void;
    fieldNames: string[];

    constructor(obj: Record<T, number>, fieldNames?: string[], speed?: number, onChange?: (obj: Record<string, number>) => void) {
        super({ ...obj }, { ...obj }, speed);

        this.onChange = onChange;
        this.fieldNames = fieldNames || Object.keys(obj);
    }

    update(delta: number) {
        for (const fieldName of this.fieldNames) {
            this._value[fieldName] = this.smoothValue(this._value[fieldName], this.to[fieldName], delta);
        }

        this.onChange?.(this._value);
    }
}
