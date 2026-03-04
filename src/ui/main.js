import '../ui/components/drift-panel.js';
import { DOPAdapter } from './components/dop-adapter.js';
import { TransitionMatrix } from '../model/transition-matrix.js';
import { GraphSchema } from '../model/graph-schema.js';
import { interpolateSeries } from '../model/interpolation.js';

const adapter = new DOPAdapter();
const simulatedSignal = {
  velocity: interpolateSeries([0.1, 0.95, 0.4], 0.5),
  acceleration: 0.3,
  jitter: 0.2,
};

const panelData = adapter.fromSignal(simulatedSignal);

const panel = document.querySelector('drift-panel');
panel.data = panelData;

window.appModel = {
  transitionMatrix: TransitionMatrix,
  graphSchema: GraphSchema,
  panelData,
};
