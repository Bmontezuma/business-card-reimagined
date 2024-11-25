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
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10);
  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  scene.add(light);

  // Load Business Card Model
  const loader = new GLTFLoader();
  loader.load("./assets/models/business-card.glb", (gltf) => {
    const card = gltf.scene;
    card.scale.set(0.1, 0.1, 0.1);
    card.position.set(0, 0, -1); // Place in front of the user
    scene.add(card);
  });

  // Add Hotspots
  const hotspots = [
    { label: "ArtStation", link: "https://www.artstation.com/brandonmontezuma6", position: new THREE.Vector3(-0.5, 0, -1) },
    { label: "GitHub", link: "https://github.com/Bmontezuma", position: new THREE.Vector3(0, 0, -1) },
    { label: "Instagram", link: "https://www.instagram.com/montezumashare/", position: new THREE.Vector3(0.5, 0, -1) },
    { label: "Email", link: "mailto:brandon.montezuma@yahoo.com", position: new THREE.Vector3(-0.5, -0.5, -1) },
    { label: "Wix", link: "https://brandonmontezuma.wixsite.com/brandon-montezuma-3", position: new THREE.Vector3(0, -0.5, -1) },
    { label: "LinkedIn", link: "https://www.linkedin.com/in/brandon-montezuma/", position: new THREE.Vector3(0.5, -0.5, -1) },
  ];

  hotspots.forEach((spot) => {
    const hotspot = createHotspot(spot.label, spot.position, spot.link);
    scene.add(hotspot);
  });

  const session = await navigator.xr.requestSession("immersive-ar", {
    requiredFeatures: ["local-floor"],
  });
  renderer.xr.setSession(session);

  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
}

// Create a hotspot with a clickable label
function createHotspot(label, position, link) {
  const group = new THREE.Group();

  // Sphere for hotspot
  const geometry = new THREE.SphereGeometry(0.05, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.userData = { link };

  // Label
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = 256;
  canvas.height = 64;
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "white";
  context.font = "20px Arial";
  context.fillText(label, 10, 40);

  const texture = new THREE.CanvasTexture(canvas);
  const labelMaterial = new THREE.SpriteMaterial({ map: texture });
  const labelSprite = new THREE.Sprite(labelMaterial);
  labelSprite.scale.set(0.5, 0.125, 1);
  labelSprite.position.y = 0.1;

  group.add(sphere, labelSprite);
  group.position.copy(position);

  sphere.addEventListener("selectstart", () => {
    const infoBox = document.getElementById("info-box");
    infoBox.textContent = `Opening ${label}...`;
    infoBox.style.display = "block";
    setTimeout(() => {
      window.open(link, "_blank");
      infoBox.style.display = "none";
    }, 1000);
  });

  return group;
}

