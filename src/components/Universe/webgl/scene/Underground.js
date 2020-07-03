import {
    Scene,
    AmbientLight,
    Object3D,
    Vector2,
    ShaderMaterial,
    CubeCamera,
    MeshStandardMaterial,
    WebGLRenderTarget,
    NearestFilter,
} from "three";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

import mainCamera from "../mainCamera";
import FlightPath from "../FlightPath";
import ModelManager from "../ModelManager";

import { easing, relativeProgress as rp, clamp } from "../math";

import planet from "../../../../models/underground.gltf";

import Stars from "../Stars";
import Plasma from "../Plasma";

import ShardTexture from "../ShardTexture";

import plainVert from "../shaders/plain.vert";
import plainFrag from "../shaders/plain.frag";
import composeFrag from "../shaders/compose.frag";

import TitlePlane from "../TitlePlane";
import titleImage from "../../../../images/titles/TheUnderground_3160x1000.png";

import PixelationComposer from "../PixelationComposer";

class Underground {
    range = {
        section: 4,
        start: -0.1,
        end: 1,
    };

    animProg = 0;

    constructor(renderer) {
        this.renderer = renderer;
        this.cameraObject = mainCamera();
        this.camera = this.cameraObject.camera;
        this.scene = new Scene();

        this.scene.add(new AmbientLight(0xffffff, 10));
        this.scene.add(this.cameraObject);

        this.mm = new ModelManager(this.renderer);

        this.shardTexture = new ShardTexture(this.renderer);

        this.loadModels(this.initScene);
        this.initFlight();
        this.initRender();
    }

    createTitle = () => {
        this.titleText = new TitlePlane(titleImage);
        this.titleText.ratio = 3160 / 1000;
        this.titleText.position.y = 0;
        this.titleText.position.z = 15;
        this.titleText.position.x = -35;

        this.titleText.setHeight(6);
        this.titleText.rotation.y = Math.PI / 4;

        this.scene.add(this.titleText);
    };

    initScene = () => {
        this.stars = new Stars();

        this.createTitle();
        this.scene.add(this.stars);
    };

    loadModels = async callback => {
        function wrap(obj) {
            const temp = new Object3D();

            while (obj.children.length) {
                const wrapper = new Object3D();
                wrapper.add(obj.children.pop());
                temp.add(wrapper);
            }

            return temp;
        }

        const output = await this.mm.loadRaw(planet);

        this.left = output.scene.children[0];
        this.right = output.scene.children[1];
        const middle = output.scene.children[2];

        const allDark = true;

        this.mm.proccess(this.left, allDark);
        this.mm.proccess(this.right, allDark);

        this.left = wrap(this.left);
        this.right = wrap(this.right);

        this.planet = new Object3D();
        this.planet.add(this.left, this.right);
        this.planet.position.z = 50;

        this.middle = this.setupMiddle(middle);

        this.colors = [
            [0.01, 0.01, 0.01],
            [0.5, 0.5, 0.5],
        ];

        this.plasma = new Plasma(5, 2, this.colors, this.shardTexture.renderTarget2);

        this.planet.add(this.plasma);

        this.planet.add(this.middle);

        this.scene.add(this.planet);

        callback();
    };

    initFlight = () => {
        this.cameraObject.setPosition({ z: 25, x: -25, y: 0 });
        this.cameraObject.setRotation({ z: 0, y: Math.PI / 4, x: 0 });
        this.cameraObject.setFov(45);

        this.fp = new FlightPath(this.cameraObject);

        this.fp.add({ type: "fov", val: 45, start: 0, end: 0, easing: easing.outSine });

        this.fp.add({
            type: "position",
            val: { x: 0 },
            start: 0.0,
            end: 0.12,
            easing: easing.inOutQuart,
        });

        this.fp.add({
            type: "position",
            val: { z: 50 },
            start: 0.0,
            end: 0.12,
            easing: easing.inOutQuart,
        });

        this.fp.add({
            type: "offset",
            val: { x: 2.5 },
            start: 0.0,
            end: 0.12,
            easing: easing.inOutQuart,
        });

        this.fp.add({
            type: "offset",
            val: { x: 0 },
            start: 0.12,
            end: 0.18,
            easing: easing.inOutQuart,
        });

        this.fp.add({
            type: "offset",
            val: { z: 30 },
            start: 0.12,
            end: 0.28,
            easing: easing.inOutSine,
        });

        this.fp.add({
            type: "offset",
            val: { x: -9 },
            altVal: { x: 0 },
            start: 0.18,
            end: 0.28,
            easing: easing.inOutSine,
        });

        this.fp.add({
            type: "rotation",
            val: { y: -Math.PI * 2 },
            start: 0.05,
            end: 0.7,
            easing: easing.inOutSine,
        });

        this.fp.add({
            type: "position",
            val: { z: 0 },
            start: 0.7,
            end: 1,
            easing: easing.inSine,
        });

        this.fp.add({
            type: "offset",
            val: { z: 0 },
            start: 0.7,
            end: 1,
            easing: easing.inSine,
        });

        this.fp.add({
            type: "rotation",
            val: { y: -Math.PI * 2 - Math.PI / 4, x: -Math.PI / 4 },
            start: 0.8,
            end: 1,
            easing: easing.inSine,
        });

        this.fp.add({
            type: "offset",
            val: { x: 0 },
            start: 0.8,
            end: 1,
            easing: easing.inSine,
        }); //

        this.fp.finished();
    };

    setupMiddle = model => {
        this.cubeCamera = new CubeCamera(1, 100000, 1024);

        const mat = new MeshStandardMaterial({
            color: 0x050505,
            envMap: this.cubeCamera.renderTarget.texture,
            metalness: 1,
            envMapIntensity: 5,
            refractionRatio: 0.8,
            roughness: 0.1,
        });

        const obj = new Object3D();

        model.children.forEach(child => {
            child.material = mat;
        });

        obj.add(this.cubeCamera);
        obj.add(model);
        obj.shard = model;

        return obj;
    };

    resize = () => {
        if (this.titleText) this.titleText.resize();

        this.bloomComposer.setSize(window.innerWidth * 0.7, window.innerHeight * 0.7);
        this.modelComposer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);

        this.prePixelComposer.setSize(window.innerWidth, window.innerHeight);
        this.simpleComposer.setSize(window.innerWidth, window.innerHeight);

        this.bloomPass.resolution = new Vector2(window.innerWidth, window.innerHeight);
    };

    initRender = () => {
        const sceneRender = new RenderPass(this.scene, this.camera);

        const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);

        bloomPass.threshold = 0;
        bloomPass.strength = 1.5;
        bloomPass.radius = 1;
        bloomPass.exposure = 1;

        this.bloomPass = bloomPass;
        this.bloomComposer = new EffectComposer(this.renderer);
        this.bloomComposer.setSize(window.innerWidth * 0.7, window.innerHeight * 0.7);
        this.bloomComposer.addPass(sceneRender);
        this.bloomComposer.addPass(bloomPass);
        this.bloomComposer.addPass(bloomPass);
        this.bloomComposer.renderToScreen = false;

        this.modelComposer = new EffectComposer(this.renderer);
        this.modelComposer.setSize(window.innerWidth, window.innerHeight);
        this.modelComposer.addPass(sceneRender);
        this.modelComposer.renderToScreen = false;

        const composePass = new ShaderPass(
            new ShaderMaterial({
                uniforms: {
                    intex: {
                        value: null,
                    },
                    bloomTexture: { value: this.bloomComposer.renderTarget2.texture },
                },
                fragmentShader: composeFrag,
                vertexShader: plainVert,
                transparent: true,
            }),
            "intex"
        );

        this.pixelationComposer = new PixelationComposer(this.renderer);

        this.composer = new EffectComposer(this.renderer, this.pixelationComposer.inputTexture);
        this.composer.setSize(window.innerWidth, window.innerHeight);
        this.composer.addPass(sceneRender);
        this.composer.addPass(composePass);

        this.composer.renderToScreen = true;

        this.target = new WebGLRenderTarget(window.innerWidth * 0.2, window.innerHeight * 0.2, {
            minFilter: NearestFilter,
            magFilter: NearestFilter,
        });

        this.pre = new WebGLRenderTarget(window.innerWidth, window.innerHeight, {
            minFilter: NearestFilter,
            magFilter: NearestFilter,
        });

        this.plainPass = new ShaderPass(
            new ShaderMaterial({
                uniforms: {
                    intex: {
                        value: null,
                    },
                },
                fragmentShader: plainFrag,
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
    };

    handleSubs = subs => {
        const { length } = subs;

        let prog = 0;

        const last = length - 1;

        const p = subs[0].data.animY;
        const start = subs[0].data.start;
        const firstEnd = subs[0].data.end;

        const end = subs[last].data.end;

        prog = 0.025 + rp(p, start, firstEnd) * 0.025;
        prog += rp(p, firstEnd, end) * 0.95;

        return prog;
    };

    update = (p, subSections) => {
        if (p === 0) return (this.animProg = 0);
        if (Math.abs(p) === 1) {
            this.animProg = clamp(p, 0, 1);
            return;
        }
        if (!this.planet) return;

        let subProg = this.handleSubs(subSections);

        if (p < 0.1) this.animProg = rp(p, 0, 0.1) * 0.025;
        else this.animProg = subProg;

        this.fp.update(this.animProg);

        if (this.animProg < 0.142) this.titleText.show();
        else this.titleText.hide();

        this.plasma.update();

        const t = window.performance.now() * 0.001;

        this.middle.rotation.y = -t * 0.2;

        this.right.children.forEach((child, i) => {
            child.position.z = -Math.random() * 0.05;
            child.children[0].rotation.x = Math.random() * 0.02 - 0.01;
            child.children[0].rotation.z = Math.random() * 0.02 - 0.01;
        });

        this.left.children.forEach((child, i) => {
            child.position.z = Math.random() * 0.05;
            child.children[0].rotation.x = Math.random() * 0.02 - 0.01;
            child.children[0].rotation.z = Math.random() * 0.02 - 0.01;
        });

        this.planet.rotation.y = t * 0.1;

        this.pixelProg = rp(this.animProg, 0.05, 0.0);
        const mult = this.pixelProg * 100 + 1;

        const w = Math.floor(window.innerWidth / mult);
        const h = Math.floor(window.innerHeight / mult);

        this.target.setSize(w, h);
        this.pixelationComposer.update(w, h, this.target.texture);
        this.mm.update(this.renderer);
        this.render();
    };

    renderMiddle() {
        this.middle.shard.visible = false;
        this.renderer.autoClear = true;
        this.cubeCamera.update(this.renderer, this.scene);
        this.renderer.autoClear = false;

        this.middle.shard.visible = true;
    }

    darkenNonBloomed(obj) {
        if (obj.darken) obj.setDark("plasma");
    }

    restoreMaterial(obj) {
        if (obj.darken) obj.setDark("plasma", false);
    }

    renderBloom() {
        this.scene.traverse(this.darkenNonBloomed);
        this.bloomComposer.render();
        this.scene.traverse(this.restoreMaterial);
    }

    render = () => {
        if (this.pixelProg > 0) {
            this.prePixelComposer.render();
            this.plainPass.uniforms.intex.value = this.prePixelComposer.renderTarget2.texture;
            this.simpleComposer.render();
            this.simpleComposer.swapBuffers();
            this.pixelationComposer.render();
        } else {
            this.renderBloom();
            this.composer.render();
            this.composer.swapBuffers();
            this.renderMiddle();
        }

        return;
    };
}

export default Underground;
