import * as THREE from 'three';
import * as CANNON from 'cannon';
import TWEEN from 'tween.js';

export default class Main {

  constructor(container) {

    this.world = new CANNON.World();
    this.world.gravity.set(0, 0, 0);

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xfefefe );
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);

    // this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshLambertMaterial({
      color: 0xa0ff00
    });

    this.cubes = [];
    this.bodies = [];


    var light = new THREE.DirectionalLight(0x404040);
    light.position.set(1, 1, 1);
    this.scene.add(light);

    // var light = new THREE.DirectionalLight(0xa0a0a0);
    // light.position.set(-1, -1, -1);
    // this.scene.add(light);

    // var light = new THREE.DirectionalLight(0xa0a0a0);
    // light.position.set(1, -1, 1);
    // this.scene.add(light);

    // var light = new THREE.DirectionalLight(0xa0a0a0);
    // light.position.set(-1, 1, 1);
    // this.scene.add(light);

    var light = new THREE.AmbientLight( 0xd0d0d0 ); // soft white light
    this.scene.add( light );


    this.camera.position.z = 4;
  }
}