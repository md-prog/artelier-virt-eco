import { angle } from "./math";

class FlyingShip {
    constructor(obj, i) {
        this.obj = obj;
        this.offset = (i * (Math.PI * 2)) / 3;
    }

    update = time => {
        const t = (time * 0.001 + this.offset) % (Math.PI * 2);

        const x = Math.cos(t);
        const y = Math.sin(t * 2);

        const lx = this.obj.position.z;
        const ly = this.obj.position.y;

        const nx = x * 5;
        const ny = 12 + y * 2;

        const v1 = { x: lx, y: ly };
        const v2 = { x: nx, y: ny };

        const a = angle(v2, v1);

        this.obj.position.z = nx;
        this.obj.position.y = ny;

        this.obj.rotation.x = -a - Math.PI * 0.5;
    };
}

export default FlyingShip;
