document.addEventListener('DOMContentLoaded', () => {
    const startARButton = document.getElementById('start-ar');
    const arOverlay = document.getElementById('ar-overlay');
    const arScene = document.getElementById('ar-scene');

    // WebXR Setup
    if ('xr' in navigator) {
        startARButton.addEventListener('click', async () => {
            try {
                const xrSession = await navigator.xr.requestSession('immersive-ar');
                xrSession.addEventListener('end', () => {
                    arOverlay.classList.add('hidden');
                });

                const canvas = document.createElement('canvas');
                arScene.appendChild(canvas);

                const gl = canvas.getContext('webgl', { xrCompatible: true });
                const renderer = new THREE.WebGLRenderer({
                    canvas: canvas,
                    context: gl
                });

                // 3D Business Card Scene
                const scene = new THREE.Scene();
                const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

                // Create a floating 3D business card
                const cardGeometry = new THREE.PlaneGeometry(1, 0.6);
                const cardTexture = new THREE.TextureLoader().load('business-card-texture.png');
                const cardMaterial = new THREE.MeshBasicMaterial({ map: cardTexture });
                const cardMesh = new THREE.Mesh(cardGeometry, cardMaterial);
                scene.add(cardMesh);

                // Animate card
                function animate() {
                    cardMesh.rotation.y += 0.01;
                    renderer.render(scene, camera);
                    xrSession.requestAnimationFrame(animate);
                }

                xrSession.requestAnimationFrame(animate);
                arOverlay.classList.remove('hidden');
            } catch (error) {
                console.error('WebXR not supported', error);
                alert('WebXR is not supported on this device.');
            }
        });
    } else {
        startARButton.textContent = 'WebXR Not Supported';
        startARButton.style.backgroundColor = 'red';
    }
});
