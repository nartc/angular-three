// GENERATED

import { ThreeMaterial } from '@angular-three/core';
import { Directive } from '@angular/core';
import { MeshLambertMaterial, MeshLambertMaterialParameters } from 'three';

@Directive({
  selector: 'ngt-meshLambertMaterial',
  exportAs: 'ngtMeshLambertMaterial',
  providers: [
    { provide: ThreeMaterial, useExisting: MeshLambertMaterialDirective },
  ],
})
export class MeshLambertMaterialDirective extends ThreeMaterial<
  MeshLambertMaterial,
  MeshLambertMaterialParameters
> {
  static ngAcceptInputType_parameters:
    | MeshLambertMaterialParameters
    | undefined;

  materialType = MeshLambertMaterial;
}
