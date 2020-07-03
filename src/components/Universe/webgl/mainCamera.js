import { PerspectiveCamera, Object3D, Vector3 } from "three";

class MainCamera extends Object3D {
    constructor() {
        let props = [45, window.innerWidth / window.innerHeight, 0.01, 300];

        super();

        this.cam = new PerspectiveCamera(...props);
        this.xAxis = new Object3D();
        this.yAxis = new Object3D();
        this.zAxis = this;

        this.xAxis.add(this.cam);
        this.yAxis.add(this.xAxis);
        this.zAxis.add(this.yAxis);

        window.addEventListener("resize", this.resize);
    }

    resize = () => {
        this.cam.aspect = window.innerWidth / window.innerHeight;
        this.cam.updateProjectionMatrix();
    };

    setPosition({ x, y, z }) {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
    }

    getRotation() {
        return new Vector3(this.xAxis.rotation.x, this.yAxis.rotation.y, this.zAxis.rotation.z);
    }
    getPosition() {
        return this.position;
    }

    getOffset() {
        return this.cam.position;
    }

    getFov() {
        return this.cam.fov;
    }

    setOffset({ x, y, z }) {
        this.cam.position.x = x;
        this.cam.position.y = y;
        this.cam.position.z = z;
    }

    setRotation({ x, y, z }) {
        this.xAxis.rotation.x = x;
        this.yAxis.rotation.y = y;
        this.zAxis.rotation.z = z;
    }

    setFov(fov) {
        this.cam.fov = fov;
        this.cam.updateProjectionMatrix();
    }

    get camera() {
        return this.cam;
    }
}

export default function() {
    return new MainCamera();
}
