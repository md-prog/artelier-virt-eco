import { WebGLRenderer, PCFSoftShadowMap, ReinhardToneMapping } from "three";
import { af as AF } from "@gladeye/af";
import { relativeProgress as rp, clamp } from "./math";
import SceneManager from "./SceneManager";
import getStore from "./store";
class WebGL {
    map = null;
    progress = null;
    y = 0;
    attached = false;

    constructor() {
        this.renderer = new WebGLRenderer({ antialias: true });
        this.renderer.toneMapping = ReinhardToneMapping;
        this.renderer.toneMappingExposure = Math.pow(1, 4.0);

        this.renderer.shadowMap.type = PCFSoftShadowMap;
        this.renderer.shadowMap.enabled = true;

        this.store = getStore();
        //
        this.renderer.setPixelRatio(this.store.res);
        this.renderer.setSize(this.store.ww, this.store.wh);
        this.renderer.autoClear = false;

        this.renderer.setClearColor(0x000000);

        this.sceneManager = new SceneManager(this.renderer);
        this.body = document.querySelector("body");

        this.af = AF();
        this.af.addRead(this.read);
        this.af.addWrite(this.write);

        window.addEventListener("resize", this.resize);
    }

    resize = () => {
        this.store.resize();
        this.renderer.setPixelRatio(this.store.res);
        this.renderer.setSize(this.store.ww, this.store.wh);

        this.sceneManager.resize();
    };

    attach = parent => {
        if (!this.attached) {
            parent.current.appendChild(this.renderer.domElement);
            this.attached = true;
        }
    };

    within = (v, fv, tv) => {
        return v >= fv && v <= tv;
    };

    lastTime = 0;
    records = [];
    currentRes = 2;
    badCount = 0;

    performanceMonitor = () => {
        const t = window.performance.now();
        const lapsed = t - this.lastTime;
        const { length } = this.records;

        this.lastTime = t;
        if (length < 10) return this.records.push(lapsed);

        this.records.shift();
        this.records.push(lapsed);

        const sum = this.records.reduce((a, b) => a + b, 0);
        const avg = sum / length || 0;

        const target = avg <= 1000 / 55;

        if (target) {
            this.badCount = 0;
            this.setRes(1);
        } else this.badCount++;

        if (this.badCount > 30) {
            this.badCount = 0;
            this.setRes(-1);
        }
    };

    res = 1;

    setRes(dir) {
        this.res += 0.1 * dir;
        this.res = clamp(this.res, 0.5, 2);

        this.sceneManager.setRes(this.res);
    }

    read = () => {
        const { map } = this.map;

        if (map && map.length > 0) {
            const y = window.pageYOffset;
            this.y += (y - this.y) * 0.1;

            const overallProgress = this.y / (this.body.getBoundingClientRect().height - window.innerHeight);

            let currentSection = -1;
            let sectionProgress = 0;

            let sections = [];
            let start = 0;
            let end = 0;

            map.forEach((section, i) => {
                const { sectionStart, sectionEnd } = section;
                if (this.within(this.y, sectionStart, sectionEnd)) currentSection = i;
            });

            if (currentSection >= 0) {
                const { sectionStart, sectionEnd, sections: secs } = map[currentSection];
                sectionProgress = rp(this.y, sectionStart, sectionEnd);

                start = sectionStart;
                end = sectionEnd;
                sections = secs || [];
            }

            this.progress = {
                sectionProgress,

                overallProgress,
                currentSection,
                start,
                end,
                sections,
                y,
                animY: this.y,
            };
        }
    };

    setMap = map => {
        this.map = map;
    };

    write = () => {
        if (!this.progress) return;
        this.sceneManager.update(this.progress);
    };
}

export default function() {
    return (window.webgl = window.webgl || new WebGL());
}
