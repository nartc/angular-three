import { applyProps, NgtRef, NgtStore } from '@angular-three/core';
import { inject, Pipe, PipeTransform } from '@angular/core';
import * as THREE from 'three';

export function useCamera(
  camera: THREE.Camera | NgtRef<THREE.Camera>,
  pointer: THREE.Vector2,
  raycasterProps?: Partial<THREE.Raycaster>
): THREE.Object3D['raycast'] {
  const raycaster = new THREE.Raycaster();

  if (raycasterProps) {
    applyProps(raycaster, raycasterProps);
  }

  return function (
    this: THREE.Object3D,
    _,
    intersects: THREE.Intersection[]
  ): void {
    raycaster.setFromCamera(
      pointer,
      camera instanceof THREE.Camera ? camera : camera.value
    );
    const rc = this.constructor.prototype.raycast.bind(this);
    if (rc) {
      rc(raycaster, intersects);
    }
  };
}

@Pipe({
  name: 'useCamera',
  standalone: true,
})
export class NgtSobaUseCamera implements PipeTransform {
  readonly #store = inject(NgtStore);

  transform(
    value: THREE.Camera | NgtRef<THREE.Camera>,
    raycasterProps?: Partial<THREE.Raycaster>
  ): THREE.Object3D['raycast'] {
    const pointer = this.#store.get((s) => s.pointer);
    return useCamera(value, pointer, raycasterProps);
  }
}
