import * as THREE from 'three';

export const cameras = [
  THREE.Camera,
  THREE.PerspectiveCamera,
  THREE.OrthographicCamera,
  THREE.ArrayCamera,
  THREE.StereoCamera,
].map((m) => m.name);
