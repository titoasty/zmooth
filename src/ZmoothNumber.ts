import { BaseZmooth } from './BaseZmooth';

export class ZmoothNumber extends BaseZmooth<number> {
    onChange?: (value: number) => void;

    constructor(value: number = 0, speed: number = 1, onChange?: (value: number) => void) {
        super(value, value, speed);

        this.onChange = onChange;
    }

    update(delta: number) {
        this._value = this.smoothValue(this._value, this.to, delta);

        this.onChange?.(this._value);
    }
}
