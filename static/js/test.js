import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import Stats from 'three/addons/libs/stats.module';
const scene = new THREE.Scene();
let renderer;
const stats = new Stats();
const loader = new OBJLoader();
let suzanne;
loader.load('./static/suzanne.obj', (object) => {
    suzanne = object;
}, (xhr) => {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
}, () => console.log('Could not load suzanne'));
let shells = [];
let geometry = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
let canvas;
let vs, fs;
//type geomType = 'Plane' | 'Sphere' | 'Monkey' | 'Torus' 
let controls = {
    shellCount: 32,
    shellHeight: 0.2,
    density: 200,
    geomSize: 1,
    geometry: 'Plane',
};
let rect;

let camera;
function render() {
    renderer.render(scene, camera);
}
function animate() {
    requestAnimationFrame(animate);
    render();
    stats.update();
}
async function init() {
	let gui;
    //vs = await fetch('vshell.glsl').then(res => res.text());
    //fs = await fetch('fshell.glsl').then(res => res.text());
    canvas = document.getElementById('shell-texture-canvas');
	rect = canvas.parentNode.getBoundingClientRect();

    if (!canvas) {
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer();

        document.body.appendChild(renderer.domElement);
		document.body.appendChild(stats.dom);
		renderer.setSize(window.innerWidth, window.innerHeight);
    } else {
		camera = new THREE.PerspectiveCamera(75, rect.innerWidth / rect.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ canvas: canvas });
		gui = new GUI( { autoPlace: false } );
		canvas.insertAdjacentElement( "afterEnd", gui.domElement);
		document.body.appendChild( stats.dom);
		
		renderer.setSize(rect.width, rect.height);
    }
    scene.background = new THREE.Color(0x224356);
    geomChanger();
    camera.position.set(1, 1, 0);
    camera.lookAt(0, 0, 0);
    // CONTROLS
    const cameraControls = new OrbitControls(camera, renderer.domElement);
    cameraControls.minDistance = 0.1;
    cameraControls.maxDistance = 5;
    cameraControls.enablePan = false;
    cameraControls.enableDamping = false;
    //cameraControls.autoRotate = true;
    //cameraControls.autoRotateSpeed = 100;
    // Gui Shell controls
    gui.add(controls, 'shellCount', 4, 256, 2).onChange(matChanger);
    gui.add(controls, 'shellHeight', 0.0, 1, 0.05).onChange(matChanger);
    gui.add(controls, 'density', 50, 2000, 10).onChange(matChanger);
    gui.add(controls, 'geometry', ['Plane', 'Sphere', 'Monkey', 'Torus']).onChange(geomChanger);
    // Add stats to scene
    animate();
}
function geomChanger() {
    if (controls.geometry === 'Plane') {
        geometry = new THREE.PlaneGeometry(controls.geomSize, controls.geomSize).rotateX(-Math.PI / 2);
    }
    else if (controls.geometry === 'Sphere') {
        geometry = new THREE.SphereGeometry(controls.geomSize / 2);
    }
    else if (controls.geometry === 'Torus') {
        geometry = new THREE.TorusKnotGeometry(10, 0.1).scale(0.1, 0.1, 0.1);
    }
    else if (controls.geometry == 'Monkey') {
        geometry = suzanne.children[0].geometry.scale(0.5, 0.5, 0.5);
    }
    if (shells.length > 0) {
        for (const shell of shells) {
            scene.remove(shell);
        }
        shells.length = 0;
    }
    for (let i = 0; i < controls.shellCount; ++i) {
        createShell(i);
    }
}
function matChanger() {
    for (const e in controls) {
        for (const shell of shells) {
            const shader = shell.material;
            if (e in shader.uniforms) {
                shader.uniforms[e].value = controls[e];
            }
        }
    }
    refreshScene();
}
function refreshScene() {
    if (shells.length > controls.shellCount) {
        for (let i = controls.shellCount; i < shells.length; ++i) {
            const shell = shells.pop();
            scene.remove(shell);
        }
    }
    else if (shells.length < controls.shellCount) {
        for (let i = shells.length; i < controls.shellCount; i++) {
            createShell(i);
        }
    }
}
function createShell(i) {
    /*let material = new THREE.ShaderMaterial({
        uniforms: {
            shellID: { value: i },
            shellCount: { value: controls.shellCount },
            shellHeight: { value: controls.shellHeight },
            color: { value: new THREE.Vector3(0.1, 0.6, 0.2) },
            density: { value: controls.density },
            dirLight: { value: new THREE.Vector3(0, 1, 1).normalize() },
        },
        vertexShader: vs,
        fragmentShader: fs,
        side: THREE.DoubleSide,
    });*/

	const material = new THREE.MeshDepthMaterial();

    const shell = new THREE.Mesh(geometry, material);
    shells.push(shell);
    scene.add(shell);
}
window.addEventListener('resize', () => {
	if (canvas) {
		var rect = canvas.parentNode.getBoundingClientRect();
		camera.aspect = rect.innerWidth / rect.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(rect.width, rect.height);

	} else {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
});
window.addEventListener('load', init);
//# sourceMappingURL=shell-texturing.js.map