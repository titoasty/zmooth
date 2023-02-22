export abstract class BaseZmooth<T> {
    protected _value: T;
    to: T;
    speed: number;
    private _alive = true;

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

    protected smoothValue(from: number, to: number, delta: number) {
        return from + (to - from) * this.speed * delta;
    }
}
