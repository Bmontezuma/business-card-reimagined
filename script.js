export function startApp(THREE, ARButton) {
  // Create the Three.js scene
  const container = document.getElementById('container');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  // Set up the WebGL renderer with WebXR enabled
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true; // Enable WebXR
  container.appendChild(renderer.domElement);

  // Add AR button to the page
  const arButton = ARButton.createButton(renderer);
  document.body.appendChild(arButton);

  // Add lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  // Add a basic object to the scene (main hologram panel)
  const mainPanelMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.7,
    emissive: 0x00ffff,
    emissiveIntensity: 0.5,
  });

  const mainPanel = new THREE.Mesh(new THREE.PlaneGeometry(2, 1), mainPanelMaterial);
  mainPanel.position.set(0, 1.5, -2);
  scene.add(mainPanel);

  // Add animation loop
  function animate() {
    renderer.render(scene, camera);
  }

  renderer.setAnimationLoop(animate);

  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

