import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";

// Create Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);

// Add AR Button
document.body.appendChild(ARButton.createButton(renderer));

// Lighting
const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
scene.add(light);

// Business Card (Simple Plane with Tabs)
const planeGeometry = new THREE.PlaneGeometry(1, 0.5);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x333366, side: THREE.DoubleSide });
const card = new THREE.Mesh(planeGeometry, planeMaterial);
card.position.set(0, 0, -1.5); // Position the card slightly in front of the camera
scene.add(card);

// Tabs (Icons)
const tabData = [
  { label: "ArtStation", icon: "assets/icons/artstation.png", url: "https://www.artstation.com/brandonmontezuma6" },
  { label: "Instagram", icon: "assets/icons/instagram.png", url: "https://www.instagram.com/montezumashare/" },
  { label: "Wix", icon: "assets/icons/wix.png", url: "https://brandonmontezuma.wixsite.com/brandon-montezuma-3" },
  { label: "GitHub", icon: "assets/icons/github.png", url: "https://github.com/Bmontezuma" },
  { label: "LinkedIn", icon: "assets/icons/linkedin.png", url: "https://www.linkedin.com/in/brandon-montezuma/" },
  { label: "Contact", icon: "assets/icons/contact.png", url: "#" },
];

const tabGroup = new THREE.Group();
tabData.forEach((tab, index) => {
  const texture = new THREE.TextureLoader().load(tab.icon);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const geometry = new THREE.CircleGeometry(0.1, 32); // Circle for icons
  const icon = new THREE.Mesh(geometry, material);

  // Arrange icons horizontally below the card
  icon.position.set(-0.5 + index * 0.2, -0.35, -1.5);
  icon.userData = { url: tab.url }; // Store URL for click events
  tabGroup.add(icon);
});
scene.add(tabGroup);

// Handle Clicks
renderer.domElement.addEventListener("click", (event) => {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(tabGroup.children);

  if (intersects.length > 0) {
    const url = intersects[0].object.userData.url;
    if (url) window.open(url, "_blank");
  }
});

// Animate
const animate = () => {
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
};
animate();

