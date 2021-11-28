import * as THREE from 'three';

export const isOrthographicCamera = (
  def: THREE.Camera
): def is THREE.OrthographicCamera =>
  def && (def as THREE.OrthographicCamera).isOrthographicCamera;
