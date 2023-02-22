import { BaseZmooth } from './BaseZmooth';

export class ZmoothArray extends BaseZmooth<number[]> {
    onChange?: (values: number[]) => void;

    constructor(value: number[] = [], speed?: number, onChange?: (values: number[]) => void) {
        super(value, value, speed);

        this.onChange = onChange;
    }

    update(delta: number) {
        let i = this._value.length;
        while (i-- > 0) {
            this._value[i] = this.smoothValue(this._value[i], this.to[i], delta);
        }

        this.onChange?.(this._value);
    }
}
