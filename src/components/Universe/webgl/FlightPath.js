import { relativeProgress as rp, interpolate as interp } from "./math";
import { Vector3 } from "three";

class FlightPath {
    positionX = [];
    positionY = [];
    positionZ = [];

    offsetX = [];
    offsetY = [];
    offsetZ = [];

    rotationX = [];
    rotationY = [];
    rotationZ = [];

    fovTimeline = [];

    isNarrow = false;

    arrays = [
        {
            type: "positionX",
            data: this.positionX,
        },
        {
            type: "positionY",
            data: this.positionY,
        },
        {
            type: "positionZ",
            data: this.positionZ,
        },
        {
            type: "offsetX",
            data: this.offsetX,
        },
        {
            type: "offsetY",
            data: this.offsetY,
        },
        {
            type: "offsetZ",
            data: this.offsetZ,
        },
        {
            type: "rotationX",
            data: this.rotationX,
        },
        {
            type: "rotationY",
            data: this.rotationY,
        },
        {
            type: "rotationZ",
            data: this.rotationZ,
        },
        {
            type: "fov",
            data: this.fovTimeline,
        },
    ];
    x;
    constructor(camera) {
        this.cam = camera;

        this.initalPosition = new Vector3().copy(camera.getPosition());
        this.initalRotation = new Vector3().copy(camera.getRotation());
        this.initalOffset = new Vector3().copy(camera.getOffset());
        this.initalFOV = camera.getFov();

        this.currentPosition = new Vector3().copy(camera.getPosition());
        this.currentOffset = new Vector3().copy(camera.getOffset());
        this.currentRotation = new Vector3().copy(camera.getRotation());

        this.currentFov = this.initalFOV;

        this.isNarrow = window.innerWidth < 800;

        window.addEventListener("resize", () => {
            this.isNarrow = window.innerWidth < 800;
        });
    }

    add({ type, val, start, end, easing, altVal = {} }) {
        const dataObj = (val, alt) => {
            return {
                start,
                end,
                val,
                altVal: typeof alt === "undefined" ? val : alt,
                easing:
                    easing ||
                    function(p) {
                        return p;
                    },
            };
        };

        let arr;

        if (type === "position") {
            for (let prop in val) {
                const alt = typeof altVal[prop] !== "undefined" ? altVal[prop] : val[prop];

                if (prop === "x") arr = this.positionX;
                if (prop === "y") arr = this.positionY;
                if (prop === "z") arr = this.positionZ;

                arr.push(dataObj(val[prop], alt));
            }
        } else if (type === "offset") {
            for (let prop in val) {
                const alt = typeof altVal[prop] !== "undefined" ? altVal[prop] : val[prop];

                if (prop === "x") arr = this.offsetX;
                if (prop === "y") arr = this.offsetY;
                if (prop === "z") arr = this.offsetZ;

                arr.push(dataObj(val[prop], alt));
            }
        } else if (type === "rotation") {
            for (let prop in val) {
                const alt = typeof altVal[prop] !== "undefined" ? altVal[prop] : val[prop];

                if (prop === "x") arr = this.rotationX;
                if (prop === "y") arr = this.rotationY;
                if (prop === "z") arr = this.rotationZ;

                arr.push(dataObj(val[prop], alt));
            }
        } else if (type === "fov") {
            this.fovTimeline.push(dataObj(val));
        }
    }

    finished = () => {
        this.arrays.forEach(item => {
            const { data: arr, type } = item;

            let initial;

            switch (type) {
                case "positionX":
                    initial = this.initalPosition.x;
                    break;
                case "positionY":
                    initial = this.initalPosition.y;
                    break;
                case "positionZ":
                    initial = this.initalPosition.z;
                    break;
                case "offsetX":
                    initial = this.initalOffset.x;
                    break;
                case "offsetY":
                    initial = this.initalOffset.y;
                    break;
                case "offsetZ":
                    initial = this.initalOffset.z;
                    break;
                case "rotationX":
                    initial = this.initalRotation.x;
                    break;
                case "rotationY":
                    initial = this.initalRotation.y;
                    break;
                case "rotationZ":
                    initial = this.initalRotation.z;
                    break;
                case "fov":
                    initial = this.initalFOV;
                    break;
                default:
                    break;
            }

            this.compile(arr, initial);
        });
    };

    compile = (arr, inital) => {
        arr.sort(function(a, b) {
            if (a.start < b.start) {
                return -1;
            }
            if (a.start > b.start) {
                return 1;
            }
            return 0;
        });

        arr.forEach((item, i) => {
            item.initVal = i > 0 ? arr[i - 1].val : inital;
            item.altInitVal = i > 0 ? arr[i - 1].altVal : inital;
        });

        this.fillGaps(arr);
    };

    fillGaps(arr) {
        const { length } = arr;
        const temp = [];

        for (let i = 0; i < length; i++) {
            const { start, end, initVal, val, altVal } = arr[i];

            if (i === 0 && start > 0) {
                temp.push({
                    start: 0,
                    end: start,
                    val: initVal,
                    altVal: initVal,
                    initVal,
                    altInitVal: initVal,
                    easing: function(p) {
                        return p;
                    },
                });

                temp.push(arr[i]);

                if (length === 1) {
                    temp.push({
                        start: end,
                        end: 1,
                        val,
                        altVal,
                        initVal: val,
                        altInitVal: altVal,
                        easing: function(p) {
                            return p;
                        },
                    });
                }
            } else if (i === length - 1 && end < 1) {
                temp.push(arr[i]);
                temp.push({
                    start: arr[i].end,
                    end: 1,
                    val,
                    altVal,
                    initVal: val,
                    altInitVal: altVal,
                    easing: function(p) {
                        return p;
                    },
                });
            } else if (length > 1 && i !== length - 1) {
                const { start: start2 } = arr[i + 1];

                temp.push(arr[i]);

                if (end < start2) {
                    temp.push({
                        start: end,
                        end: start2,
                        val,
                        altVal,
                        initVal: val,
                        altInitVal: altVal,
                        easing: function(p) {
                            return p;
                        },
                    });
                }
            } else temp.push(arr[i]);
        }

        arr.forEach(item => {
            arr.pop();
        });

        temp.forEach(item => {
            arr.push(item);
        });
    }

    arrayLoop = arr => {
        const { type, data } = arr;
        const { length } = data;
        const { progress } = this;

        for (let i = 0; i < length; i++) {
            const { easing, start, end, initVal, altInitVal, val, altVal } = data[i];

            if (progress > end || progress < start) continue;

            const p = rp(progress, start, end);
            const ease = easing(p);
            const input = this.isNarrow ? altVal : val;
            const inputInit = this.isNarrow ? altInitVal : initVal;
            const output = interp(inputInit, input, ease);

            if (type === "positionX") this.currentPosition.x = output;
            if (type === "positionY") this.currentPosition.y = output;
            if (type === "positionZ") this.currentPosition.z = output;

            if (type === "offsetX") this.currentOffset.x = output;
            if (type === "offsetY") this.currentOffset.y = output;
            if (type === "offsetZ") this.currentOffset.z = output;

            if (type === "rotationX") this.currentRotation.x = output;
            if (type === "rotationY") this.currentRotation.y = output;
            if (type === "rotationZ") this.currentRotation.z = output;

            if (type === "fov") this.currentFov = output;
        }
    };

    update(progress) {
        this.progress = progress;
        this.arrays.forEach(this.arrayLoop);

        this.setValues();
    }

    setPosition() {
        const { x, y, z } = this.currentPosition;
        this.cam.setPosition({ x, y, z });
    }

    setRotation() {
        const { x, y, z } = this.currentRotation;
        this.cam.setRotation({ x, y, z });
    }

    setOffset() {
        const { x, y, z } = this.currentOffset;
        this.cam.setOffset({ x, y, z });
    }

    setValues() {
        this.setPosition();
        this.setRotation();
        this.setOffset();

        this.cam.setFov(this.currentFov);
    }
}

export default FlightPath;
