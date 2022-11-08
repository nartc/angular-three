import {
  injectBoneHostRef,
  injectSkeletonHostRef,
  injectSkinnedMeshHostRef,
  NgtObject,
  provideNgtObject,
  provideObjectRef,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import * as THREE from 'three';
import { NgtSkeleton } from './skeleton';
import { NgtSkinnedMesh } from './skinned-mesh';

@Component({
  selector: 'ngt-bone',
  standalone: true,
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtObject(NgtBone), provideObjectRef(NgtBone)],
})
export class NgtBone extends NgtObject<THREE.Bone> {
  readonly #hostBoneRef = injectBoneHostRef({ skipSelf: true, optional: true });
  readonly #hostSkeletonRef = injectSkeletonHostRef({
    skipSelf: true,
    optional: true,
  });
  readonly #hostSkinnedMeshRef = injectSkinnedMeshHostRef({
    skipSelf: true,
    optional: true,
  });

  readonly #parentBone = inject(NgtBone, { skipSelf: true, optional: true });
  readonly #parentSkinnedMesh = inject(NgtSkinnedMesh, { optional: true });
  readonly #parentSkeleton = inject(NgtSkeleton, { optional: true });

  override instanceInitFn(): THREE.Bone {
    return new THREE.Bone();
  }

  override postPrepare(bone: THREE.Bone) {
    super.postPrepare(bone);
    const parentSkeleton =
      this.#parentSkeleton?.instanceValue || this.#hostSkeletonRef?.().value;

    if (parentSkeleton) {
      (parentSkeleton as THREE.Skeleton).bones.push(bone);
    }
  }
}
