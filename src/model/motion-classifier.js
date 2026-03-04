const MOTION_LABELS = Object.freeze({
  AWAY: 'away',
  STATIC: 'static',
  ORTHOGONAL: 'orthogonal',
  TOWARD: 'toward',
});

function toVector3(point, name) {
  if (!Array.isArray(point) || point.length < 3) {
    throw new TypeError(`${name} must be an array with at least 3 numeric values.`);
  }

  const vector = [Number(point[0]), Number(point[1]), Number(point[2])];

  if (vector.some((value) => Number.isNaN(value))) {
    throw new TypeError(`${name} must contain numeric values.`);
  }

  return vector;
}

function subtract(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function magnitude(vector) {
  return Math.hypot(vector[0], vector[1], vector[2]);
}

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

/**
 * Classifies motion of an entity between two timesteps from an observer frame.
 *
 * Returned labels are normalized for transition-matrix indexing:
 * - "toward"
 * - "away"
 * - "orthogonal"
 * - "static"
 *
 * @param {number[]} observerPos - Observer/camera position [x, y, z].
 * @param {number[]} currentPos - Entity position at time t [x, y, z].
 * @param {number[]} nextPos - Entity position at time t+1 [x, y, z].
 * @param {number} [epsilon=1e-6] - Numerical tolerance.
 * @returns {string} Motion label.
 */
function classifyMotion(observerPos, currentPos, nextPos, epsilon = 1e-6) {
  if (!Number.isFinite(epsilon) || epsilon <= 0) {
    throw new TypeError('epsilon must be a finite number greater than zero.');
  }

  const observer = toVector3(observerPos, 'observerPos');
  const current = toVector3(currentPos, 'currentPos');
  const next = toVector3(nextPos, 'nextPos');

  const movement = subtract(next, current);
  const movementMagnitude = magnitude(movement);

  if (movementMagnitude <= epsilon) {
    return MOTION_LABELS.STATIC;
  }

  const observerDirection = subtract(current, observer);
  const observerDistance = magnitude(observerDirection);

  if (observerDistance <= epsilon) {
    // Radial direction is undefined when entity and observer overlap.
    // Any measurable movement is lateral from this frame.
    return MOTION_LABELS.ORTHOGONAL;
  }

  const radialUnit = [
    observerDirection[0] / observerDistance,
    observerDirection[1] / observerDistance,
    observerDirection[2] / observerDistance,
  ];

  const radialDelta = dot(movement, radialUnit);

  if (radialDelta > epsilon) {
    return MOTION_LABELS.AWAY;
  }

  if (radialDelta < -epsilon) {
    return MOTION_LABELS.TOWARD;
  }

  const lateralMagnitudeSquared = Math.max(
    0,
    movementMagnitude * movementMagnitude - radialDelta * radialDelta,
  );

  if (Math.sqrt(lateralMagnitudeSquared) > epsilon) {
    return MOTION_LABELS.ORTHOGONAL;
  }

  return MOTION_LABELS.STATIC;
}


import { DriftState } from './drift-state.js';

export class MotionClassifier {
  classify({ velocity = 0, acceleration = 0, jitter = 0 } = {}) {
    if (jitter > 0.7) return DriftState.CHAOTIC;
    if (acceleration > 0.25 || velocity > 0.8) return DriftState.ACCELERATING;
    if (acceleration < -0.2 || velocity < 0.2) return DriftState.DECELERATING;
    return DriftState.STABLE;
  }
}

export {
  MOTION_LABELS,
  classifyMotion,
};

