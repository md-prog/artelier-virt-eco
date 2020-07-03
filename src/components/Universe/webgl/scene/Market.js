import {
    Scene,
    AmbientLight,
    Object3D,
    Vector3,
    Vector2,
    Euler,
    BufferGeometry,
    Mesh,
    RawShaderMaterial,
    BufferAttribute,
} from "three";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";

import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

import mainCamera from "../mainCamera";
import FlightPath from "../FlightPath";
import ModelManager from "../ModelManager";

import { easing, relativeProgress as clamp } from "../math";

import planet_b from "../../../../models/planet_ring_6.gltf";
import planet_a from "../../../../models/market_a.gltf";

import Asteroids from "../Asteroids";

import Stars from "../Stars";
import Plasma from "../Plasma";
import PlasmaPaths from "../PlasmaPaths";

import bloomFrag from "../shaders/bloom.frag";
import panelVert from "../shaders/panel.vert";

import TitlePlane from "../TitlePlane";
import titleImage from "../../../../images/titles/TheMarketplacs_3320x1002.png";
import titlePopulationImage from "../../../../images/titles/ThePopulation_2746x1000.png";

import getStore from "../store";

import ShardTexture from "../ShardTexture";

class Market {
    range = {
        start: 0,
        end: 1,
        section: 1,
    };

    animProg = 0;

    white = 0;

    startWhite = 0;
    whiteVal = 0;
    lastWhiteVal = 0;
    animWhiteVal = 0;

    res = 1;
    bloomSize = 0.8;

    runBloom = true;

    constructor(renderer, loadedFn) {
        this.store = getStore();
        this.loadedFn = loadedFn;
        this.renderer = renderer;
        this.cameraObject = mainCamera();
        this.camera = this.cameraObject.camera;
        this.scene = new Scene();

        this.scene.add(new AmbientLight(0xffffff, 10));
        this.scene.add(this.cameraObject);

        this.setupRender();

        this.mm = new ModelManager();

        this.shardTexture = new ShardTexture(this.renderer);

        this.loadModels(this.initScene);
    }

    genBloomPlane = () => {
        const geometry = new BufferGeometry();

        const bl = [-1.0, -1.0];
        const br = [1.0, -1.0];
        const tl = [-1.0, 1.0];
        const tr = [1.0, 1.0];

        const vertices = new Float32Array([...bl, ...br, ...tl, ...tl, ...br, ...tr]);

        geometry.addAttribute("position", new BufferAttribute(vertices, 2));

        const resolution = new Vector2();
        this.renderer.getDrawingBufferSize(resolution);

        const material = new RawShaderMaterial({
            fragmentShader: bloomFrag,
            vertexShader: panelVert,
            uniforms: {
                tDiffuse: {
                    value: null,
                },
                res: { value: resolution },
                whiteVal: {
                    value: 0,
                },
            },

            transparent: true,
            depthTest: false,
        });

        this.bloomMesh = new Mesh(geometry, material);

        this.bloomMesh.frustumCulled = false;
        this.bloomMesh.renderOrder = 99999;
        this.scene.add(this.bloomMesh);
    };

    initScene = () => {
        this.stars = new Stars();
        this.stars.setRotation(new Euler(Math.PI, Math.PI, 0));
        this.scene.add(this.stars);
        this.createTitle();
        this.genBloomPlane();
        this.initFlight();

        this.update(0.5, []);
        this.loadedFn();
    };

    loadModels = async callback => {
        const output_b = await this.mm.loadModel(planet_b);
        const output_a = await this.mm.loadModel(planet_a);

        this.asteroids = new Asteroids();
        this.asteroids.load();

        this.planet_a = new Object3D();
        this.planet_b = new Object3D();

        this.plasma_a = new Plasma(4, 3, false, this.shardTexture.renderTarget2.texture);
        this.plasma_b = new Plasma(8, 3, false, this.shardTexture.renderTarget2.texture);
        this.plasmaPaths = new PlasmaPaths([], false, this.shardTexture.renderTarget2.texture);

        this.planet_a.add(this.plasma_a);
        this.planet_b.add(this.plasma_b, this.plasmaPaths);

        this.ring1 = output_b.scene.children[0];
        this.ring2 = output_b.scene.children[1];

        this.ring1.children = this.ring1.children.filter(function(_, i) {
            return i % 2 === 0;
        });

        this.ring2.children = this.ring2.children.filter(function(_, i) {
            return i % 2 === 0;
        });

        this.ring1.children.forEach((child, i) => {
            child.position.x += (Math.random() - 0.5) * 3;
            child.position.y += (Math.random() - 0.5) * 3;
            child.position.z += (Math.random() - 0.5) * 3;
        });

        this.ring2.children.forEach((child, i) => {
            child.position.x += (Math.random() - 0.5) * 3;
            child.position.y += (Math.random() - 0.5) * 3;
            child.position.z += (Math.random() - 0.5) * 3;
        });

        this.planet_b.add(this.ring1, this.ring2);

        const child = output_a.scene.children[0];

        this.planet_a.add(...child.children);
        this.planet_a.children.forEach(child => {
            const mult = 3;
            child.position.x *= mult * 1.5;
            child.position.y *= mult * 1.5;
            child.position.z *= mult * 1.5;
            child.scale.x *= mult;
            child.scale.y *= mult;
            child.scale.z *= mult;
        });

        this.planet_a.position.x = 0;
        this.planet_a.position.y = 90;
        this.planet_a.position.z = 50;

        this.planet_b.position.z = 100;
        this.planet_b.position.y = -40;
        this.planet_b.position.x = 80;

        this.scene.add(this.planet_b, this.planet_a, this.asteroids);

        callback();
    };

    createTitle = () => {
        this.titleText = new TitlePlane(titleImage);
        this.titleText.ratio = 3320 / 1002;
        this.titleText.setHeight(24);
        this.titleText.position.y = 220;
        this.titleText.position.z = 50;
        this.titleText.position.x = 0;
        this.titleText.rotation.x = Math.PI / 2;
        this.titleText.rotation.z = -Math.PI;

        this.populationText = new TitlePlane(titlePopulationImage);

        this.populationText.ratio = 2746 / 1000;
        this.populationText.setHeight(18);
        this.populationText.position.x = -140;
        this.populationText.position.y = -80;
        this.populationText.position.z = -150;
        this.populationText.rotation.x = -Math.PI;
        this.populationText.rotation.y = Math.PI * 0.5;
        this.populationText.rotation.z = -Math.PI;

        this.scene.add(this.titleText, this.populationText);
    };

    initFlight = () => {
        this.cameraObject.setPosition({ x: 0, y: 200, z: 0 });
        this.cameraObject.setRotation({ x: -Math.PI / 2, y: 2 * Math.PI, z: Math.PI / 2 });
        this.cameraObject.setFov(45);

        this.fp = new FlightPath(this.cameraObject);

        const parts = 11;

        function part(val) {
            return (1 / parts) * val;
        }

        this.fp.add({ type: "fov", val: 45, start: 0, end: 0, easing: easing.outSine });

        // - inital rotation and movement to title
        this.fp.add({
            type: "rotation",
            val: { z: Math.PI },
            start: 0,
            end: part(1),
            easing: easing.outSine,
        });
        this.fp.add({
            type: "position",
            val: { x: 0, y: 120, z: 50 },
            start: 0,
            end: part(1),
            easing: easing.inOutQuart,
        });

        // - movement from title to middle of first planet
        this.fp.add({
            type: "position",
            val: { y: 80 },
            start: part(1),
            end: part(1.5),
            easing: easing.inOutQuart,
        });

        this.fp.add({
            type: "position",
            val: { z: 0 },
            start: part(1),
            end: part(1.99),
            easing: easing.inOutSine,
        });

        this.fp.add({
            type: "rotation",
            val: { x: -Math.PI },
            start: part(1.2),
            end: part(1.8),
            easing: easing.inOutSine,
        });

        this.fp.add({
            type: "position",
            val: { z: 50 },
            start: part(1.99),
            end: part(2),
        });

        this.fp.add({
            type: "offset",
            val: { z: 50 }, //, x: -30 },
            start: part(1.99),
            end: part(2),
        });

        this.fp.add({
            type: "position",
            val: { x: 0, y: 90 },
            start: part(1.5),
            end: part(1.8),
            easing: easing.inOutSine,
        });

        this.fp.add({
            type: "offset",
            val: { z: 90, x: 30 }, //, x: -30 },
            altVal: { z: 90, x: 0 },
            start: part(2),
            end: part(3),
            easing: easing.inOutQuart,
        });

        this.fp.add({
            type: "rotation",
            val: { x: -Math.PI - 0.3 },
            start: part(2),
            end: part(3),
            easing: easing.inOutSine,
        });

        this.fp.add({
            type: "rotation",
            val: { y: 0 },
            start: part(2),
            end: part(7),
            easing: easing.inOutSine,
        });

        this.fp.add({
            type: "rotation",
            val: { x: -Math.PI + 0.3 },
            start: part(3),
            end: part(4.5),
            easing: easing.inOutSine,
        });

        this.fp.add({
            type: "position",
            val: { x: 80, y: -40, z: 100 },
            start: part(4.5),
            end: part(5.5),
            easing: easing.inOutSine,
        });

        this.fp.add({
            type: "rotation",
            val: { x: -Math.PI - 0.3 },
            start: part(4.5),
            end: part(5.5),
            easing: easing.inOutSine,
        });

        this.fp.add({
            type: "offset",
            val: { x: -20, z: 70 },
            altVal: { x: 0, z: 70 },
            start: part(4.2),
            end: part(5.8),
            easing: easing.inOutSine,
        });

        this.fp.add({
            type: "rotation",
            val: { x: -Math.PI + 0.3 },
            start: part(5.5),
            end: part(7),
            easing: easing.inOutSine,
        });

        // asteroid in

        this.fp.add({
            type: "offset",
            val: { z: 0, x: 0 },
            start: part(7),
            end: part(8.5),
            easing: easing.inOutSine,
        });

        this.fp.add({
            type: "position",
            val: { z: -250, x: 100, y: 0 },
            start: part(7),
            end: part(8.5),
            easing: easing.inOutSine,
        });

        this.fp.add({
            type: "position",
            val: { x: -80, y: -80, z: -150 },
            start: part(8.5),
            end: 1,
            easing: easing.inOutSine,
        });

        this.fp.add({
            type: "rotation",
            val: { y: Math.PI * 0.3, x: -Math.PI * 1.05 },
            start: part(7),
            end: part(8.5),
            easing: easing.inOutSine,
        });

        this.fp.add({
            type: "rotation",
            val: { y: Math.PI * 0.5 },
            start: part(8.5),
            end: 1,
            easing: easing.inOutSine,
        });

        // astroid out

        this.fp.add({
            type: "rotation",
            val: { x: -Math.PI * 0.75 },
            start: part(8.5),
            end: part(10.5),
            easing: easing.inOutSine,
        });

        this.fp.add({
            type: "rotation",
            val: { x: -Math.PI },
            start: part(10.5),
            end: part(11),
            easing: easing.inOutSine,
        });

        this.fp.finished();
    };

    update = (prog, subSections) => {
        if (prog === 0) this.animProg = 0;
        if (Math.abs(prog) === 1) {
            this.animProg = clamp(prog, 0, 1);
            return;
        }
        if (!this.planet_b) return;

        const subProg = this.handleSubs(subSections);

        this.animProg += (subProg - this.animProg) * 0.1;

        const t = window.performance.now() * 0.0005;

        this.planet_b.rotation.y = Math.PI * 0.5 + t * 0.2;
        this.planet_a.rotation.y = Math.PI * 0.5 + t * 0.2;
        this.planet_a.rotation.x = Math.PI * 0.5 + t * 0.2;

        this.ring2.rotation.y = -t * 0.3;
        this.ring1.setRotationFromAxisAngle(new Vector3(1, 0, 0), t * 0.2);

        this.ring1.children.forEach((child, i) => {
            if (i % 2 === 0) return;
            child.rotation.x = t * Math.sin(i);
            child.rotation.y = t * Math.cos(i);
        });

        this.ring2.children.forEach((child, i) => {
            if (i % 2 === 0) return;
            child.rotation.x = t * Math.sin(i);
            child.rotation.y = t * Math.cos(i);
        });

        this.asteroids.children.forEach((child, i) => {
            child.rotation.x = t * Math.sin(i);
            child.rotation.y = t * Math.cos(i);
        });

        this.mm.update(this.renderer);

        this.plasma_a.update();
        this.plasma_b.update();
        this.plasmaPaths.update();

        this.fp.update(this.animProg);

        const part = 1 / 11;

        if (this.animProg > part * 3) this.titleText.hide();
        else this.titleText.show();

        if (this.animProg > part * 5.5) this.planet_a.visible = false;
        else this.planet_a.visible = true;

        if (this.animProg < part * 4.5 || this.animProg > part * 9) this.planet_b.visible = false;
        else this.planet_b.visible = true;

        if (this.animProg > 0.97) {
            this.populationText.show();
        } else {
            this.populationText.hide();
        }

        if (this.animProg < part * 7) {
            this.asteroids.visible = false;
        } else {
            this.asteroids.visible = true;
            this.renderer.autoClear = true;
            this.asteroids.update(this.renderer, this.scene);
            this.renderer.autoClear = false;
        }

        if (this.animProg < part * 8) {
            this.runBloom = true;
        } else this.runBloom = false;

        this.render();
    };

    handleSubs = subs => {
        const { innerHeight: height } = window;
        const { length } = subs;

        let move = 0;
        const part = 1 / length;
        let prog = 0;
        let complete = true;
        subs.forEach(function(sub, i) {
            const { data, val } = sub;
            const { start, end, y, white } = data;

            if (val > 0 && val <= 1) {
                prog = i * part + part * val;

                if (white) {
                    move = clamp(((y - start) / height) * 1.5, 0, 1);
                    move += clamp(((y - (end - height / 1.5)) / height) * 1.5, 0, 1);
                }
            }

            if (val < 1) complete = false;
        });

        if (complete) prog = 1;

        this.whiteVal = move;

        this.bloomMesh.material.uniforms.whiteVal.value = move;
        return prog;
    };

    resize = () => {
        const resolution = new Vector2();
        this.renderer.getDrawingBufferSize(resolution);

        const ww = resolution.x;
        const wh = resolution.y;

        if (this.titleText) this.titleText.resize();
        if (this.populationText) this.populationText.resize();
        this.bloomComposer.setSize(ww * this.bloomSize, wh * this.bloomSize);

        this.whiteComposer.setSize(ww, wh);
        this.simpleComposer.setSize(ww, wh);

        this.bloomPass.resolution = new Vector2(ww, wh);
        if (this.bloomMesh) this.bloomMesh.material.uniforms.res.value = new Vector2(ww, wh);
    };

    setupRender() {
        const resolution = new Vector2();
        this.renderer.getDrawingBufferSize(resolution);

        const ww = resolution.x;
        const wh = resolution.y;

        const sceneRender = new RenderPass(this.scene, this.camera);
        const bloomPass = new UnrealBloomPass(new Vector2(ww, wh), 1.5, 0.4, 0.85);

        bloomPass.threshold = 0;
        bloomPass.strength = 2;
        bloomPass.radius = 1;
        bloomPass.exposure = 2;

        this.bloomPass = bloomPass;

        this.bloomComposer = new EffectComposer(this.renderer);
        this.bloomComposer.setSize(ww * this.bloomSize, wh * this.bloomSize);
        this.bloomComposer.addPass(sceneRender);
        this.bloomComposer.addPass(bloomPass);
        this.bloomComposer.addPass(bloomPass);
        this.bloomComposer.renderToScreen = false;

        this.whiteComposer = new EffectComposer(this.renderer);
        this.whiteComposer.setSize(ww, wh);

        const whitePass = new RenderPass(this.scene, this.camera);

        this.whiteComposer.addPass(whitePass);
        this.whiteComposer.renderToScreen = true;

        this.simpleComposer = new EffectComposer(this.renderer);
        this.simpleComposer.addPass(sceneRender);
    }

    renderBloom() {
        this.bloomMesh.visible = false;
        this.scene.traverse(this.darkenNonBloomed);
        this.bloomComposer.render();
        this.scene.traverse(this.restoreMaterial);
        this.bloomMesh.visible = true;
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
        this.splitComposer.render();
        this.splitComposer.swapBuffers();
        this.scene.traverse(this.restoreSplitDark);
    }

    renderWhite = () => {
        this.stars.visible = false;
        this.plasma_a.black(true);
        this.plasma_b.black(true);
        this.plasmaPaths.black(true);

        this.renderer.setClearColor(0xffffff);
        this.whiteComposer.render();
        this.renderer.setClearColor(0x000000);

        this.stars.visible = true;

        this.plasma_a.black(false);
        this.plasma_b.black(false);
        this.plasmaPaths.black(false);
    };

    render = () => {
        const { innerHeight: wh } = window;

        const ya = clamp(this.whiteVal - 1, 0, 1) * wh;
        const ha = clamp(this.whiteVal, 0, 1) * wh - clamp(this.whiteVal - 1, 0, 1) * wh;

        const yb = (ya + ha) % wh;
        const hb = wh - ha;

        if (Math.abs(this.whiteVal - 1) !== 1) {
            this.bloomMesh.visible = false;
            if (this.whiteVal === 1) {
                this.renderer.setScissorTest(false);
                this.renderWhite();
                return;
            } else {
                this.renderer.setScissorTest(true);
                this.renderer.setScissor(0, ya, window.innerWidth, ha);
                this.renderWhite();
            }
        }

        this.renderer.setScissor(0, yb, window.innerWidth, hb);

        if (this.runBloom) {
            this.renderBloom();
            this.bloomMesh.material.uniforms.tDiffuse.value = this.bloomComposer.renderTarget2.texture;
        } else {
            this.bloomMesh.visible = false;
        }

        this.simpleComposer.render();

        this.renderer.setScissorTest(false);
    };
}

export default Market;
