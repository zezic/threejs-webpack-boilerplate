import {
  AmbientLight,
  DirectionalLight,
  DoubleSide,
  Color,
  Mesh,
  MeshBasicMaterial,
  PCFSoftShadowMap,
  PlaneGeometry,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  WebGLRenderer
} from 'three';

import { World } from 'cannon';
// import TWEEN from 'tween.js';

export default class Main {

  constructor(container) {

    this.world = new World();
    this.world.gravity.set(0, 0, 0);

    this.raycaster = new Raycaster();
    this.mouse = new Vector2();
    this.mouse.x = -1
    this.mouse.y = -1

    this.container = container;
    this.scene = new Scene();
    this.scene.background = new Color( 0xfefefe );
    this.camera = new PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new WebGLRenderer({ antialias: true });
    // this.renderer = new WebGLRenderer();
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);

    this.bodies = [];
    this.positions = [];

    var geometry = new PlaneGeometry( 20, 20 );
    var material = new MeshBasicMaterial( {color: 0xFCFCFC, side: DoubleSide} );
    var plane = new Mesh( geometry, material );
    plane.position.z = -2;
    plane.receiveShadow = true;
    plane.name = 'plane';
    this.scene.add( plane );


    var light = new AmbientLight( 0xe5e5e5 ); // soft white light
    this.scene.add( light );


    var light = new DirectionalLight(0x181A1D);
    light.position.set(1, -.5, .5);

    light.castShadow = true;
    light.shadow.mapSize.width = 16;
    light.shadow.mapSize.height = 16;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 20;

    this.scene.add(light);

    var light = new DirectionalLight(0x161616);
    light.position.set(1, .5, .5);

    light.castShadow = true;
    light.shadow.mapSize.width = 16;
    light.shadow.mapSize.height = 16;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 20;

    this.scene.add(light);

    var light = new DirectionalLight(0x1F1C1C);
    light.position.set(-1, -.2, .5);

    light.castShadow = true;
    light.shadow.mapSize.width = 16;
    light.shadow.mapSize.height = 16;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 20;

    this.scene.add(light);

    this.camera.position.z = 6;
  }
}