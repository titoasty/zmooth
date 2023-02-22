"use strict";
var zmooth = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    default: () => src_default
  });

  // src/BaseZmooth.ts
  var BaseZmooth = class {
    _value;
    to;
    speed;
    _alive = true;
    constructor(value, to, speed = 1) {
      this._value = value;
      this.to = to;
      this.speed = speed;
    }
    kill() {
      this._alive = false;
    }
    get value() {
      return this._value;
    }
    get alive() {
      return this._alive;
    }
    smoothValue(from, to, delta) {
      return from + (to - from) * this.speed * delta;
    }
  };

  // src/ZmoothArray.ts
  var ZmoothArray = class extends BaseZmooth {
    onChange;
    constructor(value = [], speed, onChange) {
      super(value, value, speed);
      this.onChange = onChange;
    }
    update(delta) {
      let i = this._value.length;
      while (i-- > 0) {
        this._value[i] = this.smoothValue(this._value[i], this.to[i], delta);
      }
      this.onChange?.(this._value);
    }
  };

  // src/ZmoothNumber.ts
  var ZmoothNumber = class extends BaseZmooth {
    onChange;
    constructor(value = 0, speed = 1, onChange) {
      super(value, value, speed);
      this.onChange = onChange;
    }
    update(delta) {
      this._value = this.smoothValue(this._value, this.to, delta);
      this.onChange?.(this._value);
    }
  };

  // src/ZmoothManager.ts
  var ZmoothManager = class {
    zmooths = [];
    lastTime = performance.now();
    rafID = -1;
    constructor(autoUpdate = true) {
      if (autoUpdate) {
        this.rafID = requestAnimationFrame(this.autoUpdate.bind(this));
      }
    }
    autoUpdate() {
      const now = performance.now();
      const delta = (now - this.lastTime) / 1e3;
      this.lastTime = now;
      this.update(delta);
      this.rafID = requestAnimationFrame(this.autoUpdate.bind(this));
    }
    /**
     * Update all zmooth objects
     * @param delta delta time in seconds
     */
    update(delta) {
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
    val(value, speed, onChange) {
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
    prop(obj, propertyName, speed, onChange) {
      return this.val(obj[propertyName], speed, (value) => {
        obj[propertyName] = value;
        onChange?.(value);
      });
    }
    /**
     * Kill a zmooth object
     * @param zmooth zmooth object to kill
     */
    kill(zmooth) {
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
  };

  // src/index.ts
  var globalManager = new ZmoothManager(true);
  var src_default = {
    inst: (autoUpdate) => new ZmoothManager(autoUpdate),
    val: globalManager.val.bind(globalManager),
    prop: globalManager.prop.bind(globalManager),
    killAll: globalManager.killAll.bind(globalManager)
  };
  return __toCommonJS(src_exports);
})();
zmooth = zmooth.default;
//# sourceMappingURL=zmooth.js.map