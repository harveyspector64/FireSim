// Set up the scene, camera, and renderer
let scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.35);

let camera = new THREE.PerspectiveCamera(
    60, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.z = 3;

let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Responsive handling
window.addEventListener('resize', onWindowResize, false);
function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Create the particle system for the fire
let particleCount = 5000;
let particles = new THREE.BufferGeometry();
let positions = [];
let velocities = [];
let colors = [];

for (let i = 0; i < particleCount; i++) {
    // Initial positions
    positions.push((Math.random() - 0.5) * 0.5); // x
    positions.push(0);                           // y
    positions.push((Math.random() - 0.5) * 0.5); // z

    // Velocities
    velocities.push(0);                          // x
    velocities.push(Math.random() * 0.02 + 0.01); // y
    velocities.push(0);                          // z

    // Colors (starting with a fire-like color)
    colors.push(1, 0.5, 0); // RGB
}

particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
particles.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3));
particles.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

let particleMaterial = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthTest: false
});

let particleSystem = new THREE.Points(particles, particleMaterial);
scene.add(particleSystem);

// Slider to control fire intensity
let intensitySlider = document.getElementById('intensitySlider');
intensitySlider.addEventListener('input', function() {
    let intensity = parseFloat(intensitySlider.value);
    let velocities = particles.attributes.velocity.array;
    for (let i = 0; i < particleCount; i++) {
        velocities[i * 3 + 1] = (Math.random() * 0.02 + 0.01) * intensity;
    }
    particles.attributes.velocity.needsUpdate = true;

    // Adjust particle size based on intensity
    particleMaterial.size = 0.2 * intensity + 0.05;
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    let positions = particles.attributes.position.array;
    let velocities = particles.attributes.velocity.array;
    let colors = particles.attributes.color.array;
    let intensity = parseFloat(intensitySlider.value);

    for (let i = 0; i < particleCount; i++) {
        // Update positions
        positions[i * 3 + 1] += velocities[i * 3 + 1];

        // Reset particle if it goes too high
        if (positions[i * 3 + 1] > 2) {
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 0] = (Math.random() - 0.5) * 0.5;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
            velocities[i * 3 + 1] = (Math.random() * 0.02 + 0.01) * intensity;

            // Reset colors
            colors[i * 3 + 0] = 1;   // R
            colors[i * 3 + 1] = 0.5; // G
            colors[i * 3 + 2] = 0;   // B
        } else {
            // Change color to simulate cooling (from red to yellow to white)
            colors[i * 3 + 0] = Math.min(colors[i * 3 + 0] + 0.005, 1);
            colors[i * 3 + 1] = Math.min(colors[i * 3 + 1] + 0.01, 1);
            colors[i * 3 + 2] = Math.min(colors[i * 3 + 2] + 0.015, 1);
        }
    }

    particles.attributes.position.needsUpdate = true;
    particles.attributes.color.needsUpdate = true;

    renderer.render(scene, camera);
}

animate();
