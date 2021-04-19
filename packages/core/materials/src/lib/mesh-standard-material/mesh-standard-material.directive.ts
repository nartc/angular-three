import { Directive } from '@angular/core';
import { MeshStandardMaterial, MeshStandardMaterialParameters } from 'three';
import { ThreeMaterial } from '../abstracts';

@Directive({
  selector: 'ngt-meshStandardMaterial',
  exportAs: 'ngtMeshStandardMaterial',
  providers: [
    { provide: ThreeMaterial, useExisting: MeshStandardMaterialDirective },
  ],
})
export class MeshStandardMaterialDirective extends ThreeMaterial<
  MeshStandardMaterial,
  MeshStandardMaterialParameters
> {
  static ngAcceptInputType_parameters:
    | MeshStandardMaterialParameters
    | undefined;

  materialType = MeshStandardMaterial;
}
