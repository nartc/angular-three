import {
  AnyConstructor,
  coerceNumberProperty,
  NgtColor,
  NumberInput,
  provideCommonMaterialRef,
  provideNgtCommonMaterial,
} from '@angular-three/core';
import { NgtShaderMaterial } from '@angular-three/core/materials';
import { ImageShaderMaterial } from '@angular-three/soba/shaders';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-soba-image-shader-material',
  standalone: true,
  template: `
    <ng-content></ng-content>
  `,

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

  @Input() set color(color: NgtColor) {
    this.set({ color });
  }

  @Input() set zoom(zoom: NumberInput) {
    this.set({ zoom: coerceNumberProperty(zoom) });
  }

  @Input() set grayscale(grayscale: NumberInput) {
    this.set({ grayscale: coerceNumberProperty(grayscale) });
  }

  override get materialType(): AnyConstructor<
    typeof ImageShaderMaterial.prototype
  > {
    return ImageShaderMaterial;
  }

  override get optionsFields(): Record<string, boolean> {
    return {
      ...super.optionsFields,
      map: false,
      scale: true,
      imageBounds: true,
      color: true,
      zoom: true,
      grayscale: true,
    };
  }
}
