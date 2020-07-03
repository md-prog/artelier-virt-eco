import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

import { ShaderMaterial } from "three";

import plainVert from "./shaders/plain.vert";
import pixelFrag from "./shaders/pixel.frag";

class PixelationComposer extends EffectComposer {
    constructor(renderer) {
        super(renderer);

        const pixelMat = new ShaderMaterial({
            uniforms: {
                imageTex: {
                    value: null,
                },
                threshold: {
                    value: -1,
                },
                res: {
                    value: [0, 0],
                },
            },
            vertexShader: plainVert,
            fragmentShader: pixelFrag,
        });

        const pixelPass = new ShaderPass(pixelMat);

        super(renderer);

        this.mat = pixelMat;

        this.addPass(pixelPass);
        this.renderToScreen = true;
    }

    update(w, h, texture) {
        this.mat.uniforms.imageTex.value = texture;
        this.mat.uniforms.res.value = [w, h];
    }
}

export default PixelationComposer;
