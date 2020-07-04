import {
    Object3D,
    WebGLCubeRenderTarget,
    RGBFormat,
    LinearMipmapLinearFilter,
    CubeCamera,
    MeshPhongMaterial,
    Color
} from "three";
import ModelManager from "./ModelManager";
import asteroid_models from "../../../models/asteroids2.gltf";

class Asteroids extends Object3D {
    constructor() {
        super();

        this.mm = new ModelManager();
    }

    load = async () => {
        const output = await this.mm.loadRaw(asteroid_models);

        output.scene.children.forEach(child => {
            child.children.forEach(mesh => {
                if (mesh.material.name.includes("white")) mesh.material.name = "white";
                if (mesh.material.name.includes("black")) mesh.material.name = "black";
            });
        });

        let asteroidCount = 90;
        const asteroids = output.scene.children;
        const { length } = asteroids;

        while (asteroidCount--) {
            const roid = asteroids[Math.floor(length * Math.random())].clone();

            roid.position.x = Math.random() * 200 - 100;
            roid.position.z = -Math.random() * 250 - 30;
            roid.position.y = -65 + 100 * Math.random();

            this.add(roid);
        }

        this.mm.proccessPretty(this);
    };

    update = () => {};

    glassify = () => {
        const cubeRenderTarget = new WebGLCubeRenderTarget( 1024, {
            format: RGBFormat,
            generateMipmaps: true,
            minFilter: LinearMipmapLinearFilter });
        this.cubeCamera = new CubeCamera(1, 100000, cubeRenderTarget);

        const matPink = new MeshPhongMaterial({
            color: 0xeb4a58,
            envMap: this.cubeCamera.renderTarget.texture,
            reflectivity: 0.6,
            shininess: 0.8,
            opacity: 0.8,
            transparent: true,
        });

        const matGreen = matPink.clone();
        matGreen.color = new Color(0x7efbd4);

        this.add(this.cubeCamera);

        let val = 0;

        this.children.forEach((child, i) => {
            if (i % 8 !== 0) return;
            const m = val++ % 2 === 0 ? matPink : matGreen;

            child.children.forEach(mesh => {
                mesh.material = m;
            });
        });
    };
}

export default Asteroids;
