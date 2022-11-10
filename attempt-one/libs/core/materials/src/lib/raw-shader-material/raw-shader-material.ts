// GENERATED - AngularThree v7.0.0
import {
  AnyConstructor,
  NgtCommonMaterial,
  provideNgtCommonMaterial,
  provideCommonMaterialRef,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-raw-shader-material',
  standalone: true,
  template: '<ng-content></ng-content>',

  providers: [
    provideNgtCommonMaterial(NgtRawShaderMaterial),
    provideCommonMaterialRef(NgtRawShaderMaterial),
  ],
})
export class NgtRawShaderMaterial extends NgtCommonMaterial<THREE.RawShaderMaterial> {
  override get materialType(): AnyConstructor<THREE.RawShaderMaterial> {
    return THREE.RawShaderMaterial;
  }
}
