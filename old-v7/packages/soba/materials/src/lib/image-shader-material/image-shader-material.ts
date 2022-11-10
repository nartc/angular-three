import {
  coerceNumber,
  NgtAnyConstructor,
  NgtColor,
  NgtNumberInput,
  NgtObservableInput,
  provideCommonMaterialRef,
  provideNgtCommonMaterial,
} from '@angular-three/core';
import { NgtShaderMaterial } from '@angular-three/core/materials';
import { ImageShaderMaterial } from '@angular-three/soba/shaders';
import { Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-soba-image-shader-material',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [
    provideNgtCommonMaterial(NgtSobaImageShaderMaterial),
    provideCommonMaterialRef(NgtSobaImageShaderMaterial),
  ],
})
export class NgtSobaImageShaderMaterial extends NgtShaderMaterial {
  @Input() set map(map: THREE.Texture) {
    this.set({ map });
  }

  @Input() set scale(scale: number[]) {
    this.set({ scale });
  }

  @Input() set imageBounds(imageBounds: number[]) {
    this.set({ imageBounds });
  }

  @Input() set color(color: NgtObservableInput<NgtColor>) {
    this.set({ color });
  }

  @Input() set zoom(zoom: NgtNumberInput) {
    this.set({ zoom: coerceNumber(zoom) });
  }

  @Input() set grayscale(grayscale: NgtNumberInput) {
    this.set({ grayscale: coerceNumber(grayscale) });
  }

  override get materialType(): NgtAnyConstructor<typeof ImageShaderMaterial.prototype> {
    return ImageShaderMaterial;
  }

  override get optionsFields() {
    return [...super.optionsFields, 'map', 'scale', 'imageBounds', 'color', 'zoom', 'grayscale'];
  }
}
