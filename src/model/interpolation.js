export const DEFAULT_CURRENT_WEIGHT = 2 / 3;
export const DEFAULT_PREDICTED_WEIGHT = 1 / 3;

const EPSILON = 1e-12;

const isFiniteNumber = (value) => Number.isFinite(value);

const clamp01 = (value) => {
  if (!isFiniteNumber(value)) {
    throw new TypeError(`Expected a finite number, got: ${value}`);
  }

  if (value <= 0) {
    return 0;
  }

  if (value >= 1) {
    return 1;
  }

  return value;
};

const normalizeWeights = (wCurrent, wPredicted) => {
  if (!isFiniteNumber(wCurrent) || !isFiniteNumber(wPredicted)) {
    throw new TypeError('Blend weights must be finite numbers.');
  }

  const clampedCurrent = Math.max(0, wCurrent);
  const clampedPredicted = Math.max(0, wPredicted);
  const total = clampedCurrent + clampedPredicted;

  if (total <= EPSILON) {
    return {
      current: DEFAULT_CURRENT_WEIGHT,
      predicted: DEFAULT_PREDICTED_WEIGHT,
    };
  }

  return {
    current: clampedCurrent / total,
    predicted: clampedPredicted / total,
  };
};

const ensurePoint = (point, expectedLength, label) => {
  if (!Array.isArray(point) || point.length !== expectedLength) {
    throw new TypeError(`${label} must be an array of length ${expectedLength}.`);
  }

  if (!point.every(isFiniteNumber)) {
    throw new TypeError(`${label} must contain only finite numbers.`);
  }
};

export const lerp = (a, b, t) => {
  if (!isFiniteNumber(a) || !isFiniteNumber(b)) {
    throw new TypeError('lerp(a, b, t) requires finite numeric endpoints.');
  }

  const clampedT = clamp01(t);
  return a + (b - a) * clampedT;
};

export const weightedBlend = (
  current,
  predicted,
  wCurrent = DEFAULT_CURRENT_WEIGHT,
  wPredicted = DEFAULT_PREDICTED_WEIGHT,
) => {
  if (!isFiniteNumber(current) || !isFiniteNumber(predicted)) {
    throw new TypeError('weightedBlend(current, predicted, ...) requires finite numeric values.');
  }

  const weights = normalizeWeights(wCurrent, wPredicted);
  return current * weights.current + predicted * weights.predicted;
};

export const lerp2D = (a, b, t) => {
  ensurePoint(a, 2, 'a');
  ensurePoint(b, 2, 'b');

  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
};

export const lerp3D = (a, b, t) => {
  ensurePoint(a, 3, 'a');
  ensurePoint(b, 3, 'b');

  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
};

export const weightedBlend2D = (
  current,
  predicted,
  wCurrent = DEFAULT_CURRENT_WEIGHT,
  wPredicted = DEFAULT_PREDICTED_WEIGHT,
) => {
  ensurePoint(current, 2, 'current');
  ensurePoint(predicted, 2, 'predicted');

  return [
    weightedBlend(current[0], predicted[0], wCurrent, wPredicted),
    weightedBlend(current[1], predicted[1], wCurrent, wPredicted),
  ];
};

export const weightedBlend3D = (
  current,
  predicted,
  wCurrent = DEFAULT_CURRENT_WEIGHT,
  wPredicted = DEFAULT_PREDICTED_WEIGHT,
) => {
  ensurePoint(current, 3, 'current');
  ensurePoint(predicted, 3, 'predicted');

  return [
    weightedBlend(current[0], predicted[0], wCurrent, wPredicted),
    weightedBlend(current[1], predicted[1], wCurrent, wPredicted),
    weightedBlend(current[2], predicted[2], wCurrent, wPredicted),
  ];
};
export function lerp(start, end, t) {
  return start + (end - start) * t;
}

export function interpolateSeries(values, t) {
  if (!values.length) return 0;
  if (values.length === 1) return values[0];

  const scaled = Math.max(0, Math.min(1, t)) * (values.length - 1);
  const index = Math.floor(scaled);
  const nextIndex = Math.min(values.length - 1, index + 1);
  const localT = scaled - index;

  return lerp(values[index], values[nextIndex], localT);
}
