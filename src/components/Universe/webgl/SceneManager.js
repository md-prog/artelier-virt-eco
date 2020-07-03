import { relativeProgress as rp } from "./math";

import OpeningScene from "./scene/Opening";
import MarketScene from "./scene/Market";
import PopulationScene from "./scene/Population";
import UndergroundScene from "./scene/Underground";
import PioneerScene from "./scene/Pioneers";
import WorkersScene from "./scene/Workers";

import mainCamera from "./mainCamera";

class SceneManager {
    scenes = [];

    loaded = () => {};

    constructor(renderer) {
        this.renderer = renderer;

        this.camera = mainCamera();
        this.camera.position.z = 20;

        this.openeingScene = new OpeningScene(this.renderer, this.loaded);
        this.marketScene = new MarketScene(this.renderer, this.loaded);
        this.populationScene = new PopulationScene(this.renderer, this.loaded);
        this.undergroundScene = new UndergroundScene(this.renderer, this.loaded);
        this.pioneerScene = new PioneerScene(this.renderer, this.loaded);
        this.workersScene = new WorkersScene(this.renderer);

        this.scenes = [
            this.openeingScene,
            this.marketScene,
            this.populationScene,
            this.workersScene,
            this.undergroundScene,
            this.pioneerScene,
        ];
    }

    resize = () => {
        this.scenes.forEach(scene => {
            if (scene.resize) scene.resize();
        });
    };

    setRes = res => {
        this.scenes.forEach(scene => {
            if (scene.setRes) scene.setRes();
        });
    };

    update = prog => {
        const { sectionProgress, overallProgress, currentSection, sections, y, animY } = prog;

        this.scenes.forEach(scene => {
            const { start: ss, end: se, section } = scene.range;
            let progress = -1;
            let subSections = [];

            if (section !== -1 && currentSection === -1 && ss >= 0) return;

            const isNextPlayingEarly = section - 1 === currentSection && ss < 0;
            if (currentSection === section || isNextPlayingEarly) {
                if (isNextPlayingEarly) {
                    progress = rp(-1 + sectionProgress, ss, se);
                } else progress = rp(sectionProgress, ss, se);

                if (sections) {
                    sections.forEach(function(sub) {
                        const { start, end, white } = sub;
                        const val = rp(y, start, end);
                        const data = { start, end, y, animY, white };
                        subSections.push({ val, data });
                    });
                }
            }
            if (currentSection > section) progress = 1;
            if (section === -1) prog = overallProgress;

            scene.update(progress, subSections);
        });
    };
}

export default SceneManager;
