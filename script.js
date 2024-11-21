import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';

let camera, scene, renderer;

document.getElementById('startAR').addEventListener('click', () => {
  init();
  animate();
});

function init() {
  // Create the scene
  scene = new THREE.Scene();

  // Create a camera
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );

  // Create the renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  document.body.appendChild(renderer.domElement);

  // Add ARButton for AR mode
  document.body.appendChild(ARButton.createButton(renderer));

  // Add lighting
  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  scene.add(light);

  // Create the "business card" as a plane
  const geometry = new THREE.PlaneGeometry(0.2, 0.1); // 20cm x 10cm
  const material = new THREE.MeshBasicMaterial({ color: 0x007bff, side: THREE.DoubleSide });
  const plane = new THREE.Mesh(geometry, material);

  // Add the plane to the scene and position it in front of the camera
  plane.position.set(0, 0, -0.5); // Half a meter away from the camera
  scene.add(plane);
}

function animate() {
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
}

