import * as THREE from "https://unpkg.com/three@0.126.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.126.0/examples/jsm/loaders/GLTFLoader.js";

let scene, camera, renderer, reticle, model, hitTestSource, referenceSpace;

// Start AR on button click
document.getElementById("startButton").addEventListener("click", async () => {
    document.getElementById("startButton").style.display = "none";
    await activateXR();
});

async function activateXR() {
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    const gl = canvas.getContext("webgl", { xrCompatible: true });

    renderer = new THREE.WebGLRenderer({ alpha: true, preserveDrawingBuffer: true, canvas, context: gl });
    renderer.autoClear = false;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera();
    camera.matrixAutoUpdate = false;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Debug Cube
    const debugCube = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.1, 0.1),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    debugCube.position.set(0, 0, -1);
    scene.add(debugCube);
    console.log("Debug cube added at:", debugCube.position);

    try {
        const session = await navigator.xr.requestSession("immersive-ar", {
            requiredFeatures: ["hit-test"],
            optionalFeatures: ["local-floor", "viewer"]
        });

        session.updateRenderState({
            baseLayer: new XRWebGLLayer(session, gl)
        });

        try {
            referenceSpace = await session.requestReferenceSpace("local");
            console.log("Using 'local' reference space.");
        } catch (error) {
            console.warn("'local' reference space not supported. Falling back to 'viewer'.", error);
            referenceSpace = await session.requestReferenceSpace("viewer");
            console.log("Using 'viewer' reference space.");
        }

        const viewerSpace = await session.requestReferenceSpace("viewer");
        hitTestSource = await session.requestHitTestSource({ space: viewerSpace });

        const loader = new GLTFLoader();

        // Load Reticle
        loader.load("https://immersive-web.github.io/webxr-samples/media/gltf/reticle/reticle.gltf", (gltf) => {
            reticle = gltf.scene;
            reticle.visible = false;
            scene.add(reticle);
            console.log("Reticle loaded successfully.");
        });

        // Load Custom Model
        loader.load("./assets/itfigurinefbx.glb", (gltf) => {
            model = gltf.scene;
            model.scale.set(0.5, 0.5, 0.5); // Adjust scale if necessary
            model.visible = false; // Initially hide the model
            scene.add(model);
            console.log("Model loaded successfully.");
        }, undefined, (error) => {
            console.error("Error loading model:", error);
        });

        session.addEventListener("select", onSelect);
        renderer.xr.setSession(session);
        session.requestAnimationFrame(onXRFrame);
    } catch (error) {
        console.error("WebXR session request failed:", error);
    }
}

function onSelect() {
    console.log("onSelect triggered!");

    if (model && reticle.visible) {
        console.log("Reticle visible, placing model at:", reticle.position);

        const clone = model.clone();
        clone.position.copy(reticle.position);
        scene.add(clone);

        console.log("Model placed successfully at:", clone.position);
    } else {
        console.log("Model not placed. Either reticle is not visible or model not loaded.");
    }
}

function onXRFrame(time, frame) {
    const session = frame.session;
    session.requestAnimationFrame(onXRFrame);

    const gl = renderer.getContext();
    gl.bindFramebuffer(gl.FRAMEBUFFER, session.renderState.baseLayer.framebuffer);

    const pose = frame.getViewerPose(referenceSpace);
    if (pose) {
        const view = pose.views[0];
        const viewport = session.renderState.baseLayer.getViewport(view);
        renderer.setSize(viewport.width, viewport.height);

        camera.matrix.fromArray(view.transform.matrix);
        camera.projectionMatrix.fromArray(view.projectionMatrix);
        camera.updateMatrixWorld(true);

        const hitTestResults = frame.getHitTestResults(hitTestSource);
        if (hitTestResults.length > 0) {
            const hitPose = hitTestResults[0].getPose(referenceSpace);
            reticle.visible = true;
            reticle.position.set(hitPose.transform.position.x, hitPose.transform.position.y, hitPose.transform.position.z);
            reticle.updateMatrixWorld(true);

            console.log("Reticle visible at:", reticle.position);
        } else {
            reticle.visible = false;
            console.log("No valid surface detected for reticle.");
        }

        renderer.render(scene, camera);
    }
}

