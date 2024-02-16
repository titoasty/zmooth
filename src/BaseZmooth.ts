export abstract class BaseZmooth<T> {
    protected _value: T;
    to: T;
    speed: number;
    private _alive = true;
    paused = false;

    constructor(value: T, to: T, speed: number = 1) {
        this._value = value;
        this.to = to;
        this.speed = speed;
    }

    abstract update(delta: number): void;

    kill() {
        this._alive = false;
    }

    get value() {
        return this._value;
    }

    get alive() {
        return this._alive;
    }

    reset(value: T) {
        this._value = value;
        this.to = value;
    }

    protected smoothValue(from: number, to: number, delta: number) {
        // ensure we don't got past "to" and don't go in the past
        return from + (to - from) * Math.max(0, Math.min(1, this.speed * delta));
    }
}
