import {
  AWAY_RED,
  STATIC_ORANGE,
  ORTHOGONAL_YELLOW,
  TOWARD_GREEN,
  DRIFT_STATES,
} from './drift-state.js';

const MOTION_CLASSES = Object.freeze({
  AWAY: AWAY_RED,
  STATIC: STATIC_ORANGE,
  ORTHOGONAL: ORTHOGONAL_YELLOW,
  TOWARD: TOWARD_GREEN,
});

const STATE_SET = new Set(DRIFT_STATES);

const TRANSITION_MATRIX = Object.freeze({
  [AWAY_RED]: Object.freeze({
    [AWAY_RED]: AWAY_RED,
    [STATIC_ORANGE]: STATIC_ORANGE,
    [ORTHOGONAL_YELLOW]: ORTHOGONAL_YELLOW,
    [TOWARD_GREEN]: TOWARD_GREEN,
  }),
  [STATIC_ORANGE]: Object.freeze({
    [AWAY_RED]: AWAY_RED,
    [STATIC_ORANGE]: STATIC_ORANGE,
    [ORTHOGONAL_YELLOW]: ORTHOGONAL_YELLOW,
    [TOWARD_GREEN]: TOWARD_GREEN,
  }),
  [ORTHOGONAL_YELLOW]: Object.freeze({
    [AWAY_RED]: AWAY_RED,
    [STATIC_ORANGE]: STATIC_ORANGE,
    [ORTHOGONAL_YELLOW]: ORTHOGONAL_YELLOW,
    [TOWARD_GREEN]: TOWARD_GREEN,
  }),
  [TOWARD_GREEN]: Object.freeze({
    [AWAY_RED]: AWAY_RED,
    [STATIC_ORANGE]: STATIC_ORANGE,
    [ORTHOGONAL_YELLOW]: ORTHOGONAL_YELLOW,
    [TOWARD_GREEN]: TOWARD_GREEN,
  }),
});

const FALLBACK_STATE = STATIC_ORANGE;

function normalizeState(value) {
  return STATE_SET.has(value) ? value : FALLBACK_STATE;
}

function normalizeMotionClass(value) {
  if (STATE_SET.has(value)) {
    return value;
  }

  if (typeof value === 'string') {
    return MOTION_CLASSES[value] ?? FALLBACK_STATE;
  }

  return FALLBACK_STATE;
}

export function getTransitionMatrix() {
  return TRANSITION_MATRIX;
}

export function getNextDriftState(currentState, motionClass) {
  const safeCurrentState = normalizeState(currentState);
  const safeMotionClass = normalizeMotionClass(motionClass);

  return TRANSITION_MATRIX[safeCurrentState][safeMotionClass] ?? FALLBACK_STATE;
}
