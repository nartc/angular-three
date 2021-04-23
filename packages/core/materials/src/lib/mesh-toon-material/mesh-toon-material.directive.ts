// GENERATED

import { Directive } from '@angular/core';
import { MeshToonMaterial, MeshToonMaterialParameters } from 'three';
import { ThreeMaterial } from '../abstracts';

@Directive({
  selector: 'ngt-meshToonMaterial',
  exportAs: 'ngtMeshToonMaterial',
  providers: [
    { provide: ThreeMaterial, useExisting: MeshToonMaterialDirective },
  ],
})
export class MeshToonMaterialDirective extends ThreeMaterial<
  MeshToonMaterial,
  MeshToonMaterialParameters
> {
  static ngAcceptInputType_parameters: MeshToonMaterialParameters | undefined;

  materialType = MeshToonMaterial;
}
