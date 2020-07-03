import { Object3D, Mesh, BufferGeometry, BufferAttribute, RawShaderMaterial } from "three";

import nebulaFrag from "./shaders/nebula.frag";
import panelVert from "./shaders/panel.vert";

class Nebula extends Object3D {
    alpha = 0;
    constructor() {
        super();

        this.genPlane();
    }

    genPlane = () => {
        const geometry = new BufferGeometry();

        const bl = [-1.0, -1.0];
        const br = [1.0, -1.0];
        const tl = [-1.0, 1.0];
        const tr = [1.0, 1.0];

        const vertices = new Float32Array([...bl, ...br, ...tl, ...tl, ...br, ...tr]);

        geometry.addAttribute("position", new BufferAttribute(vertices, 2));

        this.material = new RawShaderMaterial({
            uniforms: {
                res: {
                    value: [window.innerWidth, window.innerHeight],
                },
                time: {
                    value: window.performance.now(),
                },
                zMove: {
                    value: 0,
                },
                rot: {
                    value: 0,
                },
                color: {
                    value: 0,
                },
                alpha: {
                    value: 0,
                },
                bg: {
                    value: 0,
                },
            },
            fragmentShader: nebulaFrag,
            vertexShader: panelVert,
        });

        this.bloomMesh = new Mesh(geometry, this.material);

        this.bloomMesh.frustumCulled = false;
        this.bloomMesh.renderOrder = 99999;
        this.add(this.bloomMesh);
    };

    fade = alpha => {
        this.material.uniforms.alpha.value = alpha;
    };
    resize = (w, h) => {
        this.material.uniforms.res.value = [w, h];
    };

    update = (z, rot, color, planeProg) => {
        this.material.uniforms.zMove.value = -z;
        this.material.uniforms.color.value = color;
        this.material.uniforms.bg.value = planeProg;
        this.material.uniforms.time.value = window.performance.now() * 0.001;
    };
}

export default Nebula;
