// Add event listener for AR button
document.getElementById('start-ar').addEventListener('click', () => {
    // Hide the main container
    document.getElementById('container').style.display = 'none';

    // Initialize Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    // Add AR button
    document.body.appendChild(THREE.ARButton.createButton(renderer));

    // Main plane with "Brandon Montezuma"
    const mainPlaneGeometry = new THREE.PlaneGeometry(1, 0.5);
    const mainPlaneMaterial = new THREE.MeshBasicMaterial({
        color: 0x228b22, // Green color
        side: THREE.DoubleSide,
    });
    const mainPlane = new THREE.Mesh(mainPlaneGeometry, mainPlaneMaterial);
    mainPlane.position.set(0, 0, -2); // Position in front of the camera
    scene.add(mainPlane);

    // Add text to the main plane
    const loader = new THREE.TextureLoader();
    loader.load('assets/images/name-texture.png', (texture) => {
        mainPlane.material.map = texture;
        mainPlane.material.needsUpdate = true;
    });

    // Smaller interactive planes
    const planes = [];
    const planeInfo = [
        { text: 'Contact Info', offset: -1 },
        { text: 'Portfolio', offset: 0 },
        { text: 'About Me', offset: 1 },
    ];

    planeInfo.forEach((info, i) => {
        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(0.8, 0.4),
            new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.DoubleSide }) // Sky-blue planes
        );
        plane.position.set(info.offset, -0.6, -2.5); // Offset horizontally
        plane.userData = { text: info.text };
        scene.add(plane);
        planes.push(plane);
    });

    // Add interaction
    renderer.domElement.addEventListener('click', (event) => {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(planes);

        if (intersects.length > 0) {
            const clickedPlane = intersects[0].object;
            alert(`You clicked: ${clickedPlane.userData.text}`);
        }
    });

    // Animation loop
    const animate = () => {
        renderer.setAnimationLoop(() => {
            renderer.render(scene, camera);
        });
    };
    animate();
});

