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
