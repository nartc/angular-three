import { make, NgtTriple } from '@angular-three/core';
import * as THREE from 'three';

export const makePositionVector = (xyz: number[]) => make(THREE.Vector3, xyz).multiplyScalar(0.38);

export const colors = {
  bg: '#f0f0f0',
  hover: '#999',
  text: 'black',
  stroke: 'black',
};
export const defaultFaces = ['Right', 'Left', 'Top', 'Bottom', 'Front', 'Back'];

export const corners: THREE.Vector3[] = [
  [1, 1, 1],
  [1, 1, -1],
  [1, -1, 1],
  [1, -1, -1],
  [-1, 1, 1],
  [-1, 1, -1],
  [-1, -1, 1],
  [-1, -1, -1],
].map(makePositionVector);

export const cornerDimensions: NgtTriple = [0.25, 0.25, 0.25];

export const edges: THREE.Vector3[] = [
  [1, 1, 0],
  [1, 0, 1],
  [1, 0, -1],
  [1, -1, 0],
  [0, 1, 1],
  [0, 1, -1],
  [0, -1, 1],
  [0, -1, -1],
  [-1, 1, 0],
  [-1, 0, 1],
  [-1, 0, -1],
  [-1, -1, 0],
].map(makePositionVector);

export const edgeDimensions = edges.map(
  (edge) => edge.toArray().map((axis: number): number => (axis == 0 ? 0.5 : 0.25)) as NgtTriple
);
