/*
 * Copyright (c) 2023 Michael D Henderson.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

const fetchSector = function (x, y, z) {
    // systems in the current sector
    const sector = {
        // radius: 0, // initially unknown
        // minX:0, maxX:0, minY:0, maxY:0, minZ:0, maxZ:0,
        origin: {x: x, y: y, z: z},
        systems: [
            {x: 20, y: -4, z: 28, kind: "Yellow Main Sequence"},
            {x: 18, y: -3, z: 17, kind: "Dense Dust Cloud"},
            {x: 18, y: -2, z: 17, kind: "Medium Dust Cloud"},
            {x: 19, y: 7, z: -3, kind: "Blue Super Giant"},
            {x: 10, y: -5, z: 0, kind: "Blue Super Giant"},
            {x: -18, y: 7, z: -2, kind: "Yellow Main Sequence"},
            {x: 13, y: 7, z: 17, kind: "Medium Dust Cloud"},
            {x: 8, y: 11, z: -23, kind: "Dense Dust Cloud"},
            {x: 21, y: 10, z: 7, kind: "Yellow Main Sequence"},
            {x: 19, y: -14, z: -5, kind: "Yellow Main Sequence"},
            {x: -5, y: 9, z: 24, kind: "Blue Super Giant"},
            {x: -3, y: 17, z: -21, kind: "Light Dust Cloud"},
            {x: 20, y: 0, z: -7, kind: "Yellow Main Sequence"},
            {x: 8, y: 22, z: -18, kind: "Yellow Main Sequence"},
            {x: -25, y: -23, z: 5, kind: "Blue Super Giant"},
            {x: -24, y: 1, z: 23, kind: "Blue Super Giant"},
            {x: 1, y: -22, z: 11, kind: "Dense Dust Cloud"},
            {x: 20, y: -23, z: -2, kind: "Light Dust Cloud"}]
    };

    // determine the radius of the sector
    sector.systems.forEach((system, ndx) => {
        if (ndx === 0) {
            sector.minX = system.x
            sector.maxX = system.x
            sector.minY = system.y
            sector.maxY = system.y
            sector.minZ = system.z
            sector.maxZ = system.z
        }
        if (system.x < sector.minX) {
            sector.minX = system.x
        } else if (sector.maxX < system.x) {
            sector.maxX = system.x
        }
        if (system.y < sector.minY) {
            sector.minY = system.y
        } else if (sector.maxY < system.y) {
            sector.maxY = system.y
        }
        if (system.z < sector.minZ) {
            sector.minZ = system.z
        } else if (sector.maxZ < system.z) {
            sector.maxZ = system.z
        }
    });
    sector.radius = Math.max(sector.maxX - sector.minX, sector.maxY - sector.minY, sector.maxZ - sector.minZ) / 2 + 1;

    return sector;
}

const createScene = function (sector) {
    // This creates a basic Babylon Scene object (non-mesh)
    const scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'sphere' shape.
    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);

    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;

    // Our built-in 'ground' shape.
    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

    // add the stars and dust clouds to the scene
    sector.systems.forEach((system, ndx) => {
        const mesh = BABYLON.MeshBuilder.CreateSphere("obj-${ndx}", {diameter: 1, segments: 32}, scene);
        mesh.position.x = system.x;
        mesh.position.y = system.y;
        mesh.position.z = system.z;
    });

    return scene;
};

// Call the createScene function
const scene = createScene(fetchSector(0, 0, 0));

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});
