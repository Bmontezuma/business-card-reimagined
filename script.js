export function startApp(THREE, ARButton) {
  // Basic Three.js setup
  const container = document.getElementById('container');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  // WebGL renderer with WebXR enabled
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true; // Enable WebXR
  container.appendChild(renderer.domElement);

  // Add AR button
  const arButton = ARButton.createButton(renderer);
  document.body.appendChild(arButton);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  // Add main card
  const textureLoader = new THREE.TextureLoader();
  const cardTexture = textureLoader.load('path/to/card_texture.png'); // Replace with your image path

  const mainPanelMaterial = new THREE.MeshStandardMaterial({
    map: cardTexture, // Apply texture
    transparent: true,
    opacity: 1,
  });

  const mainPanel = new THREE.Mesh(new THREE.PlaneGeometry(2, 1), mainPanelMaterial);
  mainPanel.position.set(0, 0.5, -1); // Position the card lower and closer
  scene.add(mainPanel);

  // Add particles
  const particleCount = 100;
  const particleGeometry = new THREE.BufferGeometry();
  const particlePositions = [];

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.5 + Math.random() * 0.5;
    const y = Math.random() * 1 - 0.5;
    particlePositions.push(
      Math.cos(angle) * radius,
      y,
      Math.sin(angle) * radius
    );
  }

  particleGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(particlePositions, 3)
  );

  const particleMaterial = new THREE.PointsMaterial({
    color: 0x00ffff,
    size: 0.05,
    transparent: true,
    opacity: 0.8,
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // Add background
  const bgGeometry = new THREE.PlaneGeometry(10, 10);
  const bgMaterial = new THREE.MeshBasicMaterial({
    color: 0x001f3f, // Dark blue background
    transparent: true,
    opacity: 0.5,
  });

  const background = new THREE.Mesh(bgGeometry, bgMaterial);
  background.position.set(0, 0, -5); // Place far behind the scene
  scene.add(background);

  // Animation variables
  let particleRotationAngle = 0;
  let scaleDirection = 1;

  // Handle interactions
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  window.addEventListener('pointerdown', (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(mainPanel);

    if (intersects.length > 0) {
      alert('Card clicked! Replace with your interaction.');
    }
  });

  // Animation loop
  function animate() {
    // Animate particles
    particleRotationAngle += 0.01;
    particles.rotation.y = particleRotationAngle;

    // Scale card for a pulsing effect
    mainPanel.scale.x += 0.005 * scaleDirection;
    mainPanel.scale.y += 0.005 * scaleDirection;
    if (mainPanel.scale.x > 1.1 || mainPanel.scale.x < 1) {
      scaleDirection *= -1; // Reverse direction
    }

    // Ensure card faces the camera
    mainPanel.lookAt(camera.position);

    renderer.render(scene, camera);
  }

  renderer.setAnimationLoop(animate);

  // Handle window resizing
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

