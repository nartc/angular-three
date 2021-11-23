// GENERATED
import { NgtMaterial } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import { LineMaterial,LineMaterialParameters  } from 'three/examples/jsm/lines/LineMaterial';

@Directive({
  selector: 'ngt-line-material',
  exportAs: 'ngtLineMaterial',
  providers: [
    {
      provide: NgtMaterial,
      useExisting: NgtLineMaterial,
    }
  ],
})
export class NgtLineMaterial extends NgtMaterial<LineMaterialParameters, LineMaterial> {
  
  static ngAcceptInputType_parameters: LineMaterialParameters | undefined;

  materialType = LineMaterial;
}

@NgModule({
  declarations: [NgtLineMaterial],
  exports: [NgtLineMaterial],
})
export class NgtLineMaterialModule {}

