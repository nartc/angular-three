import * as THREE from 'three';

export const helpers = [
  THREE.ArrowHelper,
  THREE.AxesHelper,
  THREE.BoxHelper,
  THREE.Box3Helper,
  THREE.GridHelper,
  THREE.CameraHelper,
  THREE.DirectionalLightHelper,
  THREE.HemisphereLightHelper,
  THREE.PlaneHelper,
  THREE.PointLightHelper,
  THREE.PolarGridHelper,
  THREE.SkeletonHelper,
  THREE.SpotLightHelper,
].map((m) => m.name);
