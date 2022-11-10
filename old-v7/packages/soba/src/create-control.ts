export function createRangeControl(min: number, max: number, step: number) {
  return { type: 'range', min, max, step };
}
