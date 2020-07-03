import { ShaderMaterial } from "three";

import frag from "../shaders/plainModel.frag";
import vert from "../shaders/plainModel.vert";

class PlainMaterial extends ShaderMaterial {
    constructor(color = { r: 1, g: 1, b: 1 }) {
        const { r, g, b } = color;

        const props = {
            fragmentShader: frag,
            vertexShader: vert,

            uniforms: {
                time: {
                    value: 0,
                },
                color: {
                    value: [r, g, b],
                },
                light: {
                    value: [0, 0, 0],
                },
                isDark: {
                    value: false,
                },
            },
        };

        super(props);

        this.color = color;
    }

    setDark = (dark = true) => {
        this.uniforms.isDark.value = dark;
    };

    update = () => {
        this.uniforms.time.value = (window.performance.now() * 0.001) % 1;
    };
}

export default PlainMaterial;
