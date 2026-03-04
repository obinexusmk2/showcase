# MMUKO Fluid - Canvas Integration Guide

## Architecture Overview

The MMUKO Fluid canvas system is built with a **layered architecture** for optimal performance and visual hierarchy:

### Canvas Layers

```
┌─────────────────────────────────────┐
│  Foreground Layer (foreground.html)  │  Z-index: 20
│  - Particles & starfield             │
│  - UI interactions & bursts           │
├─────────────────────────────────────┤
│  UI Overlay (HTML/CSS)               │  Z-index: 15
│  - Header, hero, buttons             │
│  - Drift indicator, features panel   │
├─────────────────────────────────────┤
│  Background Layer (background.html)  │  Z-index: 1
│  - HemiSphere wireframe              │
│  - Rotating 3D graph visualization   │
└─────────────────────────────────────┘
```

## File Structure

```
showcase/
├── canvas.html                 # Main landing page (integrated)
├── src/ui/
│   ├── index.html             # Interactive demo page
│   ├── main.js                # Demo entry point
│   └── demo.js                # MMUKO Fluid library integration
├── canvas/
│   ├── background.html        # Background visualization layer
│   └── foreground.html        # Foreground effects layer
├── dist/
│   ├── mmuko-fluid.mjs        # ES Module bundle
│   └── mmuko-fluid.cjs.js     # CommonJS bundle
└── CANVAS_INTEGRATION.md      # This file
```

## File Descriptions

### `canvas.html` (Main Landing Page)

**Purpose:** Complete landing page with integrated canvas visualization

**Features:**
- Dual canvas rendering (background + foreground)
- Responsive layout with header navigation
- Live drift state indicator (bottom right)
- Feature highlights panel (bottom left)
- Call-to-action buttons linking to demo
- Animated hero section

**Key Elements:**
```html
<canvas id="backgroundCanvas"></canvas>  <!-- 3D HemiSphere -->
<canvas id="foregroundCanvas"></canvas>   <!-- Particles & stars -->
```

**Drift State Indicator:**
- Shows current drift state (RED/ORANGE/YELLOW/GREEN)
- Updates every 2 seconds with animated state cycling
- Color-coded swatch with glow effect

### `canvas/background.html` (Background Layer)

**Purpose:** Self-contained background visualization

**Features:**
- Rotating HemiSphere with wireframe rendering
- Vector-based 3D mathematics
- Smooth rotation on X and Y axes
- Performance-optimized with global alpha blending

**Can be used as:**
- Standalone iframe (`<iframe src="canvas/background.html"></iframe>`)
- Canvas reference for main page
- Component in other layouts

**Exposed Interface:**
```javascript
window.mmuko.getState()  // Returns current animation state
```

### `canvas/foreground.html` (Foreground Layer)

**Purpose:** Self-contained particle and starfield system

**Features:**
- Circular starfield orbiting canvas center
- Particle emission system for ambient effects
- Drift burst animations triggered by user actions
- Transparent background for layering

**Can be used as:**
- Standalone iframe
- Particle system reference
- Interactive element for drift visualization

**Exposed Interface:**
```javascript
window.mmuko.burstAt(x, y, color)     // Trigger particle burst
window.mmuko.setDriftColor(color)     // Change starfield theme
```

## Integration with MMUKO Fluid Library

The canvas pages integrate with the mmuko-fluid library for drift classification:

### From `src/ui/demo.js`:

```javascript
import mmuko from '../../dist/mmuko-fluid.mjs';
const { classifyDrift, weightedInterpolate } = mmuko;

// Classify observer motion
const state = classifyDrift(
    [obsX, 0, 0],  // observer position
    [curX, 0, 0],  // current entity position
    [prevX, 0, 0]  // previous entity position
);

// Interpolate positions
const result = weightedInterpolate(
    [0, 0, 0],     // current point
    [5, 5, 5],     // predicted point
    t              // factor [0, 1]
);
```

### Canvas Integration Path:

```
canvas.html
    ├── Renders background HemiSphere (canvas/background.html logic)
    ├── Renders foreground effects (canvas/foreground.html logic)
    ├── Updates drift state using mmuko-fluid classification
    └── Links to → src/ui/index.html (full interactive demo)

src/ui/index.html
    ├── Imports mmuko-fluid library
    ├── Shows drift classification demo
    ├── Shows weighted interpolation demo
    └── Displays live drift panel component
```

## Usage Examples

### Example 1: Standalone Landing Page

```html
<!-- Just open in browser -->
open canvas.html
npm run serve
<!-- Navigate to http://localhost:3000/canvas.html -->
```

### Example 2: Iframe Composition

```html
<!-- Composite page using iframes -->
<div style="display: grid; grid-template-columns: 1fr 1fr;">
    <iframe src="canvas/background.html" style="height: 100vh;"></iframe>
    <div style="height: 100vh; padding: 2rem;">
        <h1>MMUKO Fluid</h1>
        <p>Real-time drift visualization with weighted graphs</p>
        <a href="src/ui/index.html">Launch Interactive Demo</a>
    </div>
</div>
```

### Example 3: Programmatic Control

```javascript
// From canvas.html or parent page
const bgFrame = document.querySelector('iframe[src="canvas/background.html"]');
const fgFrame = document.querySelector('iframe[src="canvas/foreground.html"]');

// Trigger foreground burst
fgFrame.contentWindow.mmuko.burstAt(
    window.innerWidth / 2,
    window.innerHeight / 2,
    '#ef4444'  // RED state color
);
```

## Responsive Design

All canvas pages are responsive:

- **Mobile (< 768px):**
  - Stack layout vertically
  - Reduced canvas resolution for performance
  - Touch-friendly button sizes

- **Tablet (768px - 1024px):**
  - Two-column layout
  - Medium canvas quality

- **Desktop (> 1024px):**
  - Full featured layout
  - High-resolution canvas rendering
  - Floating panels on corners

## Performance Optimization

### Background Layer
- Canvas size matches viewport
- Uses `requestAnimationFrame` for smooth 60fps
- Global alpha for fade effects instead of clearing
- Optimized HemiSphere detail level (12-14)

### Foreground Layer
- Particle pool limiting (max ~200 particles)
- Starfield uses mathematical generation (no storage)
- Burst effects are temporary and cleaned up

### Main Canvas Page
- Dual canvas for layer separation
- CSS-based UI overlay (no canvas rendering)
- Viewport resize handling
- Memory-efficient animations

## Customization

### Change Drift State Cycle Time

**In `canvas.html`:**
```javascript
// Line: currentDriftIndex = Math.floor((time / 2000) % driftStates.length);
// Change 2000 to desired milliseconds
```

### Adjust Sphere Rotation Speed

**In `canvas/background.html`:**
```javascript
// sphere.rotateY(0.0015);  // Slower
// sphere.rotateY(0.003);   // Faster
```

### Modify Starfield Count

**In `canvas/foreground.html`:**
```javascript
// const starfield = new Starfield(60);  // Change 60 to desired count
```

### Update Colors

**In `canvas.html`:**
```css
:root {
    --drift-red: #ef4444;     /* Change RED color */
    --drift-orange: #f97316;  /* Change ORANGE color */
    --accent: #667eea;        /* Change accent/UI color */
}
```

## Linking to Interactive Demo

All canvas pages link to the interactive demo:

```javascript
// In button click handler
onclick="window.location.href='/src/ui/index.html'"
```

The demo page (`src/ui/index.html`) provides:
- Real-time drift classification with sliders
- Weighted interpolation visualization
- Live drift panel component
- Full mmuko-fluid library usage examples

## Browser Support

- ✅ Chrome/Edge (90+)
- ✅ Firefox (88+)
- ✅ Safari (14+)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Canvas Not Rendering
- Check browser console for errors
- Verify canvas element IDs match JavaScript
- Ensure WebGL context is available

### Performance Issues
- Reduce starfield count in `foreground.html`
- Lower HemiSphere detail level
- Increase fade effect opacity to reduce redraws

### Colors Not Updating
- Verify CSS variable names in `:root`
- Check color format (hex, rgb, rgba)
- Ensure no inline style overrides

## Next Steps

1. **Open landing page:**
   ```bash
   npm run serve
   # Visit http://localhost:3000/canvas.html
   ```

2. **Launch interactive demo:**
   - Click "Launch Demo" button on landing page
   - Or visit http://localhost:3000/src/ui/index.html

3. **Customize styling:**
   - Edit CSS colors in canvas.html
   - Adjust animations and timings

4. **Deploy:**
   ```bash
   npm run build
   # Upload dist/ and canvas.html to hosting
   ```

---

**Created for OBINexus / MMUKO Fluid v0.1.0**
Phenomenological Drift System for Holographic Interfaces
