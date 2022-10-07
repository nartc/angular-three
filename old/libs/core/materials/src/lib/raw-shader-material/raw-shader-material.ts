// GENERATED
import {
  AnyConstructor,
  NgtCommonMaterial,
  provideNgtCommonMaterial,
  provideCommonMaterialRef,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-raw-shader-material',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtCommonMaterial(NgtRawShaderMaterial), provideCommonMaterialRef(NgtRawShaderMaterial)],
})
export class NgtRawShaderMaterial extends NgtCommonMaterial<THREE.RawShaderMaterial> {
  get materialType(): AnyConstructor<THREE.RawShaderMaterial> {
    return THREE.RawShaderMaterial;
  }
}

@NgModule({
  imports: [NgtRawShaderMaterial],
  exports: [NgtRawShaderMaterial],
})
export class NgtRawShaderMaterialModule {}
