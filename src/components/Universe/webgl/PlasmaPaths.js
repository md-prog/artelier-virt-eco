import { ShaderMaterial, BufferGeometry, BufferAttribute, Points } from "three";

import vert from "./shaders/plasmaPaths.vert";
import frag from "./shaders/plasma.frag";

class Plasma extends Points {
    darken = true;

    constructor(outerPoints, potentialColors, texture) {
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
                    value: 3,
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
        const cPos = [];
        const data = [];
        const speed = [];
        const geometry = new BufferGeometry();
        let vertCount = 150;

        const colors = [];

        const potentials = potentialColors || [
            [0.97, 0.94, 0.71],
            [0.82, 0.76, 0.45],
            [0.97, 0.82, 0.36],
        ];

        const positions1 = [[0, Math.PI / 4]];
        const positions2 = [[Math.PI, (Math.PI / 4) * 3]];
        const total = 100;
        let count = total;

        while (count--) {
            const a1 = positions1[0][0] + (Math.random() - 0.5) * 0.3;
            const a2 = positions1[0][1] + (Math.random() - 0.5) * 0.3;
            positions1.push([a1, a2]);
        }

        count = total;

        while (count--) {
            const a1 = positions2[0][0] + (Math.random() - 0.5) * 0.3;
            const a2 = positions2[0][1] + (Math.random() - 0.5) * 0.3;
            positions2.push([a1, a2]);
        }

        function oordsFromAngle(theta, phi, rad) {
            const x = rad * Math.cos(theta) * Math.sin(phi);
            const z = rad * Math.sin(theta) * Math.sin(phi);
            const y = rad * Math.cos(phi);

            return [x, y, z];
        }
        const [theta, phi] = positions1[0];
        const center1 = oordsFromAngle(theta, phi, 60);
        const [theta2, phi2] = positions2[0];
        const center2 = oordsFromAngle(theta2, phi2, 60);

        const half = vertCount / 2;

        while (vertCount--) {
            const num = (vertCount % total) + 1;

            if (half < vertCount) {
                const [theta, phi] = positions1[num];
                const oords = oordsFromAngle(theta, phi, 60);

                verts.push(...oords);
                cPos.push(...center1);
            } else {
                const [theta, phi] = positions2[num];
                const oords = oordsFromAngle(theta, phi, 60);

                verts.push(...oords);
                cPos.push(...center2);
            }

            data.push(Math.random());

            speed.push(Math.random() - 0.5, Math.random() - 0.5);

            colors.push(...potentials[Math.floor(Math.random() * potentials.length)]);
        }

        const zeros = new Array(verts.length);

        zeros.fill(0);

        geometry.setAttribute("position", new BufferAttribute(new Float32Array(zeros), 3));
        geometry.setAttribute("cPos", new BufferAttribute(new Float32Array(cPos), 3));
        geometry.setAttribute("position2", new BufferAttribute(new Float32Array(verts), 3));
        geometry.setAttribute("data", new BufferAttribute(new Float32Array(data), 1));
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
        this.material.uniforms.time.value = window.performance.now() * 0.0001;
    };
}

export default Plasma;
