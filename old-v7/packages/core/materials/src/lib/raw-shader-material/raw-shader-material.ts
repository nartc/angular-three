// GENERATED - AngularThree v7.0.0
import {
  NgtAnyConstructor,
  NgtCommonMaterial,
  provideNgtCommonMaterial,
  provideCommonMaterialRef,
  NgtObservableInput,
} from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-raw-shader-material',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonMaterial(NgtRawShaderMaterial), provideCommonMaterialRef(NgtRawShaderMaterial)],
})
export class NgtRawShaderMaterial extends NgtCommonMaterial<THREE.RawShaderMaterial> {
  override get materialType(): NgtAnyConstructor<THREE.RawShaderMaterial> {
    return THREE.RawShaderMaterial;
  }
}
