import {
  AnyConstructor,
  coerceNumberProperty,
  NgtCommonMesh,
  NumberInput,
  provideCommonMeshRef,
  provideNgtCommonMesh,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-instanced-mesh[count]',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtCommonMesh(NgtInstancedMesh), provideCommonMeshRef(NgtInstancedMesh)],
})
export class NgtInstancedMesh extends NgtCommonMesh<THREE.InstancedMesh> {
  @Input() set count(count: NumberInput) {
    this.set({ count: coerceNumberProperty(count) });
  }

  override get meshType(): AnyConstructor<THREE.InstancedMesh> {
    return THREE.InstancedMesh;
  }

  protected override postPrepare(instancedMesh: THREE.InstancedMesh) {
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  }

  protected override get optionFields(): Record<string, boolean> {
    return { ...super.optionFields, count: false };
  }

  protected override get argsKeys(): string[] {
    return ['count'];
  }
}

@NgModule({
  imports: [NgtInstancedMesh],
  exports: [NgtInstancedMesh],
})
export class NgtInstancedMeshModule {}
