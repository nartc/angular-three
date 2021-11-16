export const vectorNames = [
  'angularFactor',
  'angularVelocity',
  'linearFactor',
  'position',
  'velocity',
] as const;

export type VectorName = typeof vectorNames[number];
