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
  selector: 'ngt-data-texture',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonTexture(NgtDataTexture), provideCommonTextureRef(NgtDataTexture)],
})
export class NgtDataTexture extends NgtCommonTexture<THREE.DataTexture> {
  override get textureType(): NgtAnyConstructor<THREE.DataTexture> {
    return THREE.DataTexture;
  }

  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.DataTexture> | undefined;

  @Input() set data(data: NgtObservableInput<BufferSource | null>) {
    this.set({ data });
  }

  @Input() set width(width: NgtObservableInput<NgtNumberInput>) {
    this.set({ width: isObservable(width) ? width.pipe(map(coerceNumber)) : coerceNumber(width) });
  }

  @Input() set height(height: NgtObservableInput<NgtNumberInput>) {
    this.set({ height: isObservable(height) ? height.pipe(map(coerceNumber)) : coerceNumber(height) });
  }

  @Input() override set format(format: NgtObservableInput<THREE.PixelFormat>) {
    this.set({ format });
  }

  @Input() override set type(type: NgtObservableInput<THREE.TextureDataType>) {
    this.set({ type });
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

  @Input() override set anisotropy(anisotropy: NgtObservableInput<NgtNumberInput>) {
    this.set({ anisotropy: isObservable(anisotropy) ? anisotropy.pipe(map(coerceNumber)) : coerceNumber(anisotropy) });
  }

  @Input() override set encoding(encoding: NgtObservableInput<THREE.TextureEncoding>) {
    this.set({ encoding });
  }

  override get optionsFields() {
    return [
      ...super.optionsFields,
      'data',
      'width',
      'height',
      'format',
      'type',
      'mapping',
      'wrapS',
      'wrapT',
      'magFilter',
      'minFilter',
      'anisotropy',
      'encoding',
    ];
  }
}
