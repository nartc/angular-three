import {
  coerceBoolean,
  make,
  NgtAnyConstructor,
  NgtBooleanInput,
  NgtCommonMesh,
  NgtMatrix4,
  NgtObservableInput,
  provideCommonMeshRef,
  provideNgtCommonMesh,
} from '@angular-three/core';
import { Component, Input } from '@angular/core';
import { isObservable, map } from 'rxjs';
import * as THREE from 'three';

@Component({
  selector: 'ngt-skinned-mesh',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonMesh(NgtSkinnedMesh), provideCommonMeshRef(NgtSkinnedMesh)],
})
export class NgtSkinnedMesh extends NgtCommonMesh<THREE.SkinnedMesh> {
  override get meshType(): NgtAnyConstructor<THREE.SkinnedMesh> {
    return THREE.SkinnedMesh;
  }

  @Input() set skeleton(skeleton: NgtObservableInput<THREE.Skeleton>) {
    this.set({ skeleton });
  }

  @Input() set useVertexTexture(useVertexTexture: NgtObservableInput<NgtBooleanInput>) {
    this.set({
      useVertexTexture: isObservable(useVertexTexture)
        ? useVertexTexture.pipe(map(coerceBoolean))
        : coerceBoolean(useVertexTexture),
    });
  }

  @Input() set bindMatrix(bindMatrix: NgtObservableInput<NgtMatrix4>) {
    this.set({
      bindMatrix: isObservable(bindMatrix)
        ? bindMatrix.pipe(map((val) => make(THREE.Matrix4, val)))
        : make(THREE.Matrix4, bindMatrix),
    });
  }

  @Input() set bindMatrixInverse(bindMatrixInverse: NgtObservableInput<NgtMatrix4>) {
    this.set({
      bindMatrixInverse: isObservable(bindMatrixInverse)
        ? bindMatrixInverse.pipe(map((val) => make(THREE.Matrix4, val)))
        : make(THREE.Matrix4, bindMatrixInverse),
    });
  }

  @Input() set bindMode(bindMode: NgtObservableInput<string>) {
    this.set({ bindMode });
  }

  override argsKeys = ['useVertexTexture'];

  override get optionsFields() {
    return [...super.optionsFields, 'bindMatrix', 'bindMatrixInverse', 'bindMode', 'skeleton'];
  }

  bind(skeleton: THREE.Skeleton) {
    this.instanceValue.bind(
      skeleton,
      this.getState((s) => s['bindMatrix'])
    );
  }
}
