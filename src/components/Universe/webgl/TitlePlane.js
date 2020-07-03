import { Mesh, PlaneGeometry, ShaderMaterial, DoubleSide } from 'three';

import textureLoader from './textureLoader';

import frag from './shaders/text.frag';
import vert from './shaders/plain.vert';
import { relativeProgress as rp } from './math';

class TitlePlane extends Mesh {
	darken = true;
	image = null;

	setDark = (type, dark = true) => {
		if (dark) {
			this.visible = false;
			this.material.uniforms.dark.value = 0;
		} else {
			this.visible = !this.hidden;
			this.material.uniforms.dark.value = 1;
		}
	};

	hide = () => {
		this.hidden = true;
		this.visible = false;
	};

	show = () => {
		this.hidden = false;
		this.visible = true;
	};

	fade = (val) => {
		this.material.uniforms.opacity.value = val;
	};

	resize = () => {
		const small = 320;
		const large = 1920;

		const w = Math.min(window.innerWidth, large);

		const min = 1;
		const max = 1.6;
		const diff = max - min;

		const prog = max - rp(w, small, large) * diff;

		const h = this.h / 1920 * w * prog;
		this.scale.y = h;
		this.scale.x = h * this.ratio;
	};

	setHeight = (h) => {
		this.h = h;
		this.resize();
	};

	constructor(img) {
		const geo = new PlaneGeometry(1, 1);
		const mat = new ShaderMaterial({
			uniforms: {
				tDiffuse: {
					value: null
				},

				dark: {
					value: 1
				},

				opacity: {
					value: 1
				}
			},
			fragmentShader: frag,
			vertexShader: vert,
			transparent: true,
			depthWrite: true,
			depthTest: true,
			side: DoubleSide
		});

		super(geo, mat);

		this.renderOrder = 11;

		textureLoader.load(img).then((image) => {
			this.image = image;
			this.material.uniforms.tDiffuse.value = image;
		});
	}
}

export default TitlePlane;
