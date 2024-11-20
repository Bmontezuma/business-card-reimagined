// Simplified AR Business Card Script
const initAR = () => {
  // Hide the landing page and show the AR container
  document.getElementById("landing-page").style.display = "none";
  document.getElementById("ar-container").style.display = "block";

  // Check for WebXR support
  if ('xr' in navigator) {
    // Set up Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.getElementById("ar-container").appendChild(renderer.domElement);

    // Lighting
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    // Business Card
    const planeGeometry = new THREE.PlaneGeometry(1, 0.5);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x333366, side: THREE.DoubleSide });
    const card = new THREE.Mesh(planeGeometry, planeMaterial);
    card.position.set(0, 0, -1.5);
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
    
    // Use TextureLoader with error handling
    const textureLoader = new THREE.TextureLoader();
    
    tabData.forEach((tab, index) => {
      textureLoader.load(
        tab.icon,
        (texture) => {
          const material = new THREE.MeshBasicMaterial({ map: texture });
          const geometry = new THREE.CircleGeometry(0.1, 32);
          const icon = new THREE.Mesh(geometry, material);
          icon.position.set(-0.5 + index * 0.2, -0.35, -1.5);
          icon.userData = { url: tab.url };
          tabGroup.add(icon);
        },
        undefined,
        (error) => {
          console.error('Error loading texture', error);
        }
      );
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
        if (url && url !== "#") window.open(url, "_blank");
      }
    });

    // Animate
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

  } else {
    alert("WebXR not supported in this browser");
  }
};

// Add Event Listener for the Start Button
document.getElementById("start-ar-button").addEventListener("click", initAR);
