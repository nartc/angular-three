// GENERATED - AngularThree v7.0.0
import {
  NgtAnyConstructor,
  NgtCommonTexture,
  provideNgtCommonTexture,
  provideCommonTextureRef,
  NgtObservableInput,
  coerceNumber,
  NgtNumberInput,
} from '@angular-three/core';
import { isObservable, map } from 'rxjs';
import { Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-canvas-texture',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonTexture(NgtCanvasTexture), provideCommonTextureRef(NgtCanvasTexture)],
})
export class NgtCanvasTexture extends NgtCommonTexture<THREE.CanvasTexture> {
  override get textureType(): NgtAnyConstructor<THREE.CanvasTexture> {
    return THREE.CanvasTexture;
  }

  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.CanvasTexture> | undefined;

  @Input() set canvas(canvas: NgtObservableInput<TexImageSource | THREE.OffscreenCanvas>) {
    this.set({ canvas });
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
      'canvas',
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
