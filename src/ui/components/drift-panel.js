const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: system-ui, sans-serif;
      color: #f5f5f5;
    }
    .panel {
      background: #111827;
      border-radius: 12px;
      padding: 1rem;
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
      max-width: 360px;
    }
    h2 {
      margin: 0 0 0.75rem;
      font-size: 1rem;
    }
    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 0.5rem;
    }
    li {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 8px;
      padding: 0.4rem 0.55rem;
      text-transform: capitalize;
    }
    .swatch {
      width: 14px;
      height: 14px;
      border-radius: 3px;
      flex: none;
      border: 1px solid rgba(255, 255, 255, 0.25);
    }
    .active {
      outline: 2px solid #ffffff;
      outline-offset: 1px;
    }
  </style>
  <section class="panel">
    <h2>Drift State Panel</h2>
    <ul id="state-list"></ul>
  </section>
`;

export class DriftPanel extends HTMLElement {
  set data({ stateColors = {}, currentState = null } = {}) {
    this.render(stateColors, currentState);
  }

  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
    }
  }

  render(stateColors, currentState) {
    if (!this.shadowRoot) return;
    const list = this.shadowRoot.getElementById('state-list');
    list.innerHTML = '';

    Object.entries(stateColors).forEach(([state, color]) => {
      const row = document.createElement('li');
      row.classList.toggle('active', state === currentState);
      row.innerHTML = `<span class="swatch" style="background:${color}"></span><span>${state}</span>`;
      list.appendChild(row);
    });
  }
}

customElements.define('drift-panel', DriftPanel);
