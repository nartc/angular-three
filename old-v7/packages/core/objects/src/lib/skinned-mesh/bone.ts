import {
  injectBoneHostRef,
  injectSkeletonHostRef,
  injectSkinnedMeshHostRef,
  NgtObject,
  provideNgtObject,
  provideObjectRef,
} from '@angular-three/core';
import { Component, inject } from '@angular/core';
import * as THREE from 'three';
import { NgtSkeleton } from './skeleton';
import { NgtSkinnedMesh } from './skinned-mesh';

@Component({
  selector: 'ngt-bone',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtObject(NgtBone), provideObjectRef(NgtBone)],
})
export class NgtBone extends NgtObject<THREE.Bone> {
  private readonly hostBoneRef = injectBoneHostRef({
    skipSelf: true,
    optional: true,
  });
  private readonly hostSkeletonRef = injectSkeletonHostRef({
    skipSelf: true,
    optional: true,
  });
  private readonly hostSkinnedMeshRef = injectSkinnedMeshHostRef({
    skipSelf: true,
    optional: true,
  });

  private readonly parentBone = inject(NgtBone, {
    skipSelf: true,
    optional: true,
  });
  private readonly parentSkinnedMesh = inject(NgtSkinnedMesh, {
    optional: true,
  });
  private readonly parentSkeleton = inject(NgtSkeleton, { optional: true });

  override instanceInitFn(): THREE.Bone {
    return new THREE.Bone();
  }

  override postInit() {
    super.postInit();
    const parentSkeleton = this.parentSkeleton?.instanceValue || this.hostSkeletonRef?.().value;

    if (parentSkeleton) {
      (parentSkeleton as THREE.Skeleton).bones.push(this.instanceValue);
    }
  }
}
