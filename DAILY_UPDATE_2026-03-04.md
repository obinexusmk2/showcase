# Daily Update — 2026-03-04

## Project focus
Today’s work defines a **gas/fluid-inspired drift model** for a rocket-style holographic interface in the `showcase` project.

Core idea:
- Represent interaction dynamics as a weighted graph:
  - `G = (V, E, W)`
  - `V`: vertices (entities)
  - `E`: edges (relationships)
  - `W`: weights (density/cost/intensity over graph movement)

## Drift definition
A drift is modeled as a tripartite auxiliary vector in `R^3` (`x, y, z`) mapped onto the weighted graph state.

Interpretation:
- Motion and orientation are classified from the observer/camera perspective.
- The graph edge color reflects directional drift state.

## Drift color states (updated)
State palette currently used in the model:
1. **Red** — moving away from observer (shift-away state)
2. **Orange** — static / no displacement (rest state)
3. **Yellow** — orthogonal movement (about 90° relative shift)
4. **Green** — moving toward observer (approach state)

This is now treated as a four-state transition system used for UI signaling.

## Weight and cost semantics
`W` is not only edge weight; it encodes:
- local density,
- in-memory processing relevance,
- traversal/computation cost,
- node influence under lattice-like transitions.

Working concept:
- weight contributes to deciding whether an interaction path is feasible,
- high-cost transitions can be deprioritized or deferred,
- supports ahead-of-time interaction prediction in UI.

## Spline / weighted interpolation note
For predictive motion and smooth UI transitions, interpolation is modeled as weighted blending between current and predicted points.

Reference form used in notes:
- weighted combination of control/current point `C` and predicted point `P` over interval `t`.
- practical example in notes emphasizes a `2/3` and `1/3` weighting split for smoothing.

## Midpoint and piecewise classification notes
Current notebook direction includes:
- midpoint extraction from coordinate pairs,
- piecewise decision functions,
- parity/even-odd style branching as a classifier gate,
- lattice join/meet/disjoint reasoning for compositional state rules.

## Product direction for website UI
Goal for `showcase`:
- build a holographic fluid interface that preloads probable next states,
- represent interaction vectors visually through drift colors,
- support binary-loadable media assets and web-native rendering paths,
- use smooth transitions to improve perceived responsiveness.

## Next implementation steps
1. Define a concrete `DriftState` enum and transition matrix.
2. Implement graph schema (`V`, `E`, `W`) with explicit cost channels.
3. Add observer-frame motion classifier (toward/away/orthogonal/static).
4. Add weighted interpolation utility for visual smoothing.
5. Create a minimal front-end panel that renders the four drift colors in real time.
