import * as THREE from "https://unpkg.com/three@0.126.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.126.0/examples/jsm/loaders/GLTFLoader.js";

document.addEventListener("DOMContentLoaded", () => {
  particlesJS("particles-js", {
    particles: { ... }, // Unchanged: Your existing particles.js setup
  });

  document.getElementById("start-ar").addEventListener("click", () => {
    document.getElementById("particles-js").style.display = "none";
    document.querySelector(".container").style.display = "none";
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

  const loader = new GLTFLoader();
  loader.load("./assets/models/business-card.glb", (gltf) => {
    const card = gltf.scene;
    card.scale.set(0.1, 0.1, 0.1);
    card.position.set(0, 0, -1);
    scene.add(card);
  });

  // Add hotspots
  const hotspots = [
    { label: "ArtStation", link: "https://www.artstation.com", position: new THREE.Vector3(-0.5, 0, -1) },
    { label: "GitHub", link: "https://github.com", position: new THREE.Vector3(0, 0, -1) },
    { label: "Instagram", link: "https://www.instagram.com", position: new THREE.Vector3(0.5, 0, -1) },
    { label: "Email", link: "mailto:example@example.com", position: new THREE.Vector3(-0.5, -0.5, -1) },
    { label: "Wix", link: "https://www.wix.com", position: new THREE.Vector3(0, -0.5, -1) },
    { label: "LinkedIn", link: "https://www.linkedin.com", position: new THREE.Vector3(0.5, -0.5, -1) },
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

// Create an interactable hotspot
function createHotspot(label, position, link) {
  const group = new THREE.Group();

  const geometry = new THREE.SphereGeometry(0.05, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.userData = { link };

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

