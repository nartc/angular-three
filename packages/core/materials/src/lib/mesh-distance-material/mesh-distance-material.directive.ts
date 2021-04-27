// GENERATED

import { ThreeMaterial } from '@angular-three/core';
import { Directive } from '@angular/core';
import { MeshDistanceMaterial, MeshDistanceMaterialParameters } from 'three';

@Directive({
  selector: 'ngt-mesh-distance-material',
  exportAs: 'ngtMeshDistanceMaterial',
  providers: [
    { provide: ThreeMaterial, useExisting: MeshDistanceMaterialDirective },
  ],
})
export class MeshDistanceMaterialDirective extends ThreeMaterial<
  MeshDistanceMaterial,
  MeshDistanceMaterialParameters
> {
  static ngAcceptInputType_parameters:
    | MeshDistanceMaterialParameters
    | undefined;

  materialType = MeshDistanceMaterial;
}
