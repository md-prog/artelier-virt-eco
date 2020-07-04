import {
    Mesh,
    Object3D,
    MeshStandardMaterial,
    MeshBasicMaterial,
    WebGLCubeRenderTarget,
    RGBFormat,
    LinearMipmapLinearFilter,
    CubeCamera,
    IcosahedronGeometry,
    PointLight,
} from "three";

import { relativeProgress as rp } from "./math";

import cityScape from "../../../models/conclusion-1.gltf";
import terrain from "../../../models/conclusion-terrain.gltf";
import PopInOut from "./PopInOut";

import ModelManager from "./ModelManager";

import FlyingShip from "./FlyingShip";

class PioneerPlanet extends Object3D {
    constructor() {
        super();

        this.mm = new ModelManager();
        this.setup();
    }

    names = [
        "Duplication_Offset_building-1",
        "Duplication_Offset_building-2",
        "Duplication_Offset_building-3",
        "Duplication_Offset_building-4",
        "Duplication_Offset_building-5",
        "Duplication_Offset_fountain-1",
        "Duplication_Offset_fountain-2",
        "Duplication_Offset_floating-1",
        "Duplication_Offset_floating-2",
        "Duplication_Offset_floating-3",
        "Duplication_Offset_floating-4",
        "Duplication_Offset_tower-1",
        "Duplication_Offset_tower-2",
        "Duplication_Offset_tower-3",
        "Duplication_Offset_tower-4",
        "Duplication_Offset_rings",
        "Duplication_Offset_spheres",
        "Duplication_Offset_dome001",
    ];

    shipsName = "Duplication_Offset_ships";

    groups = [];
    updateItems = [];

    ships = [];

    setupShips = child => {
        child.children.forEach((obj, i) => {
            const ship = new FlyingShip(obj, i);

            this.ships.push(ship);

            obj.rotation.x = 0;
            obj.rotation.y = 0;
            obj.rotation.z = 0;
        });
    };

    orderObjects = scene => {
        let max = 0;

        scene.children.forEach(child => {
            const { name } = child;

            if (this.shipsName === name) {
                this.setupShips(child);
                return;
            }

            if (this.names.indexOf(name) > -1) child.build = true;
            else return;

            max = Math.max(child.children.length, max);
        });

        scene.children.forEach(child => {
            if (!child.build) return;

            const { length } = child.children;
            let diff = max - length;

            while (diff-- > 0) {
                const obj = new Object3D();
                obj.name = "dummy0";
                child.add(obj);
            }

            child.children.sort(function(a, b) {
                const n1 = a.name.match(/\d+/)[0];
                const n2 = b.name.match(/\d+/)[0];

                const v1 = parseFloat(n1);
                const v2 = parseFloat(n2);

                return v1 - v2;
            });
        });

        for (let i = 0; i < max; i++) {
            const obj = {
                active: false,
                items: [],
                changeState: function(on) {
                    if (this.active === on) return;
                    this.active = on;
                    const t = window.performance.now();

                    this.items.forEach(function(item) {
                        if (on) item.popInOut.on(t);
                        else item.popInOut.off(t);
                    });
                },
            };

            scene.children.forEach(child => {
                const { children } = child;
                const { length } = children;

                if (!child.build) return;
                if (i < length) {
                    children[i].popInOut = new PopInOut(children[i]);
                    obj.items.push(children[i]);
                    this.updateItems.push(children[i]);
                }
            });

            this.groups.push(obj);
        }
    };

    setupSun = () => {
        var cubeRenderTarget = new WebGLCubeRenderTarget( 1024, {
            format: RGBFormat,
            generateMipmaps: true,
            minFilter: LinearMipmapLinearFilter });
        this.cubeCamera = new CubeCamera(1, 100000, cubeRenderTarget);
        const geo = new IcosahedronGeometry(20, 1);

        const mat = new MeshBasicMaterial({
            color: 0xeeeeaa,
            wireframe: true,
        });

        const mat2 = new MeshBasicMaterial({
            color: 0xbbbbbb,
        });

        const obj = new Object3D();
        const mesh = new Mesh(geo, mat);

        obj.add(this.cubeCamera);

        obj.sphere = mesh;
        obj.raySphere = mesh.clone();

        obj.raySphere.material = mat2;

        obj.raySphere.visible = false;

        obj.add(obj.raySphere, obj.sphere);

        const light = new PointLight(0xf5bc41, 2, 50, 2);
        light.holdIntensity = light.intensity;

        light.position.set(0, 20, 0);

        obj.add(light);

        obj.light = light;

        return obj;
    };

    render = () => {};

    setup = async () => {
        const cityScapeOutput = await this.mm.loadRaw(cityScape);
        const terrainOutput = await this.mm.loadRaw(terrain);
        const mat = new MeshStandardMaterial({ color: 0xfafafa });

        const cityMat = new MeshStandardMaterial({ color: 0xf5bc41, metalness: 0.7, roughness: 0.6 });

        const { scene } = cityScapeOutput;
        const { scene: terrainScene } = terrainOutput;

        this.sun = this.setupSun();

        this.orderObjects(scene);

        this.scale.x = 0.1;
        this.scale.y = 0.1;
        this.scale.z = 0.1;
        this.rotation.z = Math.PI * 1.5;

        scene.position.y = -5;
        scene.rotation.y = Math.PI;

        terrainScene.position.y = -5;
        terrainScene.rotation.y = Math.PI;

        this.sun.position.x = 40;

        const cityObj = new Object3D();
        const terrainObj = new Object3D();

        cityObj.add(scene);
        terrainObj.add(terrainScene);

        this.add(cityObj, terrainObj, this.sun);

        cityObj.traverse(child => {
            if ((child.type = "Mesh")) {
                child.material = cityMat;
            }
        });

        terrainObj.traverse(child => {
            if ((child.type = "Mesh")) {
                child.material = mat;
            }
        });
    };

    showGroups = prog => {
        const { length } = this.groups;
        const current = Math.floor(prog * length);

        this.groups.forEach((group, i) => {
            const isOn = i <= current;
            group.changeState(isOn);
        });
    };

    darken = dark => {
        this.sun.light.intensity = dark ? 0 : this.sun.light.holdIntensity;
        this.sun.sphere.visible = !dark;
        this.sun.raySphere.visible = dark;
    };

    update = (prog, sunProg) => {
        const t = window.performance.now();
        if (!this.sun) return;

        this.updateItems.forEach(function(item) {
            item.popInOut.update(t);
        });

        this.ships.forEach(function(ship) {
            ship.update(t);
        });

        this.sun.position.y = -40 + 60 * sunProg;
        this.sun.sphere.rotation.x = this.sun.raySphere.rotation.x = Math.cos(t * 0.00001) * Math.PI * 2;
        this.sun.sphere.rotation.z = this.sun.raySphere.rotation.z =
            Math.sin(t * 0.00001) * Math.PI * 2 - prog * Math.PI * 0.5;

        this.showGroups(rp(prog, 0.3, 1));
    };
}

export default PioneerPlanet;
