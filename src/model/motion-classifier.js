import { DriftState } from './drift-state.js';

export class MotionClassifier {
  classify({ velocity = 0, acceleration = 0, jitter = 0 } = {}) {
    if (jitter > 0.7) return DriftState.CHAOTIC;
    if (acceleration > 0.25 || velocity > 0.8) return DriftState.ACCELERATING;
    if (acceleration < -0.2 || velocity < 0.2) return DriftState.DECELERATING;
    return DriftState.STABLE;
  }
}
