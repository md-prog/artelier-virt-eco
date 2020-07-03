import {
    Scene,
    PointLight,
    AmbientLight,
    Vector2,
    ShaderMaterial,
    BufferGeometry,
    BufferAttribute,
    RawShaderMaterial,
    Mesh,
    WebGLRenderTarget,
} from "three";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import mainCamera from "../mainCamera";
import FlightPath from "../FlightPath";
import Stars from "../Stars";

import Nebula from "../Nebula";

import { easing, relativeProgress as rp, clamp } from "../math";

import PioneerPlanet from "../PioneerPlanet";

import TitlePlane from "../TitlePlane";
import titleImage from "../../../../images/titles/ThePioneers_2226x1000.png";

import volumetricLightFrag from "../shaders/volumetricLightShader.frag";
import volumetricPanelFrag from "../shaders/volumetricPanel.frag";
import plainVert from "../shaders/plain.vert";
import panelVert from "../shaders/volumePanel.vert";

import blackoutFrag from "../shaders/blackout.frag";

const bl = [-1.0, -1.0];
const br = [1.0, -1.0];
const tl = [-1.0, 1.0];
const tr = [1.0, 1.0];

const vertices = new Float32Array([...bl, ...br, ...tl, ...tl, ...br, ...tr]);

class Pioneers {
    range = {
        section: 5,
        start: 0,
        end: 1,
    };

    lights = [];

    constructor(renderer) {
        this.renderer = renderer;
        this.cameraObject = mainCamera();
        this.camera = this.cameraObject.camera;
        this.init();
    }

    createTitle = () => {
        this.titleText = new TitlePlane(titleImage);
        this.titleText.ratio = 3160 / 1000;
        this.titleText.setHeight(3);
        this.titleText.position.y = -70;
        this.titleText.position.z = 0;
        this.titleText.position.x = 0;

        this.titleText.rotation.x = -Math.PI / 2;
        this.titleText.rotation.z = -Math.PI / 2;
        this.scene.add(this.titleText);
    };

    setupVolumetricLightPlane = () => {
        const geometry = new BufferGeometry();
        geometry.addAttribute("position", new BufferAttribute(vertices, 2));

        const resolution = new Vector2();
        this.renderer.getDrawingBufferSize(resolution);

        this.volumeMat = new RawShaderMaterial({
            uniforms: {
                res: {
                    value: resolution,
                },
                tex: {
                    value: null,
                },
                blackout: {
                    value: 0,
                },
            },
            fragmentShader: volumetricPanelFrag,
            vertexShader: panelVert,
            transparent: true,
        });

        const mesh = new Mesh(geometry, this.volumeMat);

        mesh.frustumCulled = false;

        this.volumeMesh = mesh;
        this.scene.add(mesh);
    };

    setupBlackoutPlane = () => {
        const geometry = new BufferGeometry();

        geometry.addAttribute("position", new BufferAttribute(vertices, 2));

        this.blackoutMat = new RawShaderMaterial({
            uniforms: {
                blackout: {
                    value: 0,
                },
            },
            fragmentShader: blackoutFrag,
            vertexShader: panelVert,
            transparent: true,
        });

        const mesh = new Mesh(geometry, this.blackoutMat);
        this.blackoutMesh = mesh;
        mesh.frustumCulled = false;

        this.scene.add(mesh);
    };

    init = () => {
        this.scene = new Scene();
        const ambient = new AmbientLight(0xffffff, 0.2);
        ambient.holdIntensity = ambient.intensity;
        this.scene.add(ambient);
        this.scene.add(this.cameraObject);

        this.stars = new Stars();
        this.scene.add(this.stars);

        this.createTitle();
        this.setupVolumetricLightPlane();
        this.setupBlackoutPlane();

        this.cameraObject.setPosition({ z: 0, x: 0, y: 0 });
        this.cameraObject.setRotation({ z: 0, y: -Math.PI / 4, x: -Math.PI / 4 });

        this.planet = new PioneerPlanet();

        this.scene.add(this.planet);

        this.planet.position.y = 395;

        this.nebula = new Nebula();

        this.scene.add(this.nebula);

        const light = new PointLight(0x333333);
        light.holdIntensity = light.intensity;
        light.position.set(200, 400, 200);

        this.scene.add(light);

        this.fp = new FlightPath(this.cameraObject);

        this.lights.push(ambient, light);

        this.fp.add({
            type: "rotation",
            val: { x: -Math.PI / 2, y: -Math.PI / 2 },
            start: 0,
            end: 0.1,
            easing: easing.outSine,
        });

        this.fp.add({
            type: "position",
            val: { y: -60 },
            start: 0,
            end: 0.1,
            easing: easing.outSine,
        });

        this.fp.add({
            type: "position",
            val: { y: 350 },
            start: 0.1,
            end: 0.6,
            easing: easing.inSine,
        });
        this.fp.add({
            type: "position",
            val: { y: 400 },
            start: 0.6,
            end: 0.9,
            easing: easing.outSine,
        });

        this.fp.add({
            type: "fov",
            val: 75,
            start: 0,
            end: 0.1,
            easing: easing.inOutSine,
        });

        this.fp.add({
            type: "fov",
            val: 45,
            start: 0.1,
            end: 0.6,
            easing: easing.inOutSine,
        });

        this.fp.add({
            type: "offset",
            val: { z: -0.5 },
            start: 0.1,
            end: 0.8,
            easing: easing.inOutSine,
        });

        this.fp.add({
            type: "offset",
            val: { y: -0.1 },
            start: 0.7,
            end: 0.8,
            easing: easing.inOutSine,
        });

        this.fp.add({
            type: "offset",
            val: { x: -0.1 },
            start: 0.8,
            end: 0.81,
            easing: easing.inOutSine,
        });

        this.fp.add({
            type: "offset",
            val: { y: 0.5, x: 0, z: 1 },
            start: 0.82,
            end: 0.95,
            easing: easing.inOutSine,
        });

        this.fp.add({
            type: "offset",
            val: { y: 0 },
            start: 0.98,
            end: 1,
            easing: easing.inSine,
        });

        this.fp.finished();

        this.setupRender();
    };

    setupRender = () => {
        const sceneRender = new RenderPass(this.scene, this.camera);

        this.composer = new EffectComposer(this.renderer);
        this.composer.setSize(window.innerWidth, window.innerHeight);
        this.composer.addPass(sceneRender);

        this.target = new WebGLRenderTarget(window.innerWidth * 0.5, window.innerHeight * 0.5);

        this.volumetricLightPass = new ShaderPass(
            new ShaderMaterial({
                uniforms: {
                    tex: { value: null },
                    lightPosition: { value: new Vector2(0.5, 0.5) },
                    exposure: { value: 0.15 },
                    decay: { value: 0.94 },
                    density: { value: 0.6 },
                    weight: { value: 0.4 },
                    samples: { value: 40 },
                },

                fragmentShader: volumetricLightFrag,
                vertexShader: plainVert,
                // transparent: true,
            }),
            "tex"
        );

        this.volumetricComposer = new EffectComposer(this.renderer, this.target);
        this.volumetricComposer.setSize(window.innerWidth * 0.5, window.innerHeight * 0.5);
        this.volumetricComposer.addPass(sceneRender);
        this.volumetricComposer.addPass(this.volumetricLightPass);
        this.volumetricComposer.renderToScreen = false;
    };

    resize = () => {
        const { innerWidth: w, innerHeight: h } = window;

        this.titleText.resize();
        this.nebula.resize(w, h);
        this.composer.setSize(w, h);

        this.volumetricComposer.setSize(w * 0.5, h * 0.5);
        this.target.setSize(w * 0.5, h * 0.5);

        const resolution = new Vector2();
        this.renderer.getDrawingBufferSize(resolution);
        this.volumeMat.uniforms.res.value = resolution;
    };

    update = (prog, subSections) => {
        if (prog === 0) this.animProg = 0;
        if (Math.abs(prog) === 1) {
            this.animProg = clamp(prog, 0, 1);
            return;
        }

        const subProg = this.handleSubs(subSections);

        this.fp.update(subProg);

        const alpha = rp(subProg, 0.09, 0.3);
        this.nebula.fade(alpha);

        const fade = rp(subProg, 0.2, 0.1);

        this.titleText.fade(fade);

        const rot = easing.inOutSine(rp(subProg, 0.7, 0.8));
        const color = rp(subProg, 0.8, 0.95);

        const planetProg = rp(subProg, 0.75, 0.95);
        const sunProg = rp(subProg, 0.75, 1);

        const blackout = rp(subProg, 0.98, 1);
        this.blackoutMat.uniforms.blackout.value = blackout;

        this.planet.update(planetProg, sunProg);

        this.subProg = subProg;

        this.nebula.update(easing.inOutSine(rp(subProg, 0, 0.9)), rot - 1, color, planetProg);

        this.render();
    };

    handleSubs = subs => {
        const { length } = subs;

        let prog = 0;

        const last = length - 3;
        const creditsI = length - 2;

        const p = subs[0].data.animY;
        const start = subs[0].data.start;
        const firstEnd = subs[0].data.end;

        const lastStart = subs[last].data.start;
        const end = subs[last].data.end;
        const credits = subs[creditsI].data.end;

        prog = rp(p, start, firstEnd) * 0.1;

        prog += rp(p, firstEnd, lastStart) * 0.7;
        prog += rp(p, lastStart, end) * 0.15;
        prog += rp(p, end, credits) * 0.05;

        return prog;
    };

    darken = dark => {
        this.stars.visible = !dark;
        this.nebula.visible = !dark;
        this.volumeMesh.visible = !dark;
        this.blackoutMesh.visible = !dark;
        this.lights.forEach(function(light) {
            light.intensity = dark ? 0 : light.holdIntensity;
        });
    };

    renderLighting = () => {
        this.darken(true);
        this.planet.darken(true);

        this.volumetricComposer.render();

        this.planet.darken(false);
        this.darken(false);
    };

    render = () => {
        if (this.subProg < 0.7) {
            this.volumeMesh.visible = false;
            this.blackoutMesh.visible = false;
            this.composer.render();
        } else {
            this.volumetricLightPass.material.uniforms.lightPosition.value.y = 0.35 + rp(this.subProg, 0.75, 1) * 0.3;
            this.renderLighting();

            this.volumeMat.uniforms.tex.value = this.target.texture;
            this.volumetricComposer.swapBuffers();
            this.composer.render();
        }
    };
}

export default Pioneers;
