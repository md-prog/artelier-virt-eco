import { Scene, AmbientLight, Object3D, Vector3, Euler } from "three";

import loader from "../loader";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";

import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";

import mainCamera from "../mainCamera";
import FlightPath from "../FlightPath";
import IntroLandscape from "../IntroLandscape";

import Stars from "../Stars";

import ModelManager from "../ModelManager";

import shardModels from "../../../../models/shards2.gltf";
import cubeModel from "../../../../models/cube3.gltf";

import { easing, relativeProgress as rp } from "../math";

import TitlePlane from "../TitlePlane";
import titleImage from "../../../../images/titles/TheVirtualEconomy_1612x692.png";

class Opening {
    range = {
        start: 0,
        end: 1,
        section: 0,
    };

    animProg = 0;
    shardItems = [];

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
        this.createTitle();
        this.initFlight();
    }

    createTitle = () => {
        this.titleText = new TitlePlane(titleImage);
        this.titleText.ratio = 1612 / 692;
        this.titleText.setHeight(0.15);

        this.titleText.position.y = 0.6;
        this.titleText.position.z = -0.2;
        this.scene.add(this.titleText);
    };

    loadModels = async callback => {
        this.loader = loader();

        const shardOutput = await this.mm.loadModel(shardModels);
        const cueOutput = await this.mm.loadModel(cubeModel);

        this.shards = [...shardOutput.scene.children];
        this.cube = [...cueOutput.scene.children][0].children[0];

        callback();
    };

    initFlight = () => {
        this.cameraObject.setPosition({ z: 0.3, y: 0.52, x: 0 });
        this.cameraObject.setRotation({ x: Math.PI / 20, y: 0, z: 0 });

        this.fp = new FlightPath(this.cameraObject);

        this.fp.add({ type: "position", val: { z: 2 }, start: 0, end: 0.2 }); // 0.2

        this.fp.add({ type: "position", val: { y: 10 }, start: 0.2, end: 0.4, easing: easing.inSine }); // 0.2
        this.fp.add({ type: "position", val: { y: 200 }, start: 0.5, end: 1, easing: easing.inOutSine }); // 0.3

        this.fp.add({ type: "position", val: { z: 10 }, start: 0.2, end: 0.4, easing: easing.outSine }); // 0.2
        this.fp.add({ type: "position", val: { z: 0 }, start: 0.5, end: 1, easing: easing.inOutSine }); // 0.3

        this.fp.add({ type: "fov", val: 120, start: 0, end: 0.1, easing: easing.outSine });
        this.fp.add({ type: "fov", val: 45, start: 0.1, end: 0.3, easing: easing.inOutSine });

        this.fp.add({ type: "rotation", val: { x: -Math.PI / 3 }, start: 0.2, end: 0.5, easing: easing.inOutSine }); // 0.3
        this.fp.add({ type: "rotation", val: { x: -Math.PI / 2 }, start: 0.5, end: 1, easing: easing.inOutSine });
        this.fp.add({ type: "rotation", val: { z: Math.PI / 2 }, start: 0.9, end: 1, easing: easing.inSine });

        this.fp.finished();
    };

    initScene = () => {
        this.generateCubes();
        this.stars = new Stars();
        this.scene.add(this.stars);
    };

    resize = () => {
        this.titleText.resize();
        this.cameraObject.resize();
    };

    randomPosition = () => {
        const x = 100 * (Math.random() - 0.5);
        const y = 100 * (Math.random() - 0.5);
        const z = 100 * (Math.random() - 0.5);

        return new Vector3(x, y, z);
    };

    randomRotation = () => {
        const x = Math.random() * Math.PI * 2;
        const y = Math.random() * Math.PI * 2;
        const z = Math.random() * Math.PI * 2;

        return new Euler(x, y, z, "XYZ");
    };

    generateCubes = () => {
        const cubeCount = 300;
        const { length } = this.shards;

        this.cubes = new Object3D();

        this.landscape = new IntroLandscape();
        this.cubes.add(this.landscape);

        for (let i = 0; i < cubeCount; i++) {
            const p = i === 0 ? new Vector3(0, -0.5, 0) : this.randomPosition();
            const r = i === 0 ? new Euler(0, 0, 0) : this.randomRotation();
            const c = this.cube.clone();
            const cubeObj = new Object3D();
            const shard = this.shards[i === 0 ? 0 : Math.floor(Math.random() * length)];
            const clone = shard.clone();

            clone.scale.x = clone.scale.y = clone.scale.z = 0.5;

            shard.children.forEach((child, i) => {
                clone.children[i].darken = child.darken;
                clone.children[i].setDark = child.setDark;
            });

            c.darken = this.cube.darken;
            c.setDark = this.cube.setDark;

            cubeObj.position.copy(p);
            cubeObj.setRotationFromEuler(r);

            cubeObj.add(c);
            cubeObj.add(clone);

            this.shardItems.push(clone);
            this.cubes.add(cubeObj);
        }

        this.scene.add(this.cubes);
    };

    setTimeline = (start, end, section) => {
        this.range.start = start;
        this.range.end = end;
        this.range.section = section;
    };

    update = prog => {
        if (Math.abs(prog) === 1) return;
        const t = window.performance.now() * 0.001;
        if (!this.shards) return;

        this.shards.forEach((shard, i) => {
            shard.rotation.y = t * Math.sin(i);
            shard.rotation.z = t * Math.cos(i);
        });

        this.fp.update(prog);

        const rot = easing.inOutQuart(rp(prog, 0.2, 1)) * Math.PI;

        const fadeVal = rp(prog, 0.03, 0.08);
        const landVal = rp(prog, 0.1, 0.2);
        this.landscape.update(landVal);
        this.titleText.fade(1 - fadeVal);

        this.cubes.rotation.x = rot;
        this.cubes.rotation.y = rot;

        this.cubes.children.forEach(function(cube, i) {
            if (i <= 1) return;
            const sin = Math.sin(i);
            const x = t * 0.1 * sin + sin * Math.sign(sin);
            const y = t * 0.1 * sin + sin * -Math.sign(sin);

            cube.rotation.x = -x * 2;
            cube.rotation.y = -y * 2;

            const shard = cube.children[0];

            shard.rotation.x = x;
            shard.rotation.y = y;
        });

        this.stars.setRotation(new Euler(rot, rot, 0));

        this.mm.update(this.renderer);
        this.render();
    };

    setupRender() {
        const sceneRender = new RenderPass(this.scene, this.camera);

        this.simpleComposer = new EffectComposer(this.renderer);
        this.simpleComposer.addPass(sceneRender);
    }

    renderBloom() {
        this.scene.traverse(this.darkenNonBloomed);
        this.bloomComposer.render();
        this.scene.traverse(this.restoreMaterial);
    }
    darkenNonBloomed(obj) {
        if (obj.darken) obj.setDark("cubes");
    }
    restoreMaterial(obj) {
        if (obj.darken) obj.setDark("cubes", false);
    }

    darkenSplit(obj) {
        if (obj.darken) obj.setDark("split");
    }
    restoreSplitDark(obj) {
        if (obj.darken) obj.setDark("split", false);
    }

    renderSplit() {
        this.scene.traverse(this.darkenSplit);
        this.depthComposer.render();
        this.splitComposer.render();
        this.splitComposer.swapBuffers();
        this.scene.traverse(this.restoreSplitDark);
    }

    render = () => {
        this.simpleComposer.render();
    };
}

export default Opening;
