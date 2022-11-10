import { applyProps, is, NgtRef, NgtStore } from '@angular-three/core';
import { inject, Pipe, PipeTransform } from '@angular/core';
import { filter, take } from 'rxjs';
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

  return function (this: THREE.Object3D, _, intersects: THREE.Intersection[]): void {
    const raycast = (camera: THREE.Camera) => {
      raycaster.setFromCamera(pointer, camera);
      const rc = this.constructor.prototype.raycast.bind(this);
      if (rc) {
        rc(raycaster, intersects);
      }
    };

    if (is.ref(camera)) {
      camera
        .pipe(
          filter((c) => !!c),
          take(1)
        )
        .subscribe(raycast);
    } else {
      raycast(camera as THREE.Camera);
    }
  };
}

@Pipe({
  name: 'useCamera',
  standalone: true,
})
export class NgtSobaUseCamera implements PipeTransform {
  private readonly store = inject(NgtStore);

  transform(
    value: THREE.Camera | NgtRef<THREE.Camera>,
    raycasterProps?: Partial<THREE.Raycaster>
  ): THREE.Object3D['raycast'] {
    const pointer = this.store.getState((s) => s.pointer);
    return useCamera(value, pointer, raycasterProps);
  }
}
