import {
  coerceNumber,
  NgtAnyConstructor,
  NgtCommonMesh,
  NgtNumberInput,
  NgtObservableInput,
  provideCommonMeshRef,
  provideNgtCommonMesh,
} from '@angular-three/core';
import { Component, Input } from '@angular/core';
import { isObservable, map } from 'rxjs';
import * as THREE from 'three';

@Component({
  selector: 'ngt-instanced-mesh[count]',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonMesh(NgtInstancedMesh), provideCommonMeshRef(NgtInstancedMesh)],
})
export class NgtInstancedMesh extends NgtCommonMesh<THREE.InstancedMesh> {
  @Input() set count(count: NgtObservableInput<NgtNumberInput>) {
    this.set({
      count: isObservable(count) ? count.pipe(map(coerceNumber)) : coerceNumber(count),
    });
  }

  override get meshType(): NgtAnyConstructor<THREE.InstancedMesh> {
    return THREE.InstancedMesh;
  }

  override argsKeys = ['count'];

  override postInit() {
    super.postInit();
    this.instanceValue.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  }

  override get optionsFields() {
    return [...super.optionsFields, 'count'];
  }
}
