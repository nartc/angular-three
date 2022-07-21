import { AnyConstructor, provideCommonMaterialRef } from '@angular-three/core';
import { NgtShaderMaterial } from '@angular-three/core/materials';
import { SpotLightMaterial } from '@angular-three/soba/materials';
import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'ngt-soba-spot-light-material',
  standalone: true,
  template: `<ng-content></ng-content>`,
  providers: [provideCommonMaterialRef(NgtSobaSpotLightMaterial)],
})
export class NgtSobaSpotLightMaterial extends NgtShaderMaterial {
  override get materialType(): AnyConstructor<SpotLightMaterial> {
    return SpotLightMaterial;
  }
}

@NgModule({
  imports: [NgtSobaSpotLightMaterial],
  exports: [NgtSobaSpotLightMaterial],
})
export class NgtSobaSpotLightMaterialModule {}
