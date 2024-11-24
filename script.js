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
      size: { value: 60, random: true },
      line_linked: { enable: true, distance: 150, color: "#000" },
      move: { enable: true, speed: 4, out_mode: "bounce" },
    },
    interactivity: {
      detect_on: "canvas",
      events: { onhover: { enable: true, mode: "repulse" } },
    },
    retina_detect: true,
  });

  // Start AR button logic
  document.getElementById("start-ar").addEventListener("click", () => {
    document.getElementById("particles-js").style.display = "none"; // Hide particles
    document.querySelector(".container").style.display = "none"; // Hide main content
    startARSession();
  });
});

async function startARSession() {
  // WebGL Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true; // Enable WebXR
  document.body.appendChild(renderer.domElement);

  // Scene and Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  // Light
  const light = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(light);

  // Load Business Card
  const loader = new GLTFLoader();
  loader.load("./assets/models/business-card.glb", (gltf) => {
    const card = gltf.scene;
    card.scale.set(0.1, 0.1, 0.1);
    card.position.set(0, 0, -1); // Place in front of the user
    scene.add(card);
  });

  // Animation Loop
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });

  // Start AR session
  const session = await navigator.xr.requestSession("immersive-ar", {
    requiredFeatures: ["local-floor"],
  });
  renderer.xr.setSession(session);
}

