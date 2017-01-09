// TODO: use svg instead... for click event
var container = document.getElementById('mountains'),
    renderer = new FSS.CanvasRenderer(),
    scene = new FSS.Scene(),
    light = new FSS.Light('#001888', '#00ffc3'),
    geometry = new FSS.Plane(container.offsetWidth, container.offsetHeight, 12, 12),
    material = new FSS.Material('#555555', '#FFFFFF'),
    mesh = new FSS.Mesh(geometry, material),
    now, start = Date.now();

function initialise() {
    scene.add(mesh);
    scene.add(light);

    container.appendChild(renderer.element);

    window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
    var width = container.offsetWidth, // No need to query these twice, when in an onresize they can be expensive
        height = container.offsetHeight;

    renderer.setSize(width, height);

    scene.remove(mesh); // Remove the mesh and clear the canvas
    renderer.clear();

    geometry = new FSS.Plane(width, height, 12, 12); // Recreate the plane and then mesh
    mesh = new FSS.Mesh(geometry, material);

    scene.add(mesh); // Readd the mesh
}

function animate() {
    now = Date.now() - start;

    light.setPosition(300 * Math.sin(now * 0.001), 200 * Math.cos(now * 0.0005), 60);

    renderer.render(scene);
    requestAnimationFrame(animate);
}

initialise();
resizeCanvas();
animate();