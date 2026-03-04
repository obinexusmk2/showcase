import {
  DEFAULT_CURRENT_WEIGHT,
  DEFAULT_PREDICTED_WEIGHT,
  weightedBlend3D,
} from './model/interpolation.js';

export const mapMotionToDriftState = (motionVector) => {
  // Placeholder implementation. Existing classifier logic can be inserted here.
  return motionVector;
};

export const updateDriftState = ({
  currentMotion,
  predictedMotion,
  wCurrent = DEFAULT_CURRENT_WEIGHT,
  wPredicted = DEFAULT_PREDICTED_WEIGHT,
}) => {
  // Blend happens before mapping into DriftState.
  const smoothedMotion = weightedBlend3D(
    currentMotion,
    predictedMotion,
    wCurrent,
    wPredicted,
  );

  return mapMotionToDriftState(smoothedMotion);
};
