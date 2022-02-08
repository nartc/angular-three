import * as THREE from 'three';

export function isOrthographicCamera(
  def: THREE.Camera
): def is THREE.OrthographicCamera {
  return def && (def as THREE.OrthographicCamera).isOrthographicCamera;
}
