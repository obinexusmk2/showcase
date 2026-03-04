import { DriftState } from './drift-state.js';

export const TransitionMatrix = Object.freeze({
  [DriftState.STABLE]: {
    [DriftState.STABLE]: 0.6,
    [DriftState.ACCELERATING]: 0.2,
    [DriftState.DECELERATING]: 0.15,
    [DriftState.CHAOTIC]: 0.05,
  },
  [DriftState.ACCELERATING]: {
    [DriftState.STABLE]: 0.2,
    [DriftState.ACCELERATING]: 0.5,
    [DriftState.DECELERATING]: 0.1,
    [DriftState.CHAOTIC]: 0.2,
  },
  [DriftState.DECELERATING]: {
    [DriftState.STABLE]: 0.45,
    [DriftState.ACCELERATING]: 0.1,
    [DriftState.DECELERATING]: 0.35,
    [DriftState.CHAOTIC]: 0.1,
  },
  [DriftState.CHAOTIC]: {
    [DriftState.STABLE]: 0.1,
    [DriftState.ACCELERATING]: 0.3,
    [DriftState.DECELERATING]: 0.2,
    [DriftState.CHAOTIC]: 0.4,
  },
});
