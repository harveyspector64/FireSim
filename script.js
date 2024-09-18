// script.js

const canvas = document.getElementById('fireCanvas');
const ctx = canvas.getContext('2d');

// Resize canvas to fit the window
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Fire properties
const fireWidth = 300;
const fireHeight = 200;
let fireIntensity = 50; // Adjustable via slider

// Create a pixel array
let firePixels = [];
for (let i = 0; i < fireWidth * fireHeight; i++) {
  firePixels[i] = 0;
}

// Initialize fire at the bottom
function initializeFire() {
  for (let x = 0; x < fireWidth; x++) {
    const index = (fireHeight - 1) * fireWidth + x;
    firePixels[index] = fireIntensity;
  }
}

// Fire propagation algorithm
function propagateFire() {
  for (let y = 0; y < fireHeight - 1; y++) {
    for (let x = 0; x < fireWidth; x++) {
      const currentIndex = y * fireWidth + x;
      const decay = Math.floor(Math.random() * 3);
      const belowIndex = (y + 1) * fireWidth + x;
      const newIntensity = firePixels[belowIndex] - decay;
      firePixels[currentIndex - decay >= 0 ? currentIndex - decay : currentIndex] = newIntensity > 0 ? newIntensity : 0;
    }
  }
}

// Color palette for fire
const fireColors = [
  { r: 7, g: 7, b: 7 },
  { r: 31, g: 7, b: 7 },
  { r: 47, g: 15, b: 7 },
  { r: 71, g: 15, b: 7 },
  { r: 87, g: 23, b: 7 },
  { r: 103, g: 31, b: 7 },
  { r: 119, g: 31, b: 7 },
  { r: 143, g: 39, b: 7 },
  { r: 159, g: 47, b: 7 },
  { r: 175, g: 63, b: 7 },
  { r: 191, g: 71, b: 7 },
  { r: 199, g: 71, b: 7 },
  { r: 223, g: 79, b: 7 },
  { r: 223, g: 87, b: 7 },
  { r: 223, g: 87, b: 7 },
  { r: 215, g: 95, b: 7 },
  { r: 215, g: 95, b: 7 },
  { r: 215, g: 103, b: 15 },
  { r: 207, g: 111, b: 15 },
  { r: 207, g: 119, b: 15 },
  { r: 207, g: 127, b: 15 },
  { r: 207, g: 135, b: 23 },
  { r: 199, g: 135, b: 23 },
  { r: 199, g: 143, b: 23 },
  { r: 199, g: 151, b: 31 },
  { r: 191, g: 159, b: 31 },
  { r: 191, g: 159, b: 31 },
  { r: 191, g: 167, b: 39 },
  { r: 191, g: 167, b: 39 },
  { r: 191, g: 175, b: 47 },
  { r: 183, g: 175, b: 47 },
  { r: 183, g: 183, b: 47 },
  { r: 183, g: 183, b: 55 },
  { r: 207, g: 207, b: 111 },
  { r: 223, g: 223, b: 159 },
  { r: 239, g: 239, b: 199 },
  { r: 255, g: 255, b: 255 },
];

// Render the fire to the canvas
function renderFire() {
  const imageData = ctx.createImageData(fireWidth, fireHeight);
  for (let i = 0; i < firePixels.length; i++) {
    const color = fireColors[firePixels[i]];
    imageData.data[i * 4] = color.r;
    imageData.data[i * 4 + 1] = color.g;
    imageData.data[i * 4 + 2] = color.b;
    imageData.data[i * 4 + 3] = 255; // Fully opaque
  }

  // Scale the image data to fit the canvas
  ctx.imageSmoothingEnabled = false;
  const scaledCanvas = document.createElement('canvas');
  scaledCanvas.width = fireWidth;
  scaledCanvas.height = fireHeight;
  const scaledCtx = scaledCanvas.getContext('2d');
  scaledCtx.putImageData(imageData, 0, 0);

  // Clear main canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw scaled image
  ctx.drawImage(scaledCanvas, 0, 0, fireWidth, fireHeight, 0, 0, canvas.width, canvas.height);
}

// Animation loop
function animate() {
  propagateFire();
  renderFire();
  requestAnimationFrame(animate);
}

// Handle intensity changes
const intensitySlider = document.getElementById('intensity');
intensitySlider.addEventListener('input', (e) => {
  fireIntensity = parseInt(e.target.value, 10);
  initializeFire();
});

// Handle interactions (mouse and touch)
function addInteraction(x, y) {
  const canvasRect = canvas.getBoundingClientRect();
  const scaleX = fireWidth / canvas.width;
  const scaleY = fireHeight / canvas.height;
  const fireX = Math.floor(x * scaleX);
  const fireY = Math.floor(y * scaleY);
  const index = fireY * fireWidth + fireX;
  if (index >= 0 && index < firePixels.length) {
    firePixels[index] = fireIntensity;
  }
}

// Mouse events
canvas.addEventListener('mousedown', (e) => {
  addInteraction(e.clientX, e.clientY);
  canvas.addEventListener('mousemove', onMouseMove);
});
canvas.addEventListener('mouseup', () => {
  canvas.removeEventListener('mousemove', onMouseMove);
});
function onMouseMove(e) {
  addInteraction(e.clientX, e.clientY);
}

// Touch events for mobile
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  addInteraction(touch.clientX, touch.clientY);
});
canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  addInteraction(touch.clientX, touch.clientY);
});

// Initialize and start animation
initializeFire();
animate();
