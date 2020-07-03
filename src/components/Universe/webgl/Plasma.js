import { ShaderMaterial, BufferGeometry, BufferAttribute, Points } from "three";

import vert from "./shaders/plasma.vert";
import frag from "./shaders/plasma.frag";

class Plasma extends Points {
    darken = true;

    constructor(rad, scale, potentialColors, texture) {
        const material = new ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            uniforms: {
                time: {
                    value: 0,
                },
                dark: {
                    value: 1,
                },
                scale: {
                    value: scale,
                },
                tDiffuse: {
                    value: texture,
                },
                black: {
                    value: 1,
                },
            },
            transparent: true,
        });

        const verts = [];
        const data = [];
        const speed = [];
        const geometry = new BufferGeometry();
        let vertCount = 200;

        const colors = [];

        const potentials = potentialColors || [
            [0.97, 0.94, 0.71],
            [0.82, 0.76, 0.45],
            [0.97, 0.82, 0.36],
        ];

        while (vertCount--) {
            const theta = Math.PI * 2 * Math.random();
            const phi = Math.PI * Math.random();
            const radius = rad * Math.random();

            const x = radius * Math.cos(theta) * Math.sin(phi);
            const y = radius * Math.sin(theta) * Math.sin(phi);
            const z = radius * Math.cos(phi);

            verts.push(x, y, z);

            data.push(theta, phi, radius);
            speed.push(Math.random() - 0.5, Math.random() - 0.5);

            colors.push(...potentials[Math.floor(Math.random() * potentials.length)]);
        }

        geometry.setAttribute("position", new BufferAttribute(new Float32Array(verts), 3));
        geometry.setAttribute("data", new BufferAttribute(new Float32Array(verts), 3));
        geometry.setAttribute("color", new BufferAttribute(new Float32Array(colors), 3));
        geometry.setAttribute("speed", new BufferAttribute(new Float32Array(speed), 2));

        super(geometry, material);

        this.bloom = true;
        this.material = material;
    }

    black = isBlack => {
        this.material.uniforms.black.value = isBlack ? 0 : 1;
    };

    setDark = (type, dark = true) => {
        if (type !== "plasma") {
            this.material.uniforms.dark.value = dark ? 0 : 1;
        }
    };

    update = () => {
        this.material.uniforms.time.value = window.performance.now() * 2;
    };
}

export default Plasma;
