"use strict";
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
  ZmoothArray: () => ZmoothArray,
  ZmoothNumber: () => ZmoothNumber,
  ZmoothObject: () => ZmoothObject,
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);

// src/BaseZmooth.ts
var BaseZmooth = class {
  _value;
  to;
  speed;
  _alive = true;
  paused = false;
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
  reset(value) {
    this._value = value;
    this.to = value;
  }
  smoothValue(from, to, delta) {
    return from + (to - from) * Math.max(0, Math.min(1, this.speed * delta));
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
  _zmooths = [];
  _lastTime = performance.now();
  _rafID = -1;
  autoUpdating = false;
  constructor(autoUpdate = true) {
    this.autoUpdating = autoUpdate;
    if (autoUpdate) {
      this._rafID = requestAnimationFrame(this._autoUpdate.bind(this));
    }
  }
  _autoUpdate() {
    this._rafID = requestAnimationFrame(this._autoUpdate.bind(this));
    const now = performance.now();
    const delta = (now - this._lastTime) / 1e3;
    this._lastTime = now;
    this.update(delta);
  }
  setAutoUpdate(autoUpdate) {
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
  update(delta) {
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
  val(value, speed, onChange) {
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
  prop(obj, propertyName, speed, onChange) {
    return this.val(obj[propertyName], speed, (value) => {
      obj[propertyName] = value;
      onChange?.(value);
    });
  }
  /**
   * Kills a zmooth object
   * @param zmooth zmooth object to kill
   */
  kill(zmooth) {
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
};

// src/ZmoothObject.ts
var ZmoothObject = class extends BaseZmooth {
  onChange;
  fieldNames;
  constructor(obj, fieldNames, speed, onChange) {
    super({ ...obj }, { ...obj }, speed);
    this.onChange = onChange;
    this.fieldNames = fieldNames || Object.keys(obj);
  }
  update(delta) {
    for (const fieldName of this.fieldNames) {
      this._value[fieldName] = this.smoothValue(this._value[fieldName], this.to[fieldName], delta);
    }
    this.onChange?.(this._value);
  }
};

// src/index.ts
var globalManager = new ZmoothManager(true);
var src_default = {
  inst: (autoUpdate) => new ZmoothManager(autoUpdate),
  val: globalManager.val.bind(globalManager),
  prop: globalManager.prop.bind(globalManager),
  killAll: globalManager.killAll.bind(globalManager),
  setAutoUpdate: (autoUpdate) => globalManager.setAutoUpdate(autoUpdate),
  update: (delta) => globalManager.update(delta)
};
