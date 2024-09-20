// app.js
let scene, camera, renderer, particles, particleMaterial;
let flameHeight = 50;

function init() {
  // Set up scene
  scene = new THREE.Scene();

  // Set up camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.z = 50;

  // Set up renderer
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('fireCanvas'), alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Create particle system
  const particleCount = 1000;
  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];
  const sizes = [];

  for (let i = 0; i < particleCount; i++) {
    positions.push(
      (Math.random() - 0.5) * 50,
      Math.random() * flameHeight,
      (Math.random() - 0.5) * 50
    );
    colors.push(1.0, Math.random() * 0.5, 0.0); // Reddish colors
    sizes.push(Math.random() * 5);
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

  const vertexShader = `
    attribute float size;
    attribute vec3 color;
    varying vec3 vColor;
    void main() {
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    varying vec3 vColor;
    void main() {
      float alpha = 1.0 - length(gl_PointCoord - vec2(0.5));
      gl_FragColor = vec4(vColor, alpha);
    }
  `;

  particleMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  particles = new THREE.Points(geometry, particleMaterial);
  scene.add(particles);

  // Event listeners
  window.addEventListener('resize', onWindowResize, false);
  setupControls();
  setupInteractions();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function setupControls() {
  const flameControl = document.getElementById('flameControl');
  flameControl.addEventListener('input', (e) => {
    flameHeight = e.target.value;
    updateFlameHeight();
  });
}

function updateFlameHeight() {
  const positions = particles.geometry.attributes.position.array;
  for (let i = 1; i < positions.length; i += 3) {
    positions[i] = Math.random() * flameHeight;
  }
  particles.geometry.attributes.position.needsUpdate = true;
}

function setupInteractions() {
  const canvas = document.getElementById('fireCanvas');
  canvas.addEventListener('pointermove', onPointerMove, false);
}

function onPointerMove(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  const vector = new THREE.Vector3(x, y, 0.5).unproject(camera);
  const dir = vector.sub(camera.position).normalize();
  const distance = -camera.position.y / dir.y;
  const pos = camera.position.clone().add(dir.multiplyScalar(distance));

  // Update particles positions near the touch
  const positions = particles.geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    const dx = positions[i] - pos.x;
    const dz = positions[i + 2] - pos.z;
    const distanceSq = dx * dx + dz * dz;
    if (distanceSq < 100) { // Adjust influence radius
      positions[i] += dx * 0.05;
      positions[i + 2] += dz * 0.05;
    }
  }
  particles.geometry.attributes.position.needsUpdate = true;
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

init();
animate();
