import * as THREE from 'three';

export function isPerspectiveCamera(
    def: THREE.Camera
): def is THREE.PerspectiveCamera {
    return def && (def as THREE.PerspectiveCamera).isPerspectiveCamera;
}
