/**
 * MMUKO Fluid Holographic System
 * Weighted graph-based drift model for interaction prediction and UI smoothing
 *
 * Core data structures:
 * - G = (V, E, W): weighted directed graph
 * - V: vertices (interaction entities)
 * - E: edges (relationships/transitions)
 * - W: weights (density, cost, intensity)
 */
export declare enum DriftState {
    RED = "RED",// Shift-away (moving away from observer)
    ORANGE = "ORANGE",// Rest state (static / no displacement)
    YELLOW = "YELLOW",// Orthogonal movement (~90° relative shift)
    GREEN = "GREEN"
}
export interface Vertex {
    id: string;
    position: [number, number, number];
    metadata?: Record<string, unknown>;
}
export interface Edge {
    from: string;
    to: string;
    weight: number;
}
export interface WeightedGraph {
    vertices: Map<string, Vertex>;
    edges: Edge[];
    weights: Map<string, number>;
}
/**
 * Classify motion state from observer perspective
 * @param observer - observer position in R^3
 * @param current - current entity position
 * @param previous - previous entity position
 * @returns DriftState classification
 */
export declare function classifyDrift(observer: [number, number, number], current: [number, number, number], previous: [number, number, number]): DriftState;
/**
 * Weighted interpolation for smooth UI transitions
 * Blends control point C and predicted point P with weight ratio 2/3 : 1/3
 * @param current - current control point
 * @param predicted - predicted next point
 * @param t - interpolation factor [0, 1]
 * @returns interpolated point
 */
export declare function weightedInterpolate(current: [number, number, number], predicted: [number, number, number], t: number): [number, number, number];
/**
 * Compute midpoint between two coordinates
 * @param p1 - first point [x, y]
 * @param p2 - second point [x, y]
 * @returns midpoint [(x1+x2)/2, (y1+y2)/2]
 */
export declare function computeMidpoint(p1: [number, number], p2: [number, number]): [number, number];
declare const _default: {
    DriftState: typeof DriftState;
    classifyDrift: typeof classifyDrift;
    weightedInterpolate: typeof weightedInterpolate;
    computeMidpoint: typeof computeMidpoint;
};
export default _default;
//# sourceMappingURL=index.d.ts.map