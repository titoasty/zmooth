import { BaseZmooth } from './BaseZmooth';
import { ZmoothArray } from './ZmoothArray';
import { ZmoothNumber } from './ZmoothNumber';

export class ZmoothManager {
    private _zmooths: BaseZmooth<unknown>[] = [];
    private _lastTime = performance.now();
    private _rafID: number = -1;
    autoUpdating: boolean = false;

    constructor(autoUpdate: boolean = true) {
        this.autoUpdating = autoUpdate;

        if (autoUpdate) {
            this._rafID = requestAnimationFrame(this._autoUpdate.bind(this));
        }
    }

    _autoUpdate() {
        this._rafID = requestAnimationFrame(this._autoUpdate.bind(this));

        const now = performance.now();
        const delta = (now - this._lastTime) / 1000;
        this._lastTime = now;

        this.update(delta);
    }

    setAutoUpdate(autoUpdate: boolean) {
        this.autoUpdating = autoUpdate;

        if (autoUpdate) {
            if (this._rafID < 0) {
                this._rafID = requestAnimationFrame(this._autoUpdate.bind(this));
            }
        } else {
            cancelAnimationFrame(this._rafID);
            this._rafID = -1;
        }
    }

    /**
     * Updates all zmooth objects
     * @param delta delta time in seconds
     */
    update(delta: number) {
        let i = this._zmooths.length;
        while (i-- > 0) {
            const zmooth = this._zmooths[i];

            if (zmooth.paused) {
                continue;
            }

            if (zmooth.alive) {
                zmooth.update(delta);
            } else {
                this._zmooths.splice(i, 1);
            }
        }
    }

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
    val<T extends number | number[]>(value: T, speed?: number, onChange?: (value: T) => void) {
        // FIXME
        // @ts-ignore
        const zmooth = Array.isArray(value) ? new ZmoothArray(value, speed, onChange) : new ZmoothNumber(value, speed, onChange);
        this._zmooths.push(zmooth);
        return zmooth;
    }

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
    prop<T extends Record<any, any>>(obj: T, propertyName: keyof T, speed?: number, onChange?: (value: any) => void): BaseZmooth<any> {
        return this.val(obj[propertyName], speed, (value: any) => {
            obj[propertyName] = value;
            onChange?.(value);
        });
    }

    /**
     * Kills a zmooth object
     * @param zmooth zmooth object to kill
     */
    kill(zmooth: BaseZmooth<unknown>) {
        zmooth.kill();
    }

    /**
     * Kills all zmooth objects
     */
    killAll() {
        let i = this._zmooths.length - 1;
        while (i-- > 0) {
            this._zmooths[i].kill();
        }

        this._zmooths = [];
    }

    /**
     * Destroys the zmooth manager
     */
    destroy() {
        this.killAll();

        cancelAnimationFrame(this._rafID);
    }
}
