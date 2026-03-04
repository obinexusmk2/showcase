const assert = require('assert');
const { toFunctional } = require('../adapter/DOPAdapter');
const { ButtonLogic } = require('../components/ButtonLogic');

const ui = toFunctional(ButtonLogic);

assert.strictEqual(ui.render(), 'Button is OFF');
assert.deepStrictEqual(ui.getState(), { isOn: false, label: 'OFF' });

const firstDispatchOutput = ui.dispatch('toggle');
assert.strictEqual(firstDispatchOutput, 'Button is ON');
assert.deepStrictEqual(ui.getState(), { isOn: true, label: 'ON' });

const secondDispatchOutput = ui.dispatch('toggle');
assert.strictEqual(secondDispatchOutput, 'Button is OFF');
assert.deepStrictEqual(ui.getState(), { isOn: false, label: 'OFF' });

const thirdDispatchOutput = ui.dispatch('toggle');
assert.strictEqual(thirdDispatchOutput, 'Button is ON');
assert.deepStrictEqual(ui.getState(), { isOn: true, label: 'ON' });

console.log('buttonLogic.dispatch.test.js passed');
