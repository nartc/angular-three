import {
  AnyConstructor,
  BooleanInput,
  coerceBooleanProperty,
  make,
  NgtCommonMesh,
  NgtMatrix4,
  provideCommonMeshRef,
  provideNgtCommonMesh,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-skinned-mesh',
  standalone: true,
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNgtCommonMesh(NgtSkinnedMesh),
    provideCommonMeshRef(NgtSkinnedMesh),
  ],
})
export class NgtSkinnedMesh extends NgtCommonMesh<THREE.SkinnedMesh> {
  override get meshType(): AnyConstructor<THREE.SkinnedMesh> {
    return THREE.SkinnedMesh;
  }

  @Input() set skeleton(skeleton: THREE.Skeleton) {
    this.set({ skeleton });
  }

  @Input() set useVertexTexture(useVertexTexture: BooleanInput) {
    this.set({ useVertexTexture: coerceBooleanProperty(useVertexTexture) });
  }

  @Input() set bindMatrix(bindMatrix: NgtMatrix4) {
    this.set({ bindMatrix: make(THREE.Matrix4, bindMatrix) });
  }

  @Input() set bindMatrixInverse(bindMatrixInverse: NgtMatrix4) {
    this.set({
      bindMatrixInverse: make(THREE.Matrix4, bindMatrixInverse),
    });
  }

  @Input() set bindMode(bindMode: string) {
    this.set({ bindMode });
  }

  override argsKeys = ['useVertexTexture'];

  override get optionsFields(): Record<string, boolean> {
    return {
      ...super.optionsFields,
      bindMatrix: true,
      bindMatrixInverse: true,
      bindMode: true,
      skeleton: true,
    };
  }

  bind(skeleton: THREE.Skeleton) {
    this.instanceValue.bind(
      skeleton,
      this.get((s) => s['bindMatrix'])
    );
  }
}
