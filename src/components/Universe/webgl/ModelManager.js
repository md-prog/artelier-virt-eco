import { BufferAttribute } from "three";

import loader from "./loader";

import DarkMaterial from "./materials/DarkMaterial";
import PlainMaterial from "./materials/PlainMaterial";

class ModelManager {
    constructor() {
        this.darkMaterial = new DarkMaterial();
    }

    updateUVs = geo => {
        const uvs = [];
        const { length } = geo.attributes.position.array;
        for (let i = 0; i < length; i += 9) {
            uvs.push(0, 0);
            uvs.push(1, 0);
            uvs.push(1, 1);
        }
        const bufferAttrib = new BufferAttribute(new Float32Array(uvs), 2);
        geo.setAttribute("uv", bufferAttrib);
    };

    addDarken = (
        mesh,
        show = function() {
            return false;
        }
    ) => {
        mesh.darken = true;
        mesh.setDark = function(type, dark = true) {
            if (show(type)) return;
            this.material.setDark(dark);
        };
    };

    setMaterial = (child, allDark = false) => {
        const strings = ["black", "white"];
        const color1 = child.children[0].material && child.children[0].material.name;
        const color2 = child.children[1].material && child.children[1].material.name;

        if (child.children[0].name.includes("square")) {
            child.children.forEach(kiddo => {
                kiddo.material = new PlainMaterial(kiddo.material.color);
                function show(type) {
                    return type === "cubes";
                }
                this.addDarken(kiddo, show);
            });
            return;
        }

        if (!(strings.includes(color1) && strings.includes(color2)) || allDark) {
            child.children.forEach(kiddo => {
                kiddo.material = this.darkMaterial;
                this.addDarken(kiddo);
            });
        } else {
            child.children.forEach(kiddo => {
                // if (kiddo.material.name == "black") kiddo.visible = false;

                kiddo.material = new PlainMaterial(kiddo.material.color);
                function show(type) {
                    return type === "split";
                }
                this.addDarken(kiddo, show);
            });
        }
    };

    loadModel = async (model, debug = false) => {
        this.loader = loader();
        const output = await this.loader.load(model);
        this.proccess(output.scene);
        return output;
    };

    proccess(parent, allDark = false) {
        parent.traverse(child => {
            if (child.type === "Mesh") this.updateUVs(child.geometry);
            if (child.type === "Group" && child.children.length === 2) this.setMaterial(child, allDark);
        });
    }

    proccessPretty(parent, allDark = false) {
        parent.traverse(child => {
            if (child.type === "Mesh") {
                this.updateUVs(child.geometry);
                // console.log(child)
            }
            if (child.type === "Group" && child.children.length === 2) this.setMaterial(child, allDark);
        });
    }

    loadRaw = async model => {
        this.loader = loader();
        const output = await this.loader.load(model);

        return output;
    };

    update = renderer => {
        this.darkMaterial.update(renderer);
    };
}

export default ModelManager;
