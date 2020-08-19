import Config from './data/config';
import Main from './app/main';

import * as THREE from 'three';
import * as CANNON from 'cannon';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let app;

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

  app.cubes.map((cube, idx) => {
    let body = app.bodies[idx];
    cube.position.copy(body.position)
    cube.quaternion.copy(body.quaternion)

    body.applyForce(new CANNON.Vec3(
      -body.position.x,
      -body.position.y,
      -body.position.z
    ) , body.position)

    // cube.rotation.y += 0.03;
  })

  if (frameNumber % 2 === 0) {
    app.raycaster.setFromCamera(app.mouse, app.camera);
    let intersects = app.raycaster.intersectObjects( app.scene.children );
    for ( var i = 0; i < intersects.length; i++ ) {
      let obj = intersects[i].object;
      if (!obj.body) { continue }
      let body = intersects[i].object.body;
      body.applyImpulse(new CANNON.Vec3(0.01, .05, -0.01), body.position)

      // body.applyForce(new CANNON.Vec3(
      //   -body.position.x,
      //   -body.position.y,
      //   -body.position.z
      // ) , body.position)
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

var loader = new GLTFLoader()
loader.load('4xxi-cube.glb', (gltf) => {
  let obj = gltf.scene.children.find(item => item.name === 'Cube');
  console.log(obj)
  // app.scene.add(obj);


  let howMuch = 5;
  for (let x = 0; x < howMuch; x++) {
    let cube = new THREE.Mesh(obj.geometry, obj.material);
    let xCoord = (x - howMuch / 2 + .5) * 1.5;
    cube.position.set(xCoord, 0, 0);
    app.scene.add(cube);
    app.cubes.push(cube);

    let cubeBody = new CANNON.Body({
      mass: .1,
      position: new CANNON.Vec3(xCoord, 0, 0),
      shape: new CANNON.Box(new CANNON.Vec3(.5, .5, .5)),
      linearDamping: 0.4,
      angularDamping: 0.4,
    });

    cube.body = cubeBody;

    app.world.add(cubeBody);
    app.bodies.push(cubeBody);
  }



}, undefined, function ( error ) {

	console.info( error );

})


animate();