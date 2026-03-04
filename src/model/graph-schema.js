/**
 * Graph schema and validation helpers.
 *
 * Node shape:
 * {
 *   id: string,
 *   position: { x: number, y: number, z?: number },
 *   metadata?: object
 * }
 *
 * Edge shape:
 * {
 *   source: string,
 *   target: string,
 *   weight: {
 *     density: number,
 *     traversalCost: number,
 *     memoryRelevance: number,
 *     nodeInfluence: number
 *   }
 * }
 */

const WEIGHT_CHANNELS = [
  'density',
  'traversalCost',
  'memoryRelevance',
  'nodeInfluence'
];

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function validateNode(node) {
  const errors = [];

  if (!isPlainObject(node)) {
    return { valid: false, errors: ['Node must be an object.'] };
  }

  if (typeof node.id !== 'string' || node.id.trim() === '') {
    errors.push('Node.id must be a non-empty string.');
  }

  if (!isPlainObject(node.position)) {
    errors.push('Node.position must be an object containing numeric coordinates.');
  } else {
    if (!isFiniteNumber(node.position.x)) {
      errors.push('Node.position.x must be a finite number.');
    }

    if (!isFiniteNumber(node.position.y)) {
      errors.push('Node.position.y must be a finite number.');
    }

    if (
      Object.prototype.hasOwnProperty.call(node.position, 'z') &&
      !isFiniteNumber(node.position.z)
    ) {
      errors.push('Node.position.z must be a finite number when provided.');
    }
  }

  if (
    Object.prototype.hasOwnProperty.call(node, 'metadata') &&
    !isPlainObject(node.metadata)
  ) {
    errors.push('Node.metadata must be an object when provided.');
  }

  return { valid: errors.length === 0, errors };
}

function validateEdge(edge, nodeSet) {
  const errors = [];

  if (!isPlainObject(edge)) {
    return { valid: false, errors: ['Edge must be an object.'] };
  }

  if (typeof edge.source !== 'string' || edge.source.trim() === '') {
    errors.push('Edge.source must be a non-empty string.');
  }

  if (typeof edge.target !== 'string' || edge.target.trim() === '') {
    errors.push('Edge.target must be a non-empty string.');
  }

  if (nodeSet instanceof Set) {
    if (typeof edge.source === 'string' && !nodeSet.has(edge.source)) {
      errors.push(`Edge.source references unknown node id: "${edge.source}".`);
    }

    if (typeof edge.target === 'string' && !nodeSet.has(edge.target)) {
      errors.push(`Edge.target references unknown node id: "${edge.target}".`);
    }
  }

  if (!isPlainObject(edge.weight)) {
    errors.push('Edge.weight must be an object with all required weight channels.');
  } else {
    for (const channel of WEIGHT_CHANNELS) {
      const value = edge.weight[channel];

      if (!isFiniteNumber(value)) {
        errors.push(`Edge.weight.${channel} must be a finite number.`);
        continue;
      }

      if (value < 0) {
        errors.push(`Edge.weight.${channel} must be non-negative.`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

function validateGraph(graph) {
  const errors = [];

  if (!isPlainObject(graph)) {
    return { valid: false, errors: ['Graph must be an object.'] };
  }

  if (!Array.isArray(graph.nodes)) {
    errors.push('Graph.nodes must be an array.');
  }

  if (!Array.isArray(graph.edges)) {
    errors.push('Graph.edges must be an array.');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const nodeSet = new Set();

  graph.nodes.forEach((node, index) => {
    const nodeValidation = validateNode(node);

    if (!nodeValidation.valid) {
      nodeValidation.errors.forEach((message) => {
        errors.push(`nodes[${index}]: ${message}`);
      });
    }

    if (typeof node?.id === 'string' && node.id.trim() !== '') {
      if (nodeSet.has(node.id)) {
        errors.push(`nodes[${index}]: Duplicate node id "${node.id}".`);
      }
      nodeSet.add(node.id);
    }
  });

  graph.edges.forEach((edge, index) => {
    const edgeValidation = validateEdge(edge, nodeSet);

    if (!edgeValidation.valid) {
      edgeValidation.errors.forEach((message) => {
        errors.push(`edges[${index}]: ${message}`);
      });
    }
  });

  return { valid: errors.length === 0, errors };
}

module.exports = {
  WEIGHT_CHANNELS,
  validateNode,
  validateEdge,
  validateGraph
};
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
