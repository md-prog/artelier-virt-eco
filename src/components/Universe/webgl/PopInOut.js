import { easing, clamp } from "./math";

class PopInOut {
    active = false;
    prog = 0;
    val = 0;
    target = 0;
    startTime = 0;
    currentTime = 0;
    animTime = 1000;
    ease = null;

    constructor(obj) {
        this.obj = obj;
        this.obj.visible = false;
        this.obj.scale.x = 0;
        this.obj.scale.y = 0;
        this.obj.scale.z = 0;
    }

    on = t => {
        this.startTime = t;
        this.active = true;
        this.target = 1;
        this.ease = easing.outBack;
        this.obj.visible = true;
    };

    off = t => {
        this.startTime = t;
        this.active = true;
        this.target = 0;
        this.ease = easing.outSine;
    };

    update = t => {
        if (!this.active) return;

        const { startTime, animTime, ease, target } = this;

        const prog = clamp((t - startTime) / animTime, 0, 1);
        const val = target === 0 ? 1 - prog : prog;

        const eased = ease(val);

        this.obj.scale.x = eased;
        this.obj.scale.y = eased;
        this.obj.scale.z = eased;

        this.prog = prog;
        this.val = val;

        if (this.prog === 1) this.active = false;

        if (target === 0 && this.val === 0) this.obj.visible = false;
    };
}

export default PopInOut;
