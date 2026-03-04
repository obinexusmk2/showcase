const ButtonLogic = {
  getInitialState() {
    return {
      isOn: false,
      label: 'OFF',
    };
  },

  actions: {
    toggle(state) {
      const isOn = !state.isOn;
      return {
        ...state,
        isOn,
        label: isOn ? 'ON' : 'OFF',
      };
    },
  },

  view(state) {
    return `Button is ${state.label}`;
  },
};

module.exports = {
  ButtonLogic,
};
