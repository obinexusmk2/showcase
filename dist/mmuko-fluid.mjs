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
var DriftState;
(function (DriftState) {
    DriftState["RED"] = "RED";
    DriftState["ORANGE"] = "ORANGE";
    DriftState["YELLOW"] = "YELLOW";
    DriftState["GREEN"] = "GREEN";
})(DriftState || (DriftState = {}));
/**
 * Classify motion state from observer perspective
 * @param observer - observer position in R^3
 * @param current - current entity position
 * @param previous - previous entity position
 * @returns DriftState classification
 */
function classifyDrift(observer, current, previous) {
    const dx = current[0] - previous[0];
    const dy = current[1] - previous[1];
    const dz = current[2] - previous[2];
    // Vector from observer to entity
    const toEntity = [
        current[0] - observer[0],
        current[1] - observer[1],
        current[2] - observer[2],
    ];
    // Dot product of motion vector and observer-to-entity vector
    const dotProduct = dx * toEntity[0] + dy * toEntity[1] + dz * toEntity[2];
    const magnitude = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (magnitude < 0.0001) {
        return DriftState.ORANGE; // Static
    }
    const cosAngle = dotProduct / (magnitude * Math.sqrt(toEntity[0] * toEntity[0] + toEntity[1] * toEntity[1] + toEntity[2] * toEntity[2]));
    // Classify based on angle relative to observer
    if (cosAngle < -0.5) {
        return DriftState.GREEN; // Approaching (angle < 120°)
    }
    else if (cosAngle > 0.5) {
        return DriftState.RED; // Shifting away (angle > 60°)
    }
    else {
        return DriftState.YELLOW; // Orthogonal movement
    }
}
/**
 * Weighted interpolation for smooth UI transitions
 * Blends control point C and predicted point P with weight ratio 2/3 : 1/3
 * @param current - current control point
 * @param predicted - predicted next point
 * @param t - interpolation factor [0, 1]
 * @returns interpolated point
 */
function weightedInterpolate(current, predicted, t) {
    const weight = 2 / 3;
    const predWeight = 1 / 3;
    return [
        weight * current[0] + predWeight * predicted[0] * t,
        weight * current[1] + predWeight * predicted[1] * t,
        weight * current[2] + predWeight * predicted[2] * t,
    ];
}
/**
 * Compute midpoint between two coordinates
 * @param p1 - first point [x, y]
 * @param p2 - second point [x, y]
 * @returns midpoint [(x1+x2)/2, (y1+y2)/2]
 */
function computeMidpoint(p1, p2) {
    return [
        (p1[0] + p2[0]) / 2,
        (p1[1] + p2[1]) / 2,
    ];
}
// Default export for CommonJS compatibility
var index = {
    DriftState,
    classifyDrift,
    weightedInterpolate,
    computeMidpoint,
};

export { DriftState, classifyDrift, computeMidpoint, index as default, weightedInterpolate };
//# sourceMappingURL=mmuko-fluid.mjs.map
