import { Geometry, Vector3, Euler, Points, ShaderMaterial } from 'three';

import starsFrag from './shaders/stars.frag';
import starsVert from './shaders/stars.vert';

import { af as AF } from '@gladeye/af';

const starsGeometry = new Geometry();

for (let i = 0; i < 5000; i++) {
	const star = new Vector3();

	star.x = Math.random() * 800 - 400;
	star.y = Math.random() * 800 - 400;
	star.z = Math.random() * 800 - 400;

	starsGeometry.vertices.push(star);
}

const position = new Vector3(0, 0, 0);
const rotation = new Euler(0, 0, 0);

class Stars extends Points {
	darken = true;
	constructor() {
		const starsMaterial = new ShaderMaterial({
			vertexShader: starsVert,
			fragmentShader: starsFrag,
			uniforms: {
				res: {
					value: [ window.innerWidth / window.innerHeight ]
				},
				color: {
					value: 1
				},
				scale: {
					value: 1
				}
			}
		});

		super(starsGeometry, starsMaterial);

		this.darken = true;

		this.af = AF();
		this.af.addRead(this.check);
	}

	check = () => {
		this.position.copy(position);
		this.rotation.copy(rotation);
	};

	setFov = (val) => {
		this.material.uniforms.fov.value = val;
	};

	setScale = (val) => {
		this.material.uniforms.scale.value = val;
	};

	setPosition = (vec3) => {
		position.copy(vec3);
	};

	setRotation = (Euler) => {
		rotation.copy(Euler);
	};

	setDark(type, dark = true) {
		this.material.uniforms.color.value = dark ? 0 : 1;
	}
}

export default Stars;
