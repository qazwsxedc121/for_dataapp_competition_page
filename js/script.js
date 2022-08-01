
import * as THREE from 'three';
import { Vector3 } from 'three';
import {GLTFLoader} from './GLTFLoader.js';
import {RGBELoader} from './RGBELoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var width = window.innerWidth;
var height = window.innerHeight;
//const camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
camera.position.set( 5, 10, 10 );
camera.rotateOnAxis(camera.up, 0.5);
camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), -0.5);


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );

const axesHelper = new THREE.AxesHelper(5);

//light
const light = new THREE.AmbientLight( 0x404040 ); // soft white light
//scene.add( light );
const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add( directionalLight );

var modelReady = false;
var mixer;
var animationActions = [];
var activeAction;

const loader = new GLTFLoader();
loader.load('./stock_jump2.glb', function (gltf) {
    scene.add(gltf.scene);
    mixer = new THREE.AnimationMixer(gltf.scene);
    const animationAction = mixer.clipAction(gltf.animations[0]);
    animationActions.push(animationAction);
    activeAction = animationActions[0];
    modelReady = true;
    gltf.animations.forEach((clip)=> {
        mixer.clipAction(clip).play();
    });
}, undefined, function(error) {
    console.error(error);
});

new RGBELoader()
.load( 'pool_1k.hdr', function ( texture ) {

    texture.mapping = THREE.EquirectangularReflectionMapping;

    scene.environment = texture;
    scene.background = texture;
});

const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame( animate );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    if(modelReady){
        mixer.update(clock.getDelta());
    }
    renderer.render( scene, camera );
};

animate();