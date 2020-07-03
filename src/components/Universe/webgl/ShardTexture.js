import { Scene, OrthographicCamera, IcosahedronGeometry, MeshBasicMaterial, Mesh } from "three";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";

class ShardTexture extends EffectComposer {
    constructor(renderer) {
        super(renderer);

        let props = [128 / -2, 128 / 2, 128 / 2, 128 / -2, 1, 300];
        this.camera = new OrthographicCamera(...props);

        this.scene = new Scene();
        this.scene.add(this.camera);

        this.createModel();

        this.setSize(128, 128);

        const renderPass = new RenderPass(this.scene, this.camera);
        this.addPass(renderPass);

        this.renderToScreen = false;

        this.render();
    }

    createModel = () => {
        const geo = new IcosahedronGeometry(60, 0);
        const mat = new MeshBasicMaterial({
            color: 0xffffff,
        });

        const mesh = new Mesh(geo, mat);
        mesh.position.z = -150;

        this.shard = mesh;

        this.scene.add(mesh);
    };
}

export default ShardTexture;
