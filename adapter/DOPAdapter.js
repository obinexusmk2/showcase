function createDOPComponent({ initialState = {}, actions = {}, view = () => undefined } = {}) {
  const ctx = {
    state: { ...initialState },
    setState(partial) {
      const patch = typeof partial === 'function' ? partial(ctx.state) : partial;
      if (patch && typeof patch === 'object') {
        ctx.state = { ...ctx.state, ...patch };
      }
      return ctx.state;
    },
    getState() {
      return ctx.state;
    },
    render() {
      return view(ctx.state, ctx);
    },
  };

  Object.keys(actions).forEach((actionName) => {
    ctx[actionName] = (payload) => actions[actionName](ctx, payload);
  });

  return ctx;
}

function toOOP({ initialState = {}, actions = {}, view = () => undefined } = {}) {
  return class OOPComponent {
    constructor() {
      this.state = { ...initialState };

      Object.keys(actions).forEach((actionName) => {
        this[actionName] = (...args) => actions[actionName](this, ...args);
      });
    }

    setState(partial) {
      const patch = typeof partial === 'function' ? partial(this.state) : partial;
      if (patch && typeof patch === 'object') {
        this.state = { ...this.state, ...patch };
      }
      return this.state;
    }

    getState() {
      return this.state;
    }

    render() {
      return view(this.state, this);
    }
const { createRenderFunc } = require('../render/renderFunc');

/**
 * Adapter that wraps domain logic in a functional interface.
 * State is private and can only be changed through `dispatch`.
 */
function toFunctional(logicModule, options = {}) {
  if (!logicModule || typeof logicModule !== 'object') {
    throw new Error('toFunctional requires a logic module object.');
  }

  const initialStateFactory = logicModule.getInitialState;
  const actions = logicModule.actions || {};
  const view = logicModule.view || ((state) => JSON.stringify(state));

  if (typeof initialStateFactory !== 'function') {
    throw new Error('logicModule.getInitialState must be a function.');
  }

  let state = initialStateFactory();
  const renderer = createRenderFunc(view, options.target);

  function getState() {
    return { ...state };
  }

  function render() {
    return renderer.render(state);
  }

  function dispatch(actionName, payload) {
    const action = actions[actionName];

    if (typeof action !== 'function') {
      throw new Error(`Unknown action: ${actionName}`);
    }

    const nextState = action(state, payload);
    if (!nextState || typeof nextState !== 'object') {
      throw new Error(`Action "${actionName}" must return next state object.`);
    }

    state = nextState;
    return render();
  }

  return {
    getState,
    dispatch,
    render,
  };
}

module.exports = {
  createDOPComponent,
  toOOP,
  toFunctional,
};
