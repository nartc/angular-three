import {
  AnyConstructor,
  coerceNumberProperty,
  NgtCommonMesh,
  NumberInput,
  provideCommonMeshRef,
  provideNgtCommonMesh,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-instanced-mesh[count]',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNgtCommonMesh(NgtInstancedMesh),
    provideCommonMeshRef(NgtInstancedMesh),
  ],
})
export class NgtInstancedMesh extends NgtCommonMesh<THREE.InstancedMesh> {
  @Input() set count(count: NumberInput) {
    this.set({ count: coerceNumberProperty(count) });
  }

  override get meshType(): AnyConstructor<THREE.InstancedMesh> {
    return THREE.InstancedMesh;
  }

  override argsKeys = ['count'];

  override postPrepare(object: THREE.InstancedMesh) {
    super.postPrepare(object);
    object.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  }

  override get optionsFields(): Record<string, boolean> {
    return { ...super.optionsFields, count: false };
  }
}
