import { ZmoothManager } from './ZmoothManager';
export { ZmoothArray } from './ZmoothArray';
export { ZmoothNumber } from './ZmoothNumber';
export { ZmoothObject } from './ZmoothObject';

const globalManager = new ZmoothManager(true);

export default {
    inst: (autoUpdate?: boolean) => new ZmoothManager(autoUpdate),
    val: globalManager.val.bind(globalManager),
    prop: globalManager.prop.bind(globalManager),
    killAll: globalManager.killAll.bind(globalManager),
    setAutoUpdate: (autoUpdate: boolean) => globalManager.setAutoUpdate(autoUpdate),
    update: (delta: number) => globalManager.update(delta),
};
