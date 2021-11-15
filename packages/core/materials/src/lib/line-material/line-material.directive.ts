// GENERATED
import { NgtMaterial } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { LineMaterial,LineMaterialParameters  } from 'three/examples/jsm/lines/LineMaterial';

@Directive({
  selector: 'ngt-line-material',
  exportAs: 'ngtLineMaterial',
  providers: [
    {
      provide: NgtMaterial,
      useExisting: NgtLineMaterial,
    },
  ],
})
export class NgtLineMaterial extends NgtMaterial<LineMaterial, LineMaterialParameters> {
  
  static ngAcceptInputType_parameters: LineMaterialParameters | undefined;

  materialType = LineMaterial;
}
