import { PerspectiveCamera, Scene } from "three";

class Workers {
    range = {
        section: 3,
        start: 0,
        end: 0.9,
    };

    constructor(renderer) {
        this.renderer = renderer;
        this.cam = new PerspectiveCamera(45, 1, 0, 1);
        this.scene = new Scene();
    }

    update = prog => {
        if (Math.abs(prog) === 1 || prog === 0) return;

        this.renderer.autoClear = true;
        this.renderer.render(this.scene, this.cam);
        this.renderer.autoClear = false;
    };
}

export default Workers;
