import { Directive } from '@angular/core';
import { MeshNormalMaterial, MeshNormalMaterialParameters } from 'three';
import { ThreeMaterial } from '../abstracts';

@Directive({
  selector: 'ngt-meshNormalMaterial',
  exportAs: 'ngtMeshNormalMaterial',
  providers: [
    { provide: ThreeMaterial, useExisting: MeshNormalMaterialDirective },
  ],
})
export class MeshNormalMaterialDirective extends ThreeMaterial<
  MeshNormalMaterial,
  MeshNormalMaterialParameters
> {
  static ngAcceptInputType_parameters: MeshNormalMaterialParameters;

  init(): MeshNormalMaterial {
    return new MeshNormalMaterial(this.parameters);
  }
}
