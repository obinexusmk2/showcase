import { MotionClassifier } from '../../model/motion-classifier.js';
import { DriftStateColor } from '../../model/drift-state.js';

export class DOPAdapter {
  constructor(classifier = new MotionClassifier()) {
    this.classifier = classifier;
  }

  fromSignal(signal) {
    const currentState = this.classifier.classify(signal);
    return {
      currentState,
      stateColors: DriftStateColor,
    };
  }
}
