export function startApp(THREE, ARButton) {
  // Basic Three.js scene setup
  const container = document.getElementById('container');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  // Set up the WebGL renderer with WebXR enabled
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true; // Enable WebXR
  container.appendChild(renderer.domElement);

  // Safely check and add AR button
  if (ARButton && typeof ARButton.createButton === 'function') {
    const arButton = ARButton.createButton(renderer);
    document.body.appendChild(arButton);
  } else {
    console.error('ARButton or createButton is not defined');
  }

  // Add lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  // Add a simple hologram panel
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

  // Animation loop
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

