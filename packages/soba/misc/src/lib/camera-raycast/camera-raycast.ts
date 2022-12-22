import { applyProps, injectNgtStore, is, NgtInjectedRef } from '@angular-three/core';
import { ElementRef } from '@angular/core';
import { take } from 'rxjs';
import { Raycaster } from 'three';

export function injectCameraRaycast(
  camera: THREE.Camera | ElementRef<THREE.Camera>,
  raycasterProps?: Partial<THREE.Raycaster>
): THREE.Object3D['raycast'] {
  const store = injectNgtStore();

  const raycaster = new Raycaster();

  if (raycasterProps) {
    applyProps(raycaster, raycasterProps);
  }

  return function (this: THREE.Object3D, _, intersects: THREE.Intersection[]): void {
    const raycast = (camera: THREE.Camera) => {
      const pointer = store.get((s) => s.pointer);
      raycaster.setFromCamera(pointer, camera);
      const rc = this.constructor.prototype.raycast.bind(this);
      if (rc) {
        rc(raycaster, intersects);
      }
    };

    if (is.ref(camera)) {
      (camera as NgtInjectedRef<THREE.Camera>).$.pipe(take(1)).subscribe(raycast);
    } else {
      raycast(camera);
    }
  };
}
