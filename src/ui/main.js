/**
 * Main entry point for MMUKO Fluid demo
 * Drift Panel custom element + interactive demos
 */

// Drift Panel custom element
const STATE_TOKENS = {
  red: getCssVar('--state-red', '#ef4444'),
  orange: getCssVar('--state-orange', '#f97316'),
  yellow: getCssVar('--state-yellow', '#eab308'),
  green: getCssVar('--state-green', '#22c55e')
};

function getCssVar(name, fallback) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

class DriftPanel extends HTMLElement {
  #data = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  set data(value) {
    this.#data = value;
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;
    const data = this.#data;

    const label = data?.state?.label ?? 'green';
    const color = STATE_TOKENS[label] ?? STATE_TOKENS.green;
    const score = data?.state?.score ?? 0;
    const confidence = data?.state?.confidence ?? 0;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .panel {
          border-radius: 16px;
          padding: 1rem;
          border: 1px solid color-mix(in srgb, ${color}, #000 15%);
          background: linear-gradient(180deg, color-mix(in srgb, ${color}, #fff 90%), #fff);
          box-shadow: 0 12px 25px rgba(0, 0, 0, 0.08);
        }
        .heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
        }
        .label {
          font-size: 1.1rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #111827;
        }
        .swatch {
          width: 1rem;
          aspect-ratio: 1;
          border-radius: 999px;
          background: ${color};
          border: 1px solid rgba(17, 24, 39, 0.25);
          box-shadow: 0 0 0 3px color-mix(in srgb, ${color}, white 70%);
        }
        .meta {
          margin-top: 0.75rem;
          color: #374151;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.4rem;
          font-size: 0.92rem;
        }
      </style>
      <section class="panel">
        <div class="heading">
          <div class="label">${label}</div>
          <div class="swatch" title="${label} state color"></div>
        </div>
        <div class="meta">
          <div>Score: ${(score * 100).toFixed(1)}%</div>
          <div>Confidence: ${(confidence * 100).toFixed(1)}%</div>
        </div>
      </section>
    `;
  }
}

if (!customElements.get('drift-panel')) {
  customElements.define('drift-panel', DriftPanel);
}

// Import and run the interactive demo
import './demo.js';

console.log('✨ MMUKO Fluid Demo initialized');
