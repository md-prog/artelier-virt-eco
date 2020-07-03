import { Mesh, PlaneGeometry, ShaderMaterial } from "three";

import vert from "./shaders/landscape.vert";
import frag from "./shaders/landscape.frag";

class IntroLandscape extends Mesh {
    constructor() {
        const mat = new ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,

            uniforms: {
                time: {
                    value: 0,
                },
                lines: {
                    value: 0,
                },
                scroll: {
                    value: 0,
                },
                isDark: {
                    value: 1,
                },
            },
            extensions: {
                derivatives: true,
            },
            transparent: true,
            depthTest: true,
            depthWrite: true,
        });

        const geo = new PlaneGeometry(2, 2, 20, 20);

        super(geo, mat);

        this.position.y = 0.501;
        this.position.z = 0;
        this.rotation.x = -Math.PI * 0.5;

        this.renderOrder = 10;
    }

    darken = true;

    setDark = (type, dark = true) => {
        this.material.uniforms.isDark.value = dark ? 0 : 1;
    };

    update(val) {
        this.material.uniforms.lines.value = val;
        this.material.uniforms.time.value = window.performance.now() / 1000;
        this.material.uniforms.scroll.value = 1 - val;

        if (val === 1) this.visible = false;
        else this.visible = true;
    }
}

export default IntroLandscape;
