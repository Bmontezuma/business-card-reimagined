import * as THREE from "https://unpkg.com/three@0.126.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.126.0/examples/jsm/loaders/GLTFLoader.js";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize particles.js
  particlesJS("particles-js", {
    particles: {
      number: { value: 189, density: { enable: true, value_area: 631 } },
      color: { value: "#043df5" },
      shape: { type: "circle", stroke: { width: 2, color: "#021ffc" } },
      opacity: { value: 0.4 },
      size: { value: 60, random: true, anim: { enable: true, speed: 34, size_min: 6 } },
      line_linked: { enable: true, distance: 150, color: "#000", opacity: 0.4, width: 1 },
      move: { enable: true, speed: 4, random: true, out_mode: "bounce" },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "repulse" },
        onclick: { enable: true, mode: "push" },
      },
    },
    retina_detect: true,
  });

  // Stats.js setup
  const stats = new Stats();
  stats.showPanel(0);
  document.body.appendChild(stats.dom);

  // Particle counter
  const countParticles = document.querySelector(".js-count-particles");
  const updateStats = () => {
    stats.begin();
    stats.end();
    if (window.pJSDom[0]?.pJS.particles?.array) {
      countParticles.innerText = window.pJSDom[0].pJS.particles.array.length;
    }
    requestAnimationFrame(updateStats);
  };
  updateStats();

  // Start AR session
  document.getElementById("start-ar").addEventListener("click", startARSession);
});

function startARSession() {
  document.body.innerHTML = ""; // Clear the page
  initializeThreeJS(); // Initialize AR scene
}

function initializeThreeJS() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Add light
  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  // Placeholder 3D object
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({ color: 0x4cc3d9 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 5;

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();
}

