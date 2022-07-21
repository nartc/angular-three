// GENERATED
import {
  AnyConstructor,
  coerceNumberProperty,
  NgtCommonTexture,
  NumberInput,
  provideCommonTextureRef,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import * as THREE from 'three/src/Three';

@Component({
  selector: 'ngt-compressed-texture',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonTextureRef(NgtCompressedTexture)],
})
export class NgtCompressedTexture extends NgtCommonTexture<THREE.CompressedTexture> {
  override get textureType(): AnyConstructor<THREE.CompressedTexture> {
    return THREE.CompressedTexture;
  }

  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.CompressedTexture> | undefined;

  @Input() set mipmaps(mipmaps: ImageData[]) {
    this.set({ mipmaps });
  }

  @Input() set width(width: NumberInput) {
    this.set({ width: coerceNumberProperty(width) });
  }

  @Input() set height(height: NumberInput) {
    this.set({ height: coerceNumberProperty(height) });
  }

  @Input() override set format(format: THREE.CompressedPixelFormat) {
    this.set({ format });
  }

  @Input() override set type(type: THREE.TextureDataType) {
    this.set({ type });
  }

  @Input() override set mapping(mapping: THREE.Mapping) {
    this.set({ mapping });
  }

  @Input() override set wrapS(wrapS: THREE.Wrapping) {
    this.set({ wrapS });
  }

  @Input() override set wrapT(wrapT: THREE.Wrapping) {
    this.set({ wrapT });
  }

  @Input() override set magFilter(magFilter: THREE.TextureFilter) {
    this.set({ magFilter });
  }

  @Input() override set minFilter(minFilter: THREE.TextureFilter) {
    this.set({ minFilter });
  }

  @Input() override set anisotropy(anisotropy: NumberInput) {
    this.set({ anisotropy: coerceNumberProperty(anisotropy) });
  }

  @Input() override set encoding(encoding: THREE.TextureEncoding) {
    this.set({ encoding });
  }

  protected override get optionFields(): Record<string, boolean> {
    return {
      ...super.optionFields,
      mipmaps: false,
      width: false,
      height: false,
      format: true,
      type: true,
      mapping: true,
      wrapS: true,
      wrapT: true,
      magFilter: true,
      minFilter: true,
      anisotropy: true,
      encoding: true,
    };
  }
}

@NgModule({
  declarations: [NgtCompressedTexture],
  exports: [NgtCompressedTexture],
})
export class NgtCompressedTextureModule {}
