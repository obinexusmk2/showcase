/**
 * MMUKO Fluid Demo
 * Interactive demonstration of drift classification and weighted interpolation
 */

// Import mmuko-fluid library functions
import mmuko from '../../dist/mmuko-fluid.mjs';

const { DriftState, classifyDrift, weightedInterpolate, computeMidpoint } = mmuko;

// State token colors
const STATE_COLORS = {
  RED: '#ef4444',
  ORANGE: '#f97316',
  YELLOW: '#eab308',
  GREEN: '#22c55e'
};

const STATE_DESCRIPTIONS = {
  RED: 'Moving away from observer',
  ORANGE: 'Static / no displacement',
  YELLOW: 'Orthogonal movement (~90°)',
  GREEN: 'Moving toward observer'
};

// Get DOM elements
const obsXInput = document.getElementById('obsX');
const curXInput = document.getElementById('curX');
const prevXInput = document.getElementById('prevX');
const obsXValue = document.getElementById('obsXValue');
const curXValue = document.getElementById('curXValue');
const prevXValue = document.getElementById('prevXValue');
const driftResult = document.getElementById('driftResult');

const tFactorInput = document.getElementById('tFactor');
const tValue = document.getElementById('tValue');
const currentPointDisplay = document.getElementById('currentPoint');
const predictedPointDisplay = document.getElementById('predictedPoint');
const interpolationResult = document.getElementById('interpolationResult');

const autoUpdateCheckbox = document.getElementById('autoUpdate');
const driftPanel = document.querySelector('drift-panel');

// Drift Classification Demo
function updateDriftClassification() {
  const obsX = parseFloat(obsXInput.value);
  const curX = parseFloat(curXInput.value);
  const prevX = parseFloat(prevXInput.value);

  // Update value displays
  obsXValue.textContent = `${obsX}`;
  curXValue.textContent = `${curX}`;
  prevXValue.textContent = `${prevX}`;

  // Create positions in R^3
  const observer = [obsX, 0, 0];
  const current = [curX, 0, 0];
  const previous = [prevX, 0, 0];

  // Classify drift
  const state = classifyDrift(observer, current, previous);

  // Render result
  const color = STATE_COLORS[state];
  driftResult.innerHTML = `
    <div style="margin-top: 1.5rem; padding: 1rem; border-radius: 8px; background: rgba(0,0,0,0.02); border-left: 4px solid ${color};">
      <div style="font-weight: 600; color: ${color}; font-size: 1.1rem;">${state}</div>
      <div style="font-size: 0.9rem; color: var(--muted); margin-top: 0.5rem;">${STATE_DESCRIPTIONS[state]}</div>
      <div style="margin-top: 0.75rem; font-family: monospace; font-size: 0.85rem;">
        <div>Observer: ${observer.map(v => v.toFixed(2)).join(', ')}</div>
        <div>Current: ${current.map(v => v.toFixed(2)).join(', ')}</div>
        <div>Previous: ${previous.map(v => v.toFixed(2)).join(', ')}</div>
      </div>
    </div>
  `;
}

// Weighted Interpolation Demo
function updateInterpolation() {
  const t = parseFloat(tFactorInput.value);

  tValue.textContent = `${t.toFixed(3)}`;

  const current = [0, 0, 0];
  const predicted = [5, 5, 5];

  const result = weightedInterpolate(current, predicted, t);

  currentPointDisplay.textContent = `[${current.map(v => v.toFixed(2)).join(', ')}]`;
  predictedPointDisplay.textContent = `[${predicted.map(v => v.toFixed(2)).join(', ')}]`;
  interpolationResult.textContent = `[${result.map(v => v.toFixed(3)).join(', ')}]`;
}

// Live State Update
let stateCounter = 0;
function updateLiveState() {
  if (!autoUpdateCheckbox.checked) return;

  // Simulate motion
  const time = Date.now() / 1000;
  const wave = Math.sin(time) * 0.5 + 0.5;

  // Create moving observer and entity
  const observer = [Math.sin(time * 0.5) * 3, 0, 0];
  const current = [wave * 5 + 2, Math.cos(time) * 2, 0];
  const previous = [
    wave * 5 + 1.8,
    Math.cos(time - 0.1) * 2,
    0
  ];

  // Classify
  const state = classifyDrift(observer, current, previous);

  // Create mock panel data
  const stateScore = Object.keys(STATE_COLORS).indexOf(state) / 3;
  const confidence = 0.7 + Math.sin(time * 0.3) * 0.2;

  driftPanel.data = {
    state: {
      score: stateScore,
      confidence,
      label: state.toLowerCase(),
      updatedAt: Date.now()
    }
  };
}

// Event listeners
obsXInput.addEventListener('input', updateDriftClassification);
curXInput.addEventListener('input', updateDriftClassification);
prevXInput.addEventListener('input', updateDriftClassification);

tFactorInput.addEventListener('input', updateInterpolation);

autoUpdateCheckbox.addEventListener('change', () => {
  if (autoUpdateCheckbox.checked) {
    liveUpdateInterval = setInterval(updateLiveState, 100);
  } else {
    clearInterval(liveUpdateInterval);
  }
});

// Initialize
let liveUpdateInterval;
updateDriftClassification();
updateInterpolation();
if (autoUpdateCheckbox.checked) {
  liveUpdateInterval = setInterval(updateLiveState, 100);
}

console.log('🌀 MMUKO Fluid Demo loaded');
console.log('Available exports:', { DriftState, classifyDrift, weightedInterpolate, computeMidpoint });
