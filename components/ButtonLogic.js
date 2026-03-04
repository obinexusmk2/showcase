const ButtonLogic = {
  initialState: {
    count: 0,
    disabled: false,
  },
  actions: {
    increment(ctx, payload = 1) {
      const amount = typeof payload === 'number' ? payload : 1;
      if (ctx.getState().disabled) {
        return ctx.getState();
      }
      return ctx.setState((prev) => ({ count: prev.count + amount }));
    },
    decrement(ctx, payload = 1) {
      const amount = typeof payload === 'number' ? payload : 1;
      return ctx.setState((prev) => ({ count: prev.count - amount }));
    },
    reset(ctx) {
      return ctx.setState({ count: 0 });
    },
    setDisabled(ctx, payload = true) {
      return ctx.setState({ disabled: Boolean(payload) });
    },
  },
};

module.exports = ButtonLogic;
