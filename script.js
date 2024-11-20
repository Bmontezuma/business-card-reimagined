let scene, camera, renderer, card, particleSystem;

// Initialize AR Card
function initARCard() {
  // Create Scene
  scene = new THREE.Scene();
  
  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 5);

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('ar-card'), alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Card - Holographic Pane
  const cardGeometry = new THREE.PlaneGeometry(3, 2);
  const cardMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide,
  });
  card = new THREE.Mesh(cardGeometry, cardMaterial);
  scene.add(card);

  // Add platform sections
  addPlatformSections();

  // Add particle effects
  createParticles();

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  const pointLight = new THREE.PointLight(0x00d4ff, 1, 100);
  pointLight.position.set(5, 5, 5);
  scene.add(ambientLight, pointLight);

  // Animate
  animate();
}

// Function to add platform sections (LinkedIn, GitHub, etc.)
function addPlatformSections() {
  const platforms = [
    { name: "ArtStation", position: { x: -1.2, y: 0.8, z: 0.1 } },
    { name: "LinkedIn", position: { x: 1.2, y: 0.8, z: 0.1 } },
    { name: "Contact", position: { x: -1.2, y: -0.2, z: 0.1 } },
    { name: "GitHub", position: { x: 1.2, y: -0.2, z: 0.1 } },
    { name: "Resume", position: { x: -1.2, y: -1.2, z: 0.1 } },
    { name: "Instagram", position: { x: 1.2, y: -1.2, z: 0.1 } },
    { name: "Facebook", position: { x: 0, y: -1.8, z: 0.1 } },
  ];

  platforms.forEach(({ name, position }) => {
    // Placeholder for icons or text labels
    const labelGeometry = new THREE.PlaneGeometry(0.6, 0.3);
    const labelMaterial = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.5,
    });

    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.position.set(position.x, position.y, position.z);
    scene.add(label);

    // Placeholder for text (using CSS2DRenderer or BitmapText if needed)
    const loader = new THREE.TextureLoader();
    loader.load(
      `./assets/${name.toLowerCase()}.png`, // Path to icon images
      (texture) => {
        label.material.map = texture;
        label.material.needsUpdate = true;
      },
      undefined,
      () => console.error(`Failed to load ${name} icon.`)
    );
  });
}

// Function to create particle effects
function createParticles() {
  const particleCount = 200;
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesMaterial = new THREE.PointsMaterial({
    color: 0x00d4ff,
    size: 0.05,
    transparent: true,
  });

  // Particle positions
  const positions = [];
  for (let i = 0; i < particleCount; i++) {
    positions.push((Math.random() - 0.5) * 5);
    positions.push((Math.random() - 0.5) * 5);
    positions.push((Math.random() - 0.5) * 5);
  }

  particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particleSystem);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the card and particles
  card.rotation.y += 0.01;
  if (particleSystem) particleSystem.rotation.y += 0.005;

  renderer.render(scene, camera);
}

// Start AR on button click
function startAR() {
  document.getElementById('start-ar').style.display = 'none';
  document.getElementById('card-container').style.display = 'block';
  initARCard();
}

// Handle resizing
window.addEventListener('resize', () => {
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
});

