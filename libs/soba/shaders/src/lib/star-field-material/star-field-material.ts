import { AnyConstructor, provideCommonMaterialRef } from '@angular-three/core';
import { NgtShaderMaterial } from '@angular-three/core/materials';
import { StarFieldMaterial } from '@angular-three/soba/materials';
import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'ngt-soba-star-field-material',
  template: `<ng-content></ng-content>`,
  providers: [provideCommonMaterialRef(NgtSobaStarFieldMaterial)],
})
export class NgtSobaStarFieldMaterial extends NgtShaderMaterial {
  override get materialType(): AnyConstructor<StarFieldMaterial> {
    return StarFieldMaterial;
  }
}

@NgModule({
  declarations: [NgtSobaStarFieldMaterial],
  exports: [NgtSobaStarFieldMaterial],
})
export class NgtSobaStarFieldMaterialModule {}
