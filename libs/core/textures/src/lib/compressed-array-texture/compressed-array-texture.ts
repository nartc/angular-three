// GENERATED
import {
  AnyConstructor,
  NgtCommonTexture,
  provideNgtCommonTexture,
  provideCommonTextureRef,
  coerceNumberProperty,
  NumberInput,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-compressed-array-texture',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNgtCommonTexture(NgtCompressedArrayTexture),
    provideCommonTextureRef(NgtCompressedArrayTexture),
  ],
})
export class NgtCompressedArrayTexture extends NgtCommonTexture<THREE.CompressedArrayTexture> {
  override get textureType(): AnyConstructor<THREE.CompressedArrayTexture> {
    return THREE.CompressedArrayTexture;
  }

  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.CompressedArrayTexture>
    | undefined;

  @Input() set mipmaps(mipmaps: ImageData[]) {
    this.set({ mipmaps });
  }

  @Input() set width(width: NumberInput) {
    this.set({ width: coerceNumberProperty(width) });
  }

  @Input() set height(height: NumberInput) {
    this.set({ height: coerceNumberProperty(height) });
  }

  @Input() set depth(depth: NumberInput) {
    this.set({ depth: coerceNumberProperty(depth) });
  }

  @Input() override set format(format: THREE.CompressedPixelFormat) {
    this.set({ format });
  }

  @Input() override set type(type: THREE.TextureDataType) {
    this.set({ type });
  }

  override get optionsFields(): Record<string, boolean> {
    return {
      ...super.optionsFields,
      mipmaps: false,
      width: false,
      height: false,
      depth: false,
      format: true,
      type: true,
    };
  }
}
