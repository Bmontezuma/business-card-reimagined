import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.153.0/build/three.module.js';
import { ARButton } from 'https://cdn.jsdelivr.net/npm/three@0.153.0/examples/jsm/webxr/ARButton.js';

let camera, scene, renderer;

document.addEventListener('DOMContentLoaded', () => {
  // Wait for the DOM to fully load
  const startARButton = document.getElementById('startAR');
  startARButton.addEventListener('click', () => {
    startARButton.style.display = 'none'; // Hide button after clicking
    init();
    animate();
  });
});

function init() {
  // Create a scene
  scene = new THREE.Scene();

  // Create a camera
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);

  // Create a renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  document.body.appendChild(renderer.domElement);

  // Add AR Button for enabling AR mode
  document.body.appendChild(ARButton.createButton(renderer));

  // Add lighting
  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  scene.add(light);

  // Add a plane (business card)
  const geometry = new THREE.PlaneGeometry(0.2, 0.1); // 20cm x 10cm
  const material = new THREE.MeshBasicMaterial({ color: 0x007bff, side: THREE.DoubleSide });
  const plane = new THREE.Mesh(geometry, material);
  plane.position.set(0, 0, -0.5); // Place half a meter away
  scene.add(plane);
}

function animate() {
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
}

