import {
    Scene,
    AmbientLight,
    Object3D,
    Vector2,
    ShaderMaterial,
    WebGLRenderTarget,
    NearestFilter,
    CubeCamera,
    IcosahedronGeometry,
    Mesh,
    MeshStandardMaterial,
    Euler,
} from "three";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

import mainCamera from "../mainCamera";
import FlightPath from "../FlightPath";
import ModelManager from "../ModelManager";

import { easing, relativeProgress as rp, clamp } from "../math";

import spaceStation from "../../../../models/space_station.gltf";

import Stars from "../Stars";

import plainVert from "../shaders/plain.vert";

import depthVert from "../shaders/depth.vert";
import depthFrag from "../shaders/depth.frag";

import pixelSplit from "../shaders/pixelSplit.frag";

import PixelationComposer from "../PixelationComposer";

import TitlePlane from "../TitlePlane";
import titleImage from "../../../../images/titles/ThePopulation_2746x1000.png";

class Population {
    range = {
        start: 0,
        end: 1,
        section: 2,
    };

    animProg = 0;

    constructor(renderer) {
        this.renderer = renderer;
        this.cameraObject = mainCamera();
        this.camera = this.cameraObject.camera;
        this.scene = new Scene();

        this.scene.add(new AmbientLight(0xffffff, 10));
        this.scene.add(this.cameraObject);

        this.setupRender();

        this.mm = new ModelManager();

        this.loadModels(this.initScene);
        this.initFlight();
    }

    initScene = () => {
        this.stars = new Stars();
        this.stars.setRotation(new Euler(Math.PI, Math.PI, 0));
        this.scene.add(this.stars);
        this.createTitle();
    };

    createTitle = () => {
        this.titleText = new TitlePlane(titleImage);
        this.titleText.ratio = 2746 / 1000;
        this.titleText.setHeight(18);
        this.titleText.position.x = -140;
        this.titleText.position.y = -80;
        this.titleText.position.z = -150;

        this.titleText.rotation.x = -Math.PI;
        this.titleText.rotation.y = Math.PI * 0.5;
        this.titleText.rotation.z = -Math.PI;

        this.scene.add(this.titleText);
    };

    initFlight = () => {
        this.cameraObject.setPosition({ z: -150, x: -120, y: -80 });
        this.cameraObject.setOffset({ z: 40, x: 0, y: 0 });

        this.cameraObject.setRotation({ z: Math.PI, x: -Math.PI, y: Math.PI * 0.5 });
        this.cameraObject.setFov(45);

        this.fp = new FlightPath(this.cameraObject);

        this.fp.add({ type: "fov", val: 45, start: 0, end: 0, easing: easing.outSine });

        this.fp.add({
            type: "position",
            val: { z: 100 },
            start: 0.1,
            end: 0.5,
        });

        this.fp.add({
            type: "position",
            val: { x: -180 },
            start: 0.1,
            end: 0.5,
        });

        this.fp.add({
            type: "offset",
            val: { z: 20 },
            start: 0.1,
            end: 0.2,
            easing: easing.inOutSine,
        });

        this.fp.add({
            type: "offset",
            val: { z: 50 },
            start: 0.2,
            end: 0.29,
            easing: easing.inOutSine,
        });

        this.fp.add({
            type: "offset",
            val: { z: 20, x: 2 },
            start: 0.29,
            end: 1,
        });

        this.fp.add({
            type: "offset",
            val: { x: 5 },
            start: 0.0,
            end: 0.08,
            easing: easing.inOutQuart,
        });

        this.fp.add({
            type: "offset",
            val: { x: 0 },
            start: 0.08,
            end: 0.1,
            easing: easing.inSine,
        });

        this.fp.add({
            type: "rotation",
            val: { y: Math.PI * 0.5 + 0.15 },
            start: 0.0,
            end: 0.08,
            easing: easing.inOutQuart,
        });

        this.fp.add({
            type: "rotation",
            val: { y: Math.PI * 0.5 - Math.PI * 0.78 },
            start: 0.08,
            end: 0.3,
            easing: easing.inOutSine,
        });

        this.fp.finished();
    };

    loadModels = async callback => {
        const output = await this.mm.loadModel(spaceStation);

        this.middle = this.setupMiddle();
        this.ship = new Object3D();
        this.ship.add(this.middle);

        this.ship.position.x = -115;
        this.ship.position.z = -150;
        this.ship.position.y = -80;

        this.ship.rotation.y = Math.PI * 0.5 - Math.PI * 0.2;

        this.rings = [...output.scene.children];
        this.ship.add(...this.rings);
        this.scene.add(this.ship);

        callback();
    };

    setupMiddle = () => {
        this.cubeCamera = new CubeCamera(1, 100000, 1024);
        const geo = new IcosahedronGeometry(5, 0);
        const mat = new MeshStandardMaterial({
            color: 0x7526f5,
            envMap: this.cubeCamera.renderTarget.texture,
            metalness: 1,
            envMapIntensity: 5,
            refractionRatio: 1,
            roughness: 0,
        });

        const obj = new Object3D();
        const mesh = new Mesh(geo, mat);

        obj.add(this.cubeCamera);
        obj.add(mesh);

        obj.sphere = mesh;

        return obj;
    };

    handleSubs = subs => {
        const { length } = subs;

        const part = 1 / length;
        let prog = 0;
        let complete = true;
        subs.forEach(function(sub, i) {
            const { val } = sub;

            if (val > 0 && val <= 1) {
                prog = i * part + part * val;
            }

            if (val < 1) complete = false;
        });

        if (complete) prog = 1;

        return prog;
    };

    update = (prog, subSections) => {
        if (prog === 0) this.animProg = 0;
        if (Math.abs(prog) === 1) {
            this.animProg = clamp(prog, 0, 1);
            return;
        }
        if (!this.ship) return;

        const subProg = clamp(this.handleSubs(subSections) * 1.2, 0, 1);

        this.animProg += (subProg - this.animProg) * 0.1;

        const t = window.performance.now() * 0.0005;

        this.rings.forEach(function(ring, i) {
            ring.rotation.x = t * Math.sin(i) * Math.cos(i);
        });

        this.middle.sphere.rotation.x = t;
        this.middle.sphere.rotation.y = t;

        this.ship.position.z = -215 + 65 * rp(this.animProg, 0, 0.1) + 250 * rp(this.animProg, 0.1, 0.5);

        this.ship.position.x = -110 - 70 * rp(this.animProg, 0, 0.5);

        this.mm.update(this.renderer);
        this.fp.update(this.animProg);
        this.pixelProg = rp(this.animProg, 0.3, 1);
        const mult = this.pixelProg * 200 + 1;

        const w = Math.floor((window.innerWidth * window.devicePixelRatio) / mult);
        const h = Math.floor((window.innerHeight * window.devicePixelRatio) / mult);

        this.plainPass.material.uniforms.split.value = this.pixelProg;

        this.target.setSize(w, h);
        this.pixelationComposer.update(w, h, this.target.texture);

        this.render();
    };

    resize = () => {
        if (this.titleText) this.titleText.resize();

        this.prePixelComposer.setSize(window.innerWidth, window.innerHeight);
        this.simpleComposer.setSize(window.innerWidth, window.innerHeight);

        this.plainPass.material.uniforms.res.value = [window.innerWidth, window.innerHeight];
    };

    setupRender() {
        const sceneRender = new RenderPass(this.scene, this.camera);
        const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);

        bloomPass.threshold = 0;
        bloomPass.strength = 1.5;
        bloomPass.radius = 1;
        bloomPass.exposure = 1;

        this.bloomComposer = new EffectComposer(this.renderer);
        this.bloomComposer.setSize(window.innerWidth / 2, window.innerHeight / 2);
        this.bloomComposer.addPass(sceneRender);
        this.bloomComposer.addPass(bloomPass);
        this.bloomComposer.addPass(bloomPass);
        this.bloomComposer.renderToScreen = false;

        this.depthMaterial = new ShaderMaterial({
            vertexShader: depthVert,
            fragmentShader: depthFrag,
            defines: {},
        });

        this.pixelationComposer = new PixelationComposer(this.renderer);

        this.target = new WebGLRenderTarget(window.innerWidth * 0.2, window.innerHeight * 0.2, {
            minFilter: NearestFilter,
            magFilter: NearestFilter,
        });

        this.plainPass = new ShaderPass(
            new ShaderMaterial({
                uniforms: {
                    intex: {
                        value: null,
                    },
                    res: {
                        value: [window.innerWidth, window.innerHeight],
                    },
                    split: {
                        value: 0,
                    },
                },
                fragmentShader: pixelSplit,
                vertexShader: plainVert,
            })
        );

        this.prePixelComposer = new EffectComposer(this.renderer);
        this.prePixelComposer.setSize(window.innerWidth, window.innerHeight);
        this.prePixelComposer.addPass(sceneRender);

        this.prePixelComposer.renderToScreen = false;
        this.prePixelComposer.needsSwap = false;

        this.simpleComposer = new EffectComposer(this.renderer, this.target);
        this.simpleComposer.setSize(window.innerWidth, window.innerHeight);
        this.simpleComposer.addPass(this.plainPass);

        this.simpleComposer.renderToScreen = false;

        this.plainComposer = new EffectComposer(this.renderer);
        this.plainComposer.addPass(sceneRender);
    }

    renderBloom() {
        this.scene.traverse(this.darkenNonBloomed);
        this.bloomComposer.render();
        this.scene.traverse(this.restoreMaterial);
    }
    darkenNonBloomed(obj) {
        if (obj.darken) obj.setDark("plasma");
    }
    restoreMaterial(obj) {
        if (obj.darken) obj.setDark("plasma", false);
    }

    darkenSplit(obj) {
        if (obj.darken) obj.setDark("split");
    }
    restoreSplitDark(obj) {
        if (obj.darken) obj.setDark("split", false);
    }

    renderSplit() {
        this.scene.traverse(this.darkenSplit);
        this.middle.sphere.material.roughness = 1;
        this.splitComposer.render();
        this.splitComposer.swapBuffers();
        this.middle.sphere.material.roughness = 0;
        this.scene.traverse(this.restoreSplitDark);
    }

    renderSphere() {
        this.middle.sphere.visible = false;

        this.renderer.autoClear = true;
        this.cubeCamera.update(this.renderer, this.scene);
        this.renderer.autoClear = false;
        this.middle.sphere.visible = true;
    }

    render = () => {
        this.renderSphere();

        if (this.pixelProg > 0) {
            this.prePixelComposer.render();
            this.plainPass.uniforms.intex.value = this.prePixelComposer.renderTarget2.texture;

            this.simpleComposer.render();
            this.simpleComposer.swapBuffers();
            this.pixelationComposer.render();
        } else {
            this.plainComposer.render();
        }
    };
}

export default Population;
