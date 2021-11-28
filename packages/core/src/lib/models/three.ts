import * as THREE from 'three';

export type NonFunctionKeys<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
export type Overwrite<T, O> = Omit<T, NonFunctionKeys<O>> & O;

export type NgtTriplet = [x: number, y: number, z: number];
export type NgtQuad = [x: number, y: number, z: number, w: number];

export type NgtEuler = THREE.Euler | Parameters<THREE.Euler['set']>;
export type NgtMatrix4 = THREE.Matrix4 | Parameters<THREE.Matrix4['set']>;
export type NgtVector2 =
  | THREE.Vector2
  | Parameters<THREE.Vector2['set']>
  | Parameters<THREE.Vector2['setScalar']>[0];
export type NgtVector3 =
  | THREE.Vector3
  | Parameters<THREE.Vector3['set']>
  | Parameters<THREE.Vector3['setScalar']>[0];
export type NgtVector4 =
  | THREE.Vector4
  | Parameters<THREE.Vector4['set']>
  | Parameters<THREE.Vector4['setScalar']>[0];
export type NgtColor = THREE.ColorRepresentation | NgtTriplet;
export type NgtColorArray = typeof THREE.Color | Parameters<THREE.Color['set']>;
export type NgtLayers = THREE.Layers | Parameters<THREE.Layers['set']>[0];
export type NgtQuaternion =
  | THREE.Quaternion
  | Parameters<THREE.Quaternion['set']>;

export interface NgtCommonParameters {
  position?: NgtVector3;
  up?: NgtVector3;
  scale?: NgtVector3;
  rotation?: NgtEuler;
  matrix?: NgtMatrix4;
  quaternion?: NgtQuaternion;
  layers?: NgtLayers;
  background?: NgtColor;
  dispose?: (() => void) | null;
}
