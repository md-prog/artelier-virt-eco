import { ShaderMaterial } from "three";

import frag from "../shaders/dark.frag";

import vert from "../shaders/plainModel.vert";

class DarkMaterial extends ShaderMaterial {
    constructor() {
        const props = {
            fragmentShader: frag,
            vertexShader: vert,

            uniforms: {
                time: {
                    value: 0,
                },
                isDark: {
                    value: false,
                },
                light: {
                    value: [0, 0, 0],
                },
            },
        };

        super(props);
    }

    setDark = (dark = true) => {
        this.uniforms.isDark.value = dark;
    };

    update = () => {
        this.uniforms.time.value = (window.performance.now() * 0.001) % 1;
    };
}

export default DarkMaterial;
