export const DriftState = Object.freeze({
  STABLE: 'stable',
  ACCELERATING: 'accelerating',
  DECELERATING: 'decelerating',
  CHAOTIC: 'chaotic',
});

export const DriftStateColor = Object.freeze({
  [DriftState.STABLE]: '#2ecc71',
  [DriftState.ACCELERATING]: '#f1c40f',
  [DriftState.DECELERATING]: '#3498db',
  [DriftState.CHAOTIC]: '#e74c3c',
});

export const DriftStateList = Object.freeze(Object.values(DriftState));
