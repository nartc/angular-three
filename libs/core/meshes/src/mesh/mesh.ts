import { AnyConstructor, NgtCommonMesh, provideCommonMeshRef, provideNgtCommonMesh } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-mesh',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtCommonMesh(NgtMesh), provideCommonMeshRef(NgtMesh)],
})
export class NgtMesh extends NgtCommonMesh {
  override get meshType(): AnyConstructor<THREE.Mesh> {
    return THREE.Mesh;
  }
}

@NgModule({
  imports: [NgtMesh],
  exports: [NgtMesh],
})
export class NgtMeshModule {}
