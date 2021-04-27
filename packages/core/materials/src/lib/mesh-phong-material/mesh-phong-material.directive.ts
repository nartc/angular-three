// GENERATED

import { ThreeMaterial } from '@angular-three/core';
import { Directive } from '@angular/core';
import { MeshPhongMaterial, MeshPhongMaterialParameters } from 'three';

@Directive({
  selector: 'ngt-mesh-phong-material',
  exportAs: 'ngtMeshPhongMaterial',
  providers: [
    { provide: ThreeMaterial, useExisting: MeshPhongMaterialDirective },
  ],
})
export class MeshPhongMaterialDirective extends ThreeMaterial<
  MeshPhongMaterial,
  MeshPhongMaterialParameters
> {
  static ngAcceptInputType_parameters: MeshPhongMaterialParameters | undefined;

  materialType = MeshPhongMaterial;
}
