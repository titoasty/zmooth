declare abstract class BaseZmooth<T> {
    protected _value: T;
    to: T;
    speed: number;
    private _alive;
    paused: boolean;
    constructor(value: T, to: T, speed?: number);
    abstract update(delta: number): void;
    kill(): void;
    get value(): T;
    get alive(): boolean;
    reset(value: T): void;
    protected smoothValue(from: number, to: number, delta: number): number;
}

declare class ZmoothArray extends BaseZmooth<number[]> {
    onChange?: (values: number[]) => void;
    constructor(value?: number[], speed?: number, onChange?: (values: number[]) => void);
    update(delta: number): void;
}

declare class ZmoothNumber extends BaseZmooth<number> {
    onChange?: (value: number) => void;
    constructor(value?: number, speed?: number, onChange?: (value: number) => void);
    update(delta: number): void;
}

declare class ZmoothManager {
    private _zmooths;
    private _lastTime;
    private _rafID;
    autoUpdating: boolean;
    constructor(autoUpdate?: boolean);
    _autoUpdate(): void;
    setAutoUpdate(autoUpdate: boolean): void;
    /**
     * Updates all zmooth objects
     * @param delta delta time in seconds
     */
    update(delta: number): void;
    /**
     * Smoothes a value to its destination value
     * Each time you assign a value via myZmooth.to, it will smoothly interpolate to the destination value
     * You can assign a new value via .to any time you want
     * @example
     * const myZmooth = zmooth.val(0, 5, function(value) {
     *     console.log(value);
     * });
     *
     * // will smoothly change from 0 to 10
     * myZmooth.to = 10;
     *
     * setTimeout(function() {
     *     // will smoothly change from current myZmooth value to 20
     *     myZmooth.to = 20;
     * }, 2000);
     * @param value Start value
     * @param speed Speed of change. The formula is: value = value + (toValue - currValue) * delta * speed
     * @param onChange Callback each time the value is updated
     * @returns
     */
    val<T extends number>(value: T, speed?: number, onChange?: (value: T) => void): ZmoothNumber;
    val<T extends number[]>(value: T, speed?: number, onChange?: (value: T) => void): ZmoothArray;
    /**
     * Identical to val()
     * The difference is that the new value will be automatically assigned to the property in the object you passed in parameters
     * @example
     * const myObj = {
     *     myValue: 0,
     * };
     *
     * // now property 'myValue' on object myObj is managed automatically
     * const myZmooth = zmooth.prop(myObj, 'myValue');
     *
     * // now myObj.value will automatically be interpolated to 10
     * myZmooth.to = 10;
     * @param obj Any javascript object
     * @param propertyName Property that must be smoothed
     * @param speed Speed of change
     * @param onChange Callback each time the value is updated
     * @returns
     */
    prop<T extends Record<any, any>>(obj: T, propertyName: keyof T, speed?: number, onChange?: (value: any) => void): BaseZmooth<any>;
    /**
     * Kills a zmooth object
     * @param zmooth zmooth object to kill
     */
    kill(zmooth: BaseZmooth<unknown>): void;
    /**
     * Kills all zmooth objects
     */
    killAll(): void;
    /**
     * Destroys the zmooth manager
     */
    destroy(): void;
}

declare class ZmoothObject<T extends string = string> extends BaseZmooth<Record<string, number>> {
    onChange?: (obj: Record<string, number>) => void;
    fieldNames: string[];
    constructor(obj: Record<T, number>, fieldNames?: string[], speed?: number, onChange?: (obj: Record<string, number>) => void);
    update(delta: number): void;
}

declare const _default: {
    inst: (autoUpdate?: boolean) => ZmoothManager;
    val: {
        <T extends number>(value: T, speed?: number | undefined, onChange?: ((value: T) => void) | undefined): ZmoothNumber;
        <T_1 extends number[]>(value: T_1, speed?: number | undefined, onChange?: ((value: T_1) => void) | undefined): ZmoothArray;
    };
    prop: <T_2 extends Record<any, any>>(obj: T_2, propertyName: keyof T_2, speed?: number | undefined, onChange?: ((value: any) => void) | undefined) => BaseZmooth<any>;
    killAll: () => void;
    setAutoUpdate: (autoUpdate: boolean) => void;
    update: (delta: number) => void;
};

export { ZmoothArray, ZmoothNumber, ZmoothObject, _default as default };
