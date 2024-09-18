// script.js

// Get canvas and context
const canvas = document.getElementById('fireCanvas');
const ctx = canvas.getContext('2d');

// Resize canvas to fit the window
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  console.log(`Canvas resized to ${canvas.width}x${canvas.height}`);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Fire properties
const fireWidth = 300;  // Number of pixels horizontally
const fireHeight = 200; // Number of pixels vertically
let fireIntensity = 18; // Initial intensity (0-36)

// Display current intensity
const intensitySlider = document.getElementById('intensity');
const intensityValue = document.getElementById('intensityValue');
intensityValue.textContent = fireIntensity;

// Create a pixel array initialized to 0
let firePixels = new Array(fireWidth * fireHeight).fill(0);

// Color palette for fire (0-36)
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

// Ensure fireColors array is correctly defined
console.log(`fireColors length: ${fireColors.length}`);

// Initialize fire by setting the bottom row to fireIntensity
function initializeFire() {
  console.log('Initializing fire...');
  for (let x = 0; x < fireWidth; x++) {
    const index = (fireHeight - 1) * fireWidth + x;
    firePixels[index] = fireIntensity;
    // Debug: Log the initial intensity
    if (x === 0 || x === fireWidth - 1) {
      console.log(`firePixels[${index}] = ${firePixels[index]}`);
    }
  }
}

// Fire propagation algorithm
function propagateFire() {
  for (let y = 0; y < fireHeight - 1; y++) {
    for (let x = 0; x < fireWidth; x++) {
      const currentIndex = y * fireWidth + x;
      const belowIndex = (y + 1) * fireWidth + x;

      const decay = Math.floor(Math.random() * 3); // Random decay between 0-2
      const newIntensity = firePixels[belowIndex] - decay;

      // Ensure the new intensity is within bounds
      const clampedIntensity = newIntensity > 0 ? newIntensity : 0;

      // Update the current pixel with the new intensity
      firePixels[currentIndex] = clampedIntensity;

      // Debug: Log some updates
      if (y === 0 && (x === 0 || x === fireWidth - 1)) {
        console.log(`firePixels[${currentIndex}] updated to ${firePixels[currentIndex]}`);
      }
    }
  }
}

// Render the fire to the canvas
function renderFire() {
  // Create ImageData object
  const imageData = ctx.createImageData(fireWidth, fireHeight);

  for (let i = 0; i < firePixels.length; i++) {
    const colorIndex = firePixels[i];

    // Ensure colorIndex is within the fireColors array
    if (colorIndex >= fireColors.length) {
      console.warn(`colorIndex ${colorIndex} out of bounds at firePixels[${i}]`);
      continue;
    }

    const color = fireColors[colorIndex] || { r: 0, g: 0, b: 0 };

    imageData.data[i * 4] = color.r;     // Red
    imageData.data[i * 4 + 1] = color.g; // Green
    imageData.data[i * 4 + 2] = color.b; // Blue
    imageData.data[i * 4 + 3] = 255;     // Alpha (fully opaque)
  }

  // Disable image smoothing to maintain pixelated look
  ctx.imageSmoothingEnabled = false;

  // Create a temporary canvas to hold the fire image
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = fireWidth;
  tempCanvas.height = fireHeight;
  const tempCtx = tempCanvas.getContext('2d');

  // Put the image data onto the temporary canvas
  tempCtx.putImageData(imageData, 0, 0);

  // Clear the main canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Calculate scaling factors to maintain aspect ratio
  const scaleX = canvas.width / fireWidth;
  const scaleY = canvas.height / fireHeight;
  const scale = Math.min(scaleX, scaleY);

  // Draw the temporary canvas onto the main canvas with scaling
  ctx.drawImage(
    tempCanvas,
    0,
    0,
    fireWidth,
    fireHeight,
    0,
    0,
    fireWidth * scale,
    fireHeight * scale
  );
}

// Animation loop
function animate() {
  propagateFire();
  renderFire();
  requestAnimationFrame(animate);
}

// Handle intensity changes
intensitySlider.addEventListener('input', (e) => {
  fireIntensity = parseInt(e.target.value, 10);
  intensityValue.textContent = fireIntensity;
  console.log(`Intensity changed to ${fireIntensity}`);
  initializeFire();
});

// Handle interactions (mouse and touch)
function addInteraction(x, y) {
  const canvasRect = canvas.getBoundingClientRect();
  const scaleX = fireWidth / (canvasRect.width);
  const scaleY = fireHeight / (canvasRect.height);

  const fireX = Math.floor((x - canvasRect.left) * scaleX);
  const fireY = Math.floor((y - canvasRect.top) * scaleY);
  const index = fireY * fireWidth + fireX;

  if (index >= 0 && index < firePixels.length) {
    firePixels[index] = fireIntensity;
    // Debug: Log interaction
    console.log(`Interaction at (${fireX}, ${fireY}) - firePixels[${index}] set to ${fireIntensity}`);
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
