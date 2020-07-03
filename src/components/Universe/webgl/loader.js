import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

class Loader {
    constructor() {
        this.loader = new GLTFLoader();
    }

    load = src => {
        if (!src) return;

        const arr = [].concat(src);
        const { length } = arr;
        const output = {};
        let loaded = 0;

        return new Promise(resolve => {
            arr.forEach(item => {
                this.loader.load(
                    item,
                    out => {
                        output[item] = out;
                        loaded++;
                        if (loaded === length) {
                            if (length === 1) resolve(out);
                            else resolve(output);
                        }
                    },
                    () => {},
                    () => {}
                );
            });
        });
    };
}

let _loader = null;

function loader() {
    return (_loader = _loader || new Loader());
}

export default loader;
