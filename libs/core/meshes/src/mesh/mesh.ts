import { AnyConstructor, NgtCommonMesh, provideCommonMeshRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three/src/Three';

@Component({
  selector: 'ngt-mesh',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonMeshRef(NgtMesh)],
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
