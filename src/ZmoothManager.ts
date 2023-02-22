import { BaseZmooth } from './BaseZmooth';
import { ZmoothArray } from './ZmoothArray';
import { ZmoothNumber } from './ZmoothNumber';

export class ZmoothManager {
    private zmooths: BaseZmooth<unknown>[] = [];
    private lastTime = performance.now();
    private rafID: number = -1;

    constructor(autoUpdate: boolean = true) {
        if (autoUpdate) {
            this.rafID = requestAnimationFrame(this.autoUpdate.bind(this));
        }
    }

    autoUpdate() {
        const now = performance.now();
        const delta = (now - this.lastTime) / 1000;
        this.lastTime = now;

        this.update(delta);

        this.rafID = requestAnimationFrame(this.autoUpdate.bind(this));
    }

    /**
     * Update all zmooth objects
     * @param delta delta time in seconds
     */
    update(delta: number) {
        let i = this.zmooths.length;
        while (i-- > 0) {
            const zmooth = this.zmooths[i];

            if (zmooth.alive) {
                zmooth.update(delta);
            } else {
                this.zmooths.splice(i, 1);
            }
        }
    }

    /**
     * Smooth a value to its destination value
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
    val<T extends number | number[]>(value: T, speed?: number, onChange?: (value: T) => void) {
        // FIXME
        // @ts-ignore
        const zmooth = Array.isArray(value) ? new ZmoothArray(value, speed, onChange) : new ZmoothNumber(value, speed, onChange);
        this.zmooths.push(zmooth);
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
     * Kill a zmooth object
     * @param zmooth zmooth object to kill
     */
    kill(zmooth: BaseZmooth<unknown>) {
        zmooth.kill();
    }

    /**
     * Kill all zmooth objects
     */
    killAll() {
        let i = this.zmooths.length - 1;
        while (i-- > 0) {
            this.zmooths[i].kill();
        }

        this.zmooths = [];
    }

    /**
     * Destroy the zmooth manager
     */
    destroy() {
        this.killAll();

        cancelAnimationFrame(this.rafID);
    }
}
