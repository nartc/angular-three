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
  selector: 'ngt-video-texture',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNgtCommonTexture(NgtVideoTexture),
    provideCommonTextureRef(NgtVideoTexture),
  ],
})
export class NgtVideoTexture extends NgtCommonTexture<THREE.VideoTexture> {
  override get textureType(): AnyConstructor<THREE.VideoTexture> {
    return THREE.VideoTexture;
  }

  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.VideoTexture>
    | undefined;

  @Input() set video(video: HTMLVideoElement) {
    this.set({ video });
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

  @Input() override set format(format: THREE.PixelFormat) {
    this.set({ format });
  }

  @Input() override set type(type: THREE.TextureDataType) {
    this.set({ type });
  }

  @Input() override set anisotropy(anisotropy: NumberInput) {
    this.set({ anisotropy: coerceNumberProperty(anisotropy) });
  }

  override get optionsFields(): Record<string, boolean> {
    return {
      ...super.optionsFields,
      video: false,
      mapping: true,
      wrapS: true,
      wrapT: true,
      magFilter: true,
      minFilter: true,
      format: true,
      type: true,
      anisotropy: true,
    };
  }
}
