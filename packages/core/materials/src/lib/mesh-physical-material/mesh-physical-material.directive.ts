// GENERATED

import { Directive } from '@angular/core';
import { MeshPhysicalMaterial, MeshPhysicalMaterialParameters } from 'three';
import { ThreeMaterial } from '../abstracts';

@Directive({
  selector: 'ngt-meshPhysicalMaterial',
  exportAs: 'ngtMeshPhysicalMaterial',
  providers: [
    { provide: ThreeMaterial, useExisting: MeshPhysicalMaterialDirective },
  ],
})
export class MeshPhysicalMaterialDirective extends ThreeMaterial<
  MeshPhysicalMaterial,
  MeshPhysicalMaterialParameters
> {
  static ngAcceptInputType_parameters: MeshPhysicalMaterialParameters | undefined;

  materialType = MeshPhysicalMaterial;
}
