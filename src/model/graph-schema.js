import { DriftStateList } from './drift-state.js';

export const GraphSchema = Object.freeze({
  nodes: DriftStateList.map((state) => ({ id: state, label: state })),
  edges: [
    ['stable', 'accelerating'],
    ['stable', 'decelerating'],
    ['accelerating', 'chaotic'],
    ['decelerating', 'stable'],
    ['chaotic', 'stable'],
  ].map(([source, target]) => ({ source, target })),
});
