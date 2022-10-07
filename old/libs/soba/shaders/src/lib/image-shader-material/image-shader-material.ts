import {
  AnyConstructor,
  coerceNumberProperty,
  NgtColor,
  NumberInput,
  provideCommonMaterialRef,
  provideNgtCommonMaterial,
} from '@angular-three/core';
import { NgtShaderMaterial } from '@angular-three/core/materials';
import { ImageShaderMaterial } from '@angular-three/soba/materials';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

export type NgtSobaImageShaderMaterialParameters = THREE.ShaderMaterialParameters & {
  map: THREE.Texture;
  scale?: number[];
  imageBounds?: number[];
  color?: NgtColor;
  zoom?: number;
  grayscale?: number;
};

@Component({
  selector: 'ngt-soba-image-shader-material',
  standalone: true,
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  override get materialType(): AnyConstructor<typeof ImageShaderMaterial.prototype> {
    return ImageShaderMaterial;
  }

  protected override get optionFields(): Record<string, boolean> {
    return {
      ...super.optionFields,
      map: false,
      scale: true,
      imageBounds: true,
      color: true,
      zoom: true,
      grayscale: true,
    };
  }
}

@NgModule({
  imports: [NgtSobaImageShaderMaterial],
  exports: [NgtSobaImageShaderMaterial],
})
export class NgtSobaImageShaderMaterialModule {}
