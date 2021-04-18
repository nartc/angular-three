import type {
  Color,
  Euler,
  Layers,
  Matrix4,
  Quaternion,
  Vector2,
  Vector3,
  Vector4,
} from 'three';

export type NonFunctionKeys<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
export type Overwrite<T, O> = Omit<T, NonFunctionKeys<O>> & O;

export type ThreeEuler = Euler | Parameters<Euler['set']>;
export type ThreeMatrix4 = Matrix4 | Parameters<Matrix4['set']>;
export type ThreeVector2 =
  | Vector2
  | Parameters<Vector2['set']>
  | Parameters<Vector2['setScalar']>[0];
export type ThreeVector3 =
  | Vector3
  | Parameters<Vector3['set']>
  | Parameters<Vector3['setScalar']>[0];
export type ThreeVector4 =
  | Vector4
  | Parameters<Vector4['set']>
  | Parameters<Vector4['setScalar']>[0];
export type ThreeColor =
  | ConstructorParameters<typeof Color>
  | Color
  | number
  | string; // Parameters<T> will not work here because of multiple function signatures in three.js types
export type ThreeColorArray = typeof Color | Parameters<Color['set']>;
export type ThreeLayers = Layers | Parameters<Layers['set']>[0];
export type ThreeQuaternion = Quaternion | Parameters<Quaternion['set']>;

export interface ThreeCommonParameters {
  position?: ThreeVector3;
  up?: ThreeVector3;
  scale?: ThreeVector3;
  rotation?: ThreeEuler;
  matrix?: ThreeMatrix4;
  quaternion?: ThreeQuaternion;
  layers?: ThreeLayers;
  dispose?: (() => void) | null;
}
