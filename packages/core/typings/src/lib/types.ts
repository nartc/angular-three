import type { Mesh } from 'three';

export type UniqueMeshArgs<
  TMeshConstructor extends new (...args: any[]) => any = typeof Mesh,
  TMeshConstructorParams = ConstructorParameters<TMeshConstructor>
> = TMeshConstructorParams extends [
  infer Material,
  infer Geometry,
  ...infer Rest
]
  ? Rest
  : never;
