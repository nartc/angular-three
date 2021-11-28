import * as THREE from 'three';

export const gizmoHelperConstants = {
  turnRate: 2 * Math.PI,
  dummy: new THREE.Object3D(),
  matrix: new THREE.Matrix4(),
  q1: new THREE.Quaternion(),
  q2: new THREE.Quaternion(),
  target: new THREE.Vector3(),
  targetPosition: new THREE.Vector3(),
};
