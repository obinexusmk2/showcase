# Canvas Renderer Guide - MMUKO Fluid

## Overview

The **Canvas Renderer** is a complete UI/UX system rendered directly to HTML5 Canvas with:
- ✅ Three distinct color themes (Red/Yellow, Green/Yellow, Blue/Yellow)
- ✅ Real-time frame capture via `canvas.toDataURL()`
- ✅ Canvas-based UI components (headers, panels, buttons)
- ✅ Integrated 3D HemiSphere visualization
- ✅ Live drift state cycling
- ✅ Performance monitoring (FPS counter)
- ✅ Theme switching without page reload

## File Location

```
showcase/
├── canvas-renderer.html      # ← Main canvas renderer
├── canvas.html               # HTML overlay version (alternative)
└── CANVAS_RENDERER_GUIDE.md  # This file
```

## Quick Start

```bash
# Build the library
npm run build

# Start dev server
npm run serve

# Open in browser
http://localhost:3000/canvas-renderer.html
```

## Features

### 1. Three Color Themes

Each theme uses a **Primary/Secondary** color pair with complementary accents:

#### Red/Yellow Theme
```javascript
primary: '#ef4444',    // Red - dominant color
secondary: '#eab308',  // Yellow - accent text
accent: '#f97316',     // Orange - highlights
```
**Use case:** Alarm, alert, warning states

#### Green/Yellow Theme
```javascript
primary: '#22c55e',    // Green - dominant color
secondary: '#eab308',  // Yellow - accent text
accent: '#10b981',     // Emerald - highlights
```
**Use case:** Success, active, positive states

#### Blue/Yellow Theme
```javascript
primary: '#3b82f6',    // Blue - dominant color
secondary: '#eab308',  // Yellow - accent text
accent: '#06b6d4',     // Cyan - highlights
```
**Use case:** Information, neutral, cool tones

### 2. Canvas toDataURL() Integration

**Capture high-quality frames at any time:**

```javascript
// Via button click
function captureFrame() {
    const imageData = canvas.toDataURL('image/png');
    // Creates download with timestamp
    // mmuko-fluid-2026-03-04T19-31-45.png
}

// Programmatic access
const frame = window.mmuko.captureFrame();
// Returns base64 data URL
```

**Quality settings:**
```javascript
// PNG (lossless)
canvas.toDataURL('image/png')

// JPEG (compressed)
canvas.toDataURL('image/jpeg', 0.95)

// WebP (best compression)
canvas.toDataURL('image/webp', 0.95)
```

### 3. Canvas-Based UI Components

All UI elements are rendered directly to canvas:

#### Header
- Logo with emoji icon
- Tagline text
- Responsive positioning
- Theme-colored border

#### Drift Indicator Panel
- Current drift state (RED/ORANGE/YELLOW/GREEN)
- Description text
- Colored circle swatch
- Glow effect using globalAlpha

#### Features Panel
- Feature list with icons
- Positioned at bottom-left
- Theme-colored border
- Responsive sizing

#### Hero Text
- Main heading (52px)
- Subheading
- Description text
- Centered layout

#### CTA Buttons
- "Demo" and "Docs" buttons
- Bordered style
- Theme-colored
- Clickable regions (implement via mouse tracking)

### 4. Drift State Cycling

**Automatic state progression:**
```
RED (0-2s)
  ↓
ORANGE (2-4s)
  ↓
YELLOW (4-6s)
  ↓
GREEN (6-8s)
  ↓ [repeats]
```

Each state includes:
- Label (3 characters)
- Description (motion classification)
- Color (from theme)
- Display in panel

### 5. Performance Monitoring

**FPS Counter** (top-right):
- Real-time frame rate
- Updates every 1 second
- Displays in monospace font
- Helps optimize rendering

### 6. Theme Switching

**Controls:**
```
[Red/Yellow] [Green/Yellow] [Blue/Yellow] [Capture] [Toggle UI]
```

**No page reload required:**
```javascript
switchTheme('greenYellow');
// Immediately changes all UI colors
// Updates theme label
// Maintains animation state
```

**Toggle UI visibility:**
```javascript
toggleUI();
// Shows/hides all canvas UI elements
// Shows only background gradient + sphere
```

## Architecture

### Rendering Pipeline

```
1. drawGradientBackground()
   └─ Linear gradient from top to bottom

2. drawGrid()
   └─ Subtle 50px grid in theme color

3. drawHeader()
   ├─ Header background bar (80px)
   ├─ Logo text (28px, bold)
   └─ Tagline (14px secondary)

4. drawDriftIndicator()
   ├─ Panel background (300x150)
   ├─ Drift state label (32px)
   ├─ Description text (12px)
   └─ Color swatch with glow

5. drawFeatures()
   ├─ Panel background (280x180)
   ├─ Feature icons + text
   └─ Three features listed

6. drawHeroText()
   ├─ Main heading (52px)
   ├─ Subheading (18px)
   └─ Description (14px)

7. drawButton(x, y, width, height, text)
   ├─ Button background
   ├─ Colored border
   └─ Centered text

8. HemiSphere.drawWireframe()
   └─ 3D rotating graph on top
```

### Color Flow

Each component uses theme colors:

```javascript
// Dominant use
strokeStyle = theme.primary
fillStyle = theme.primary
ctx.strokeText(..., theme.primary)

// Accent use
fillStyle = theme.secondary
ctx.fillText(..., theme.secondary)

// Highlights/borders
strokeStyle = theme.accent
```

## Usage Examples

### Example 1: Basic Theme Switch

```html
<!-- In HTML -->
<button onclick="switchTheme('greenYellow')">Go Green</button>

<!-- JavaScript automatically:
    - Changes all UI colors
    - Redraws sphere in green
    - Updates labels
    - No page reload needed
-->
```

### Example 2: Frame Capture Workflow

```javascript
// Capture current frame
const frame = window.mmuko.captureFrame();

// Create custom download
const link = document.createElement('a');
link.href = frame;
link.download = 'my-drift-visualization.png';
link.click();

// Or use base64 in API call
fetch('/api/screenshots', {
    method: 'POST',
    body: JSON.stringify({ image: frame })
});
```

### Example 3: Dynamic Drift Updates

```javascript
// Update drift state without waiting for cycle
uiRenderer.updateDriftState(
    'GREEN',
    'Moving toward observer'
);

// Can be triggered by external data
socket.on('driftStateChange', (state) => {
    uiRenderer.updateDriftState(state.label, state.desc);
});
```

### Example 4: Multi-Canvas Composition

```javascript
// main page (index.html)
<div style="display: grid; grid-template-columns: 1fr 1fr;">
    <iframe src="canvas-renderer.html"></iframe>
    <div style="padding: 2rem;">
        <h2>Data Panel</h2>
        <p>Coordinates: <span id="coords"></span></p>
    </div>
</div>

<script>
// Capture frames from iframe periodically
const frame = document.querySelector('iframe');
setInterval(() => {
    const imgData = frame.contentWindow.mmuko.captureFrame();
    console.log('Captured frame');
}, 1000);
</script>
```

## Customization

### Add Custom Text

```javascript
// In CanvasUIRenderer
drawCustomInfo() {
    this.ctx.fillStyle = this.theme.primary;
    this.ctx.font = 'bold 16px Arial';
    this.ctx.fillText('Custom Info', 50, 200);
}

// Call in render()
render() {
    // ... existing code ...
    this.drawCustomInfo();
}
```

### Add Animated Elements

```javascript
// Track time for animation
drawAnimatedCircle(time) {
    const radius = 50 + Math.sin(time * 0.005) * 20;
    this.ctx.strokeStyle = this.theme.secondary;
    this.ctx.beginPath();
    this.ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
    this.ctx.stroke();
}
```

### Change Grid Density

```javascript
// In drawGrid()
const gridSize = 25;  // Change from 50

// More dense grid
for (let x = 0; x < canvas.width; x += gridSize) {
    // ... grid drawing code ...
}
```

### Adjust Sphere Size

```javascript
// In initialization
const sphere = new HemiSphere({
    radius: 150,  // Larger sphere
    origin: new Vector.Vec3(canvas.width / 2, canvas.height / 2, 0),
    detail: 14    // More detail
});
```

## Integration with MMUKO Fluid

The Canvas Renderer can integrate with the mmuko-fluid library:

```javascript
import mmuko from '../../dist/mmuko-fluid.mjs';

// Get real drift classification
const drift = mmuko.classifyDrift(
    observerPos,
    currentPos,
    previousPos
);

// Update renderer
uiRenderer.updateDriftState(drift, description);
```

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome/Edge | ✅ 90+ | Full support |
| Firefox | ✅ 88+ | Full support |
| Safari | ✅ 14+ | Full support |
| Mobile Chrome | ✅ Latest | Good performance |
| Mobile Safari | ✅ Latest | Good performance |

## Performance Tips

### For Better FPS

1. **Reduce grid density:**
   - Increase gridSize to 75-100
   - Fewer line draws

2. **Lower sphere detail:**
   - Reduce detail from 12 to 8
   - Fewer triangles

3. **Optimize background:**
   - Cache gradient
   - Redraw only when theme changes

4. **Limit alpha operations:**
   - Use globalAlpha sparingly
   - Reset after use

### Optimization Example

```javascript
// Cache gradient
const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, '#0f0f1f');
// ... reuse gradient each frame

// Draw only what changed
if (themeChanged) {
    redrawUI();
}
```

## Troubleshooting

### Canvas Appears Blank

**Cause:** Context not initialized or canvas size is 0

**Fix:**
```javascript
const ctx = canvas.getContext('2d', { willReadFrequently: true });
resizeCanvas();  // Call this before first render
```

### Colors Look Wrong

**Cause:** Wrong theme loaded or color definitions modified

**Fix:**
```javascript
// Check current theme
console.log(themes[currentTheme]);

// Reset to default
currentTheme = 'redYellow';
uiRenderer.setTheme('redYellow');
```

### toDataURL() Returns Black

**Cause:** Canvas context not preserving data

**Fix:**
```javascript
// Use correct context options
const ctx = canvas.getContext('2d', {
    willReadFrequently: true  // Enable data reading
});
```

### Poor Performance

**Cause:** Too many elements or high resolution

**Fix:**
```javascript
// Check FPS counter
// Reduce detail level
// Lower grid density
// Optimize animations
```

## API Reference

### Global Functions

```javascript
switchTheme(themeName)
// Changes active theme
// Args: 'redYellow' | 'greenYellow' | 'blueYellow'

captureFrame()
// Captures current frame as PNG
// Returns: base64 data URL

toggleUI()
// Toggles UI visibility
// Shows: background + sphere only
```

### CanvasUIRenderer Class

```javascript
constructor(ctx, theme)
setTheme(themeName)
updateDriftState(state, description)
render()
drawGradientBackground()
drawGrid()
drawHeader()
drawDriftIndicator()
drawFeatures()
drawHeroText()
drawButton(x, y, width, height, text)
```

### Window Object

```javascript
window.mmuko.renderer        // UIRenderer instance
window.mmuko.sphere          // HemiSphere instance
window.mmuko.captureFrame()  // Capture current frame
```

## Next Steps

1. **Customize colors** - Add your own theme
2. **Add interactions** - Implement mouse/touch
3. **Export frames** - Use toDataURL() for video
4. **Integrate data** - Connect to mmuko-fluid library
5. **Deploy** - Use as landing page or embed

---

**Canvas Renderer v0.1.0 - OBINexus MMUKO Fluid**
Professional canvas-based UI with real-time visualization
