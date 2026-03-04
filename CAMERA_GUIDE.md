# MMUKO Fluid Camera Drift Visualizer - Guide

## Overview

**Camera Drift Visualizer** integrates HTML5 Camera API with canvas-based drift visualization, making **your face the focal point** of a real-time phenomenological analysis system.

## Quick Start

```bash
# Build and serve
npm run build
npm run serve

# Open in browser
http://localhost:3000/canvas-camera.html
```

## Features

### 🎥 Camera Focal Point

Your face is rendered at the **exact center** of the visualization:

```
┌──────────────────────────────────────┐
│                                      │
│  🌀 Orbiting Particles               │
│     ↓                                │
│  ┌─────────────────────────────┐     │
│  │  YOUR FACE / DEMO PATTERN   │ ◄── Focal Point
│  │   (Camera Feed)             │     │
│  └─────────────────────────────┘     │
│     ↑                                │
│  Drift State Indicator (Right)       │
│  Features Panel (Left)               │
│                                      │
└──────────────────────────────────────┘
```

### ✅ Key Components

1. **Camera Canvas** (Central)
   - 600x600px focal point
   - Mirrored (default)
   - Bordered with theme color
   - Rounded corners (20px)
   - Glow shadow effect

2. **Background Layer**
   - Linear gradient
   - Subtle grid pattern
   - Theme-colored particles

3. **Particle Effects**
   - Orbiting particles around camera
   - Animated circles
   - Color-matched to theme

4. **Drift Indicator** (Right Side)
   - Large state label (RED/ORANGE/YELLOW/GREEN)
   - Color swatch with glow
   - Description text
   - Updates every 2.5 seconds

5. **Features Panel** (Left Side)
   - Camera Stream info
   - Drift Visualization info
   - Live Rendering info

## Camera Permissions

### First Load: Permission Dialog

```
┌─────────────────────────────────┐
│  🎥 Camera Access Required      │
│                                 │
│  MMUKO Fluid needs access to   │
│  your camera to visualize      │
│  drift states...               │
│                                 │
│  [✓ Allow Camera]  [Demo Mode] │
└─────────────────────────────────┘
```

**Two Options:**

1. **Allow Camera** → Uses real webcam feed
2. **Demo Mode** → Animated pattern (no camera needed)

### Demo Mode Pattern

If camera is denied:
- Animated radial gradient
- Orbiting circles
- "DEMO MODE" text
- Automatic theme updates

## Controls

```
┌─────────────────────────────────────────────────────┐
│ [Blue/Yellow] [Green/Yellow] [Red/Yellow]           │
│ [Capture] [Mirror]                                  │
└─────────────────────────────────────────────────────┘
```

### Theme Switching (3 Options)

| Button | Colors | Use |
|--------|--------|-----|
| Blue/Yellow | #3b82f6 / #eab308 | Cool, informational |
| Green/Yellow | #22c55e / #eab308 | Success, positive |
| Red/Yellow | #ef4444 / #eab308 | Alert, warning |

**Live Updates:**
- Instant color change
- All UI elements update
- No page reload needed
- Particles update in real-time

### Capture Frame

```javascript
// Button: [Capture]
// Downloads: mmuko-camera-2026-03-04T19-31-45.png
```

**What it captures:**
- Full-screen visualization
- Camera feed at center
- All UI elements
- Background + particles
- High-quality PNG

### Mirror Toggle

```javascript
// Button: [Mirror]
// Toggles camera horizontal flip
// Default: ON (mirrored)
```

## Drift State Cycling

Automatic cycle every 2.5 seconds:

```
RED (0-2.5s)
  ↓ Moving away from observer
ORANGE (2.5-5s)
  ↓ Static / no displacement
YELLOW (5-7.5s)
  ↓ Orthogonal movement (~90°)
GREEN (7.5-10s)
  ↓ Moving toward observer
[repeats]
```

Each state shows:
- Large state label (RED/ORANGE/YELLOW/GREEN)
- Colored swatch with glow effect
- Description text
- Color-coordinated particle effects

## Architecture

### Canvas Layers (Z-index)

```
Z-20:  Controls & UI Panels
Z-10:  Camera Canvas (Focal Point)
Z-5:   Particle/Effects Canvas
Z-1:   Background Canvas
Z-0:   Body
```

### Rendering Pipeline

```javascript
1. drawBackground()
   └─ Gradient + Grid

2. drawParticles()
   └─ Orbiting particles around camera

3. Camera/Demo feed
   └─ Centered on canvas

4. updateDriftState()
   └─ Update labels & colors

5. FPS Counter update
   └─ Every 1 second
```

### Camera Integration

```javascript
// Request camera
const stream = await navigator.mediaDevices.getUserMedia({
    video: { width: 1280, height: 720 },
    audio: false
});

// Draw to canvas
video.srcObject = stream;
const size = cameraCanvas.width;
cameraCctx.drawImage(video, 0, 0, size, size);

// Mirror support
if (isMirrored) {
    cameraCctx.scale(-1, 1);
}
```

## Customization

### Change Camera Size

```javascript
// In updateCameraCanvasSize()
const size = Math.min(window.innerWidth, window.innerHeight) * 0.6;
// Change 0.6 to 0.4 (smaller) or 0.8 (larger)
```

### Adjust Drift Cycle Time

```javascript
// In updateDriftState()
const stateIndex = Math.floor((time / 2500) % driftStates.length);
// Change 2500 to desired milliseconds
```

### Modify Particle Count

```javascript
// In drawParticles()
for (let i = 0; i < 20; i++) {  // Change 20 for more/fewer
```

### Update Theme Colors

```javascript
const themes = {
    customTheme: {
        primary: '#your-color',
        secondary: '#your-accent',
        accent: '#your-highlight',
        background: '#0f0f1f',
        border: '#your-border'
    }
};
```

## Browser Compatibility

| Browser | Camera | Canvas |
|---------|--------|--------|
| Chrome/Edge 90+ | ✅ | ✅ |
| Firefox 88+ | ✅ | ✅ |
| Safari 14+ | ✅ | ✅ |
| Mobile Chrome | ✅ | ✅ |
| Mobile Safari | ✅* | ✅ |

*Safari on iOS requires HTTPS or localhost

## Privacy & Security

### No Data Sent

- All processing is **client-side only**
- Camera feed never leaves your device
- No uploads or tracking
- Canvas capture is local download

### User Control

- Permission dialog on first load
- Allow/Deny choices
- Demo mode available (no camera)
- Mirror toggle for preferences

## Performance

### Optimization

- **FPS Counter** (top-right)
  - Real-time frame rate
  - Target: 60 FPS
  - Updates every 1 second

- **Canvas Rendering**
  - Optimized drawImage()
  - Minimal redraws
  - Efficient particle generation

- **Mobile Optimization**
  - Responsive canvas sizing
  - Touch-friendly controls
  - Reduced particle count on low-end devices

### Performance Tips

```javascript
// Reduce particles for better FPS
for (let i = 0; i < 10; i++) {  // Was 20

// Increase grid size for faster rendering
const gridSize = 100;  // Was 75

// Lower quality for older devices
cameraCanvas.width = 400;  // Was 600
```

## Integration with MMUKO Fluid Library

Connect to real drift classification:

```javascript
import mmuko from '../../dist/mmuko-fluid.mjs';

// Get real drift state from camera analysis
// (Advanced: requires face detection/ML)
const drift = mmuko.classifyDrift(
    observerPos,
    currentPos,
    previousPos
);

// Update visualization
updateDriftDisplay(drift);
```

## API Reference

### Global Functions

```javascript
switchTheme(themeName)
// Changes active theme
// Args: 'redYellow' | 'greenYellow' | 'blueYellow'

captureFrame()
// Captures full visualization as PNG
// Downloads: mmuko-camera-[timestamp].png

toggleMirror()
// Toggles camera horizontal flip
// Default: true (mirrored)

requestCamera()
// Requests camera permission
// Called on "Allow Camera" button

denyCamera()
// Enters demo mode (no camera)
// Called on "Demo Mode" button
```

### Window API

```javascript
window.mmuko.switchTheme(theme)
window.mmuko.captureFrame()
window.mmuko.getCameraCanvas()   // Returns canvas element
window.mmuko.getTheme()          // Returns current theme object
```

## Troubleshooting

### Camera Not Appearing

**Check:**
- Browser permissions (Settings → Privacy)
- HTTPS (some browsers require it)
- Camera not in use by other app
- Try "Demo Mode" to test

**Fix:**
```javascript
// Check console for errors
navigator.mediaDevices.getUserMedia({...})
    .catch(err => console.error('Camera error:', err));
```

### Blurry Camera Feed

**Cause:** Browser downsampling

**Fix:**
```javascript
// Increase canvas size
const size = Math.min(window.innerWidth, window.innerHeight) * 0.8;

// Or increase video resolution
video: { width: 1920, height: 1440 }
```

### Low FPS Performance

**Fix:**
- Reduce particle count
- Close other browser tabs
- Disable hardware acceleration if problematic
- Use Demo Mode instead

### Colors Not Updating

**Check:**
- Theme name is correct
- CSS variables are defined
- Browser cache (hard refresh: Ctrl+Shift+R)

## Use Cases

1. **Streaming** - Stream with drift visualization overlay
2. **Presentations** - Live capture during talks
3. **Art Installation** - Interactive drift visualization
4. **Research** - Capture motion patterns with camera
5. **Gaming** - Webcam-based input visualization

## Next Steps

1. **Try it out** → http://localhost:3000/canvas-camera.html
2. **Allow camera** → Grant permission
3. **Switch themes** → See live color changes
4. **Capture frames** → Download your visualizations
5. **Integrate data** → Connect to mmuko-fluid library

---

**MMUKO Fluid Camera Visualizer v0.1.0**
Your Face as the Focal Point of Phenomenological Drift Analysis

---

## Example: Custom Integration

```html
<!-- Embed in your page -->
<iframe src="/canvas-camera.html"
        style="width: 100%; height: 100%; border: none;">
</iframe>

<script>
// Access camera canvas from parent
const iframe = document.querySelector('iframe');

setInterval(() => {
    // Capture frame every 5 seconds
    iframe.contentWindow.mmuko.captureFrame();
}, 5000);

// Listen for theme changes
iframe.contentWindow.addEventListener('themechange', (e) => {
    console.log('Theme changed to:', e.detail);
});
</script>
```

---

**Happy Visualizing! 🎥✨**
