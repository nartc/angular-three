// GENERATED - AngularThree v7.0.0
import {
  coerceNumber,
  NgtAnyConstructor,
  NgtCommonTexture,
  NgtNumberInput,
  NgtObservableInput,
  provideCommonTextureRef,
  provideNgtCommonTexture,
} from '@angular-three/core';
import { Component, Input } from '@angular/core';
import { isObservable, map } from 'rxjs';
import * as THREE from 'three';

@Component({
  selector: 'ngt-video-texture',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonTexture(NgtVideoTexture), provideCommonTextureRef(NgtVideoTexture)],
})
export class NgtVideoTexture extends NgtCommonTexture<THREE.VideoTexture> {
  override get textureType(): NgtAnyConstructor<THREE.VideoTexture> {
    return THREE.VideoTexture;
  }

  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.VideoTexture> | undefined;

  @Input() set video(video: NgtObservableInput<HTMLVideoElement>) {
    this.set({ video });
  }

  @Input() override set mapping(mapping: NgtObservableInput<THREE.Mapping>) {
    this.set({ mapping });
  }

  @Input() override set wrapS(wrapS: NgtObservableInput<THREE.Wrapping>) {
    this.set({ wrapS });
  }

  @Input() override set wrapT(wrapT: NgtObservableInput<THREE.Wrapping>) {
    this.set({ wrapT });
  }

  @Input() override set magFilter(magFilter: NgtObservableInput<THREE.TextureFilter>) {
    this.set({ magFilter });
  }

  @Input() override set minFilter(minFilter: NgtObservableInput<THREE.TextureFilter>) {
    this.set({ minFilter });
  }

  @Input() override set format(format: NgtObservableInput<THREE.PixelFormat>) {
    this.set({ format });
  }

  @Input() override set type(type: NgtObservableInput<THREE.TextureDataType>) {
    this.set({ type });
  }

  @Input() override set anisotropy(anisotropy: NgtObservableInput<NgtNumberInput>) {
    this.set({ anisotropy: isObservable(anisotropy) ? anisotropy.pipe(map(coerceNumber)) : coerceNumber(anisotropy) });
  }

  override get optionsFields() {
    return [
      ...super.optionsFields,
      'video',
      'mapping',
      'wrapS',
      'wrapT',
      'magFilter',
      'minFilter',
      'format',
      'type',
      'anisotropy',
    ];
  }
}
