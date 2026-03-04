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

function createGraphModel() {
  return {
    nodes: [
      { id: 'ingest', weight: 0.15 },
      { id: 'feature-drift', weight: 0.35 },
      { id: 'prediction-drift', weight: 0.3 },
      { id: 'latency', weight: 0.2 }
    ],
    edges: [
      ['ingest', 'feature-drift'],
      ['feature-drift', 'prediction-drift'],
      ['prediction-drift', 'latency']
    ],
    inputs: {
      signal: 0.25,
      velocity: 0.2,
      noise: 0.15,
      manualBoost: 0
    },
    state: {
      score: 0,
      confidence: 0,
      label: 'green',
      updatedAt: Date.now()
    }
  };
}

function classify(score) {
  if (score >= 0.8) return 'red';
  if (score >= 0.6) return 'orange';
  if (score >= 0.4) return 'yellow';
  return 'green';
}

function transitionUpdate(model, source = 'timer') {
  const wave = 0.5 + Math.sin(Date.now() / 1400) * 0.5;
  const randomNoise = (Math.random() - 0.5) * 0.12;

  if (source === 'timer') {
    model.inputs.signal = clamp(model.inputs.signal * 0.8 + wave * 0.2, 0, 1);
    model.inputs.noise = clamp(model.inputs.noise * 0.7 + Math.random() * 0.3, 0, 1);
  }

  const weighted = model.nodes.reduce((sum, node, i) => {
    const nodeInput =
      model.inputs.signal * (1 - i * 0.1) +
      model.inputs.velocity * (0.8 + i * 0.05) +
      model.inputs.noise * 0.4 +
      model.inputs.manualBoost;
    return sum + nodeInput * node.weight;
  }, 0);

  const score = clamp(weighted + randomNoise, 0, 1);
  const confidence = clamp(1 - Math.abs(0.5 - score) * 1.5, 0.1, 0.99);

  model.state = {
    score,
    confidence,
    label: classify(score),
    updatedAt: Date.now()
  };

  return model.state;
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
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

customElements.define('drift-panel', DriftPanel);

function boot() {
  const app = document.querySelector('#app');
  const model = createGraphModel();

  const shell = document.createElement('section');
  shell.innerHTML = `
    <div style="display:grid; gap:0.8rem;">
      <drift-panel></drift-panel>
      <label style="display:grid; gap:0.25rem; color:var(--muted); font-size:0.9rem;">
        Manual boost
        <input id="boost" type="range" min="0" max="0.35" value="0" step="0.01" />
      </label>
      <label style="display:flex; align-items:center; gap:0.45rem; color:var(--muted); font-size:0.9rem;">
        <input id="autoplay" type="checkbox" checked />
        Auto-transition updates
      </label>
    </div>
  `;

  app.append(shell);

  const panel = shell.querySelector('drift-panel');
  const boostInput = shell.querySelector('#boost');
  const autoplayInput = shell.querySelector('#autoplay');

  const push = (source) => {
    transitionUpdate(model, source);
    panel.data = { ...model };
  };

  boostInput.addEventListener('input', (event) => {
    model.inputs.manualBoost = Number(event.target.value);
    push('input');
  });

  let timer = setInterval(() => {
    if (autoplayInput.checked) {
      push('timer');
    }
  }, 700);

  autoplayInput.addEventListener('change', () => {
    push('input');
    clearInterval(timer);
    timer = setInterval(() => {
      if (autoplayInput.checked) {
        push('timer');
      }
    }, 700);
  });

  push('input');
}

boot();
