import { TextureLoader } from "three";

class Loader {
    constructor() {
        this.loader = new TextureLoader();
    }

    load(img) {
        return new Promise(resolve => {
            this.loader.load(img, resolve);
        });
    }
}

export default new Loader();
