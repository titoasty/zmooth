import { BaseZmooth } from './BaseZmooth';

export class ZmoothObject<T extends string = string> extends BaseZmooth<Record<string, number>> {
    onChange?: (obj: Record<string, number>) => void;

    constructor(obj: Record<T, number>, speed?: number, onChange?: (obj: Record<string, number>) => void) {
        super({ ...obj }, { ...obj }, speed);

        this.onChange = onChange;
    }

    update(delta: number) {
        for (const key in this._value) {
            this._value[key] = this.smoothValue(this._value[key], this.to[key], delta);
        }

        this.onChange?.(this._value);
    }
}
