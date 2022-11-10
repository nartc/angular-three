import { NgtAnyConstructor, NgtCommonMesh, provideCommonMeshRef, provideNgtCommonMesh } from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';

// NgtMesh -> NgtCommonMesh -> NgtMaterialGeometry -> NgtObject -> NgtObjectInputs -> NgtInstance

@Component({
  selector: 'ngt-mesh',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonMesh(NgtMesh), provideCommonMeshRef(NgtMesh)],
})
export class NgtMesh extends NgtCommonMesh {
  override get meshType(): NgtAnyConstructor<THREE.Mesh> {
    return THREE.Mesh;
  }
}
