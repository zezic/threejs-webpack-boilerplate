import Main from './main';

import {
  Euler,
  InstancedMesh,
  Matrix4,
  Vector3,
  Quaternion
} from 'three';

import { Body, Box, Vec3 } from 'cannon';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let app;

let howMuch = 20;

function init() {
  const container = document.getElementById('appContainer');
  app = new Main(container);
  window.app = app
}

let lastTime;
let fixedTimeStep = 1.0 / 60.0; // seconds
let maxSubSteps = 3;

let frameNumber = 0;

function animate(time) {
  requestAnimationFrame(animate);

  frameNumber++;
  app.renderer.render(app.scene, app.camera);

  if (lastTime !== undefined) {
    var dt = (time - lastTime) / 1000;
    app.world.step(fixedTimeStep, dt, maxSubSteps);
  }

  app.bodies.map((cube, idx) => {
    let body = app.bodies[idx];

    var matrix = new Matrix4();

    var position = new Vector3();
    var quaternion = new Quaternion();
    var scale = new Vector3();
    scale.x = scale.y = scale.z = 1;

    position.copy(body.position)
    quaternion.copy(body.quaternion)

    matrix.compose( position, quaternion, scale );

    app.mesh.setMatrixAt(idx, matrix);

    let originalPosition = app.positions[idx];

    body.applyForce(new Vec3(
      (originalPosition.x - body.position.x) * 1,
      (originalPosition.y - body.position.y) * 1,
      (originalPosition.z - body.position.z) * 1
    ) , body.position)
  })

  app.mesh.instanceMatrix.needsUpdate = true

  if (frameNumber % 3 === 0) { // 20 FPS for mouse events
    app.raycaster.setFromCamera(app.mouse, app.camera);
    let intersects = app.raycaster.intersectObjects( app.scene.children );

    // console.log(intersects)

    for ( var i = 0; i < intersects.length; i++ ) {
      if (intersects[i].object.name === 'plane') { continue; }
      let instanceId = intersects[i].instanceId;
      // if (!obj.body) { continue }
      let body = app.bodies[instanceId];
      // body.applyImpulse(new Vec3(0.0, 0.05, 0.0), body.position)

      body.applyForce(new Vec3(
        body.position.x * 1,
        body.position.y * 1,
        body.position.z * .2
      ) , body.position)
    }
  }

  lastTime = time;
}

function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	app.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	app.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

window.addEventListener( 'mousemove', onMouseMove, false );

init();

var randomizeMatrix = function () {

  var position = new Vector3();
  var rotation = new Euler();
  var quaternion = new Quaternion();
  var scale = new Vector3();

  return function ( matrix ) {

    position.x = Math.random() * 6 - 3;
    position.y = Math.random() * 4 - 2;
    position.z = Math.random() * 2 - 1;

    rotation.x = Math.random() * 2 * Math.PI;
    rotation.y = Math.random() * 2 * Math.PI;
    rotation.z = Math.random() * 2 * Math.PI;

    quaternion.setFromEuler( rotation );

    // scale.x = scale.y = scale.z = Math.random() * 1;
    scale.x = scale.y = scale.z = 1;

    matrix.compose( position, quaternion, scale );

  };

}();

var loader = new GLTFLoader()
loader.load('4xxi-cube.glb', (gltf) => {
  let obj = gltf.scene.children.find(item => item.name === 'Cube');
  // app.scene.add(obj);


  // let cube = new THREE.Mesh(app.geometry, app.material);
  var matrix = new Matrix4();
  let mesh = new InstancedMesh(obj.geometry, obj.material, howMuch);
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  app.mesh = mesh;
  for (var i = 0; i < howMuch; i ++) {
    randomizeMatrix(matrix);
    mesh.setMatrixAt(i, matrix);

    let tmpMatrix = new Matrix4();
    mesh.getMatrixAt(i, tmpMatrix);

    let position = new Vector3();
    let quaternion = new Quaternion();
    let scale = new Vector3();
    let out = tmpMatrix.decompose(position, quaternion, scale);

    let cubeBody = new Body({
      mass: .1,
      position: new Vec3(position.x, position.y, position.z),
      quaternion: new Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w),
      shape: new Box(new Vec3(.5, .5, .5)),
      linearDamping: 0.9,
      angularDamping: 0.3,
    });

    app.bodies.push(cubeBody);
    app.positions.push(position);
    app.world.add(cubeBody);
  }
  app.scene.add(mesh)

  animate();

  // for (let x = 0; x < howMuch; x++) {
  //   let xCoord = (x - howMuch / 2 + .5) * 1.5;
  //   cube.position.set(xCoord, 0, 0);
  //   app.scene.add(cube);
  //   app.cubes.push(cube);


  //   cube.body = cubeBody;

  //   app.world.add(cubeBody);
  //   app.bodies.push(cubeBody);
  // }



}, undefined, function ( error ) {

	console.info( error );

})

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    app.camera.aspect = window.innerWidth / window.innerHeight;
    app.camera.updateProjectionMatrix();

    app.renderer.setSize( window.innerWidth, window.innerHeight );

}

