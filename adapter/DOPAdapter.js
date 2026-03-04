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
  };
}

module.exports = {
  createDOPComponent,
  toOOP,
};
