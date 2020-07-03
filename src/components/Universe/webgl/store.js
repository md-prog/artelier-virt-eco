import { clamp } from "./math";

class Store {
    max = 1.4;
    min = 1;
    small = 1440;
    large = 1920;

    constructor() {
        const { small, large, min, max } = this;
        const resDif = max - min;

        const diff = large - small;
        const part = resDif / diff;
        const adjustment =
            window.innerWidth < 1024 ? 0 : resDif - clamp(window.screen.availWidth - small, 0, diff) * part;

        this.res = Math.min(window.devicePixelRatio, 1 + adjustment);
        this.ww = window.innerWidth;
        this.wh = window.innerHeight;
    }

    resize = () => {
        const { small, large, min, max } = this;
        const resDif = max - min;

        const diff = large - small;
        const part = resDif / diff;
        const adjustment =
            window.innerWidth < 1024 ? 0 : resDif - clamp(window.screen.availWidth - small, 0, diff) * part;

        this.res = Math.min(window.devicePixelRatio, 1 + adjustment);
        this.ww = window.innerWidth;
        this.wh = window.innerHeight;
    };
}

let store = null;

function getStore() {
    return (store = store || new Store());
}

export default getStore;
