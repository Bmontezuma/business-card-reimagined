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

  // Initialize Stats.js
  const stats = new Stats();
  document.body.appendChild(stats.dom);

  const updateStats = () => {
    stats.begin();
    stats.end();
    requestAnimationFrame(updateStats);
  };

  updateStats();

  // AR button logic
  document.getElementById("start-ar").addEventListener("click", async () => {
    document.getElementById("particles-js").style.display = "none"; // Hide particles
    document.querySelector(".container").style.display = "none"; // Hide main content
    startARSession();
  });
});

async function startARSession() {
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  const gl = canvas.getContext("webgl", { xrCompatible: true });

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    preserveDrawingBuffer: true,
    canvas,
    context: gl,
  });
  renderer.autoClear = false;

  const scene = new THREE.Scene();

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 7.5);
  scene.add(directionalLight);

  const camera = new THREE.PerspectiveCamera();
  camera.matrixAutoUpdate = false;

  const session = await navigator.xr.requestSession("immersive-ar", {
    requiredFeatures: ["hit-test"],
  });
  session.updateRenderState({
    baseLayer: new XRWebGLLayer(session, gl),
  });

  const referenceSpace = await session.requestReferenceSpace("local");

  const loader = new GLTFLoader();
  loader.load("./assets/models/business-card.glb", (gltf) => {
    const card = gltf.scene;
    card.scale.set(0.1, 0.1, 0.1);
    card.position.set(0, 0, -0.5);
    scene.add(card);
  });

  session.requestAnimationFrame((time, frame) => {
    renderer.render(scene, camera);
  });
}

