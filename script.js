document.addEventListener('DOMContentLoaded', () => {
    const startARButton = document.getElementById('start-ar');
    const arOverlay = document.getElementById('ar-overlay');

    // Check if WebXR is supported
    if ('xr' in navigator) {
        startARButton.addEventListener('click', async () => {
            try {
                // Request an AR session
                const session = await navigator.xr.requestSession('immersive-ar', {
                    requiredFeatures: ['hit-test']
                });

                // Hide start button, prepare AR scene
                startARButton.style.display = 'none';
                arOverlay.classList.remove('hidden');

                // Create WebXR layer
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('webgl');
                const glLayer = new XRWebGLLayer(session, context);

                // Reference space for hit testing
                const referenceSpace = await session.requestReferenceSpace('local');

                // Hit test source to place the AR card
                const hitTestSource = await session.requestHitTestSource({
                    space: referenceSpace,
                    entityTypes: ['plane', 'point']
                });

                // AR rendering loop
                function onXRFrame(time, frame) {
                    const pose = frame.getViewerPose(referenceSpace);
                    
                    if (pose) {
                        // Perform hit test
                        const hitTestResults = frame.getHitTestResults(hitTestSource);
                        
                        if (hitTestResults.length > 0) {
                            // Get first hit test result
                            const hitPose = hitTestResults[0].getPose(referenceSpace);
                            
                            // Here you could place your 3D business card at the hit point
                            // For now, we'll just log the hit location
                            console.log('AR Card Placement Point:', hitPose.transform.position);
                        }
                    }

                    // Continue the AR session
                    session.requestAnimationFrame(onXRFrame);
                }

                // Start the AR frame loop
                session.requestAnimationFrame(onXRFrame);

            } catch (error) {
                console.error('AR Session Error:', error);
                alert('Unable to start AR experience. Make sure you have a compatible device and browser.');
            }
        });
    } else {
        // No WebXR support
        startARButton.textContent = 'AR Not Supported';
        startARButton.style.backgroundColor = 'red';
    }
});
