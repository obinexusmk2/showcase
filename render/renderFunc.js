/**
 * Creates a renderer that can render and re-render based on last known state.
 */
function createRenderFunc(view, target) {
  if (typeof view !== 'function') {
    throw new Error('createRenderFunc requires a view function.');
  }

  let lastState;
  let lastOutput = '';

  function render(state = lastState) {
    lastState = state;
    lastOutput = view(lastState);

    if (target && typeof target === 'object') {
      target.textContent = lastOutput;
    }

    return lastOutput;
  }

  function rerender() {
    return render(lastState);
  }

  function getLastOutput() {
    return lastOutput;
  }

  return {
    render,
    rerender,
    getLastOutput,
  };
}

module.exports = {
  createRenderFunc,
};
