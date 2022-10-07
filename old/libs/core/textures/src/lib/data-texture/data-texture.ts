// GENERATED
import {
  AnyConstructor,
  NgtCommonTexture,
  provideNgtCommonTexture,
  provideCommonTextureRef,
  coerceNumberProperty,
  NumberInput,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-data-texture',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtCommonTexture(NgtDataTexture), provideCommonTextureRef(NgtDataTexture)],
})
export class NgtDataTexture extends NgtCommonTexture<THREE.DataTexture> {
  override get textureType(): AnyConstructor<THREE.DataTexture> {
    return THREE.DataTexture;
  }

  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.DataTexture> | undefined;

  @Input() set data(data: BufferSource | null) {
    this.set({ data });
  }

  @Input() set width(width: NumberInput) {
    this.set({ width: coerceNumberProperty(width) });
  }

  @Input() set height(height: NumberInput) {
    this.set({ height: coerceNumberProperty(height) });
  }

  @Input() override set format(format: THREE.PixelFormat) {
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
      data: true,
      width: true,
      height: true,
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
  imports: [NgtDataTexture],
  exports: [NgtDataTexture],
})
export class NgtDataTextureModule {}
