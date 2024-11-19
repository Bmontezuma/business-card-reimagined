export function startApp(THREE, ARButton) {
  // Basic Three.js scene setup
  const container = document.getElementById('container');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true; // Enable WebXR
  container.appendChild(renderer.domElement);

  // Add AR button
  document.body.appendChild(ARButton.createButton(renderer));

  // Add lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  // Create main hologram panel
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

  // Load and add text to the panel
  const loader = new THREE.FontLoader();
  loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeometry = new THREE.TextGeometry('Your Name\nAR/VR Developer', {
      font: font,
      size: 0.2,
      height: 0.05,
    });

    const textMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(-0.9, 1.2, -2);
    scene.add(textMesh);
  });

  // Add rotating panels
  const parent = new THREE.Object3D();
  scene.add(parent);

  const panelMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.6,
  });

  ['Portfolio', 'Resume', 'Contact'].forEach((text, index) => {
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.75), panelMaterial);
    const angle = (index / 3) * Math.PI * 2;
    panel.position.set(Math.cos(angle) * 2, 0.5, Math.sin(angle) * 2);
    panel.rotation.y = angle + Math.PI / 2;

    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
      const textGeometry = new THREE.TextGeometry(text, {
        font: font,
        size: 0.1,
        height: 0.02,
      });
      const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(-0.6, -0.2, 0.01);
      panel.add(textMesh);
    });

    parent.add(panel);
  });

  // Add orbiting particles
  const particleCount = 100;
  const particleGeometry = new THREE.BufferGeometry();
  const particlePositions = [];

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 2.5 + Math.random() * 0.5;
    const y = Math.random() * 1 - 0.5;
    particlePositions.push(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
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

  // Animation loop
  function animate() {
    parent.rotation.y += 0.01; // Rotate panels
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

