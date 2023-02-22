import { ZmoothManager } from './ZmoothManager';

const globalManager = new ZmoothManager(true);

export default {
    inst: (autoUpdate?: boolean) => new ZmoothManager(autoUpdate),
    val: globalManager.val.bind(globalManager),
    prop: globalManager.prop.bind(globalManager),
    killAll: globalManager.killAll.bind(globalManager),
};
