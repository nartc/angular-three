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
  selector: 'ngt-compressed-array-texture',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonTexture(NgtCompressedArrayTexture), provideCommonTextureRef(NgtCompressedArrayTexture)],
})
export class NgtCompressedArrayTexture extends NgtCommonTexture<THREE.CompressedArrayTexture> {
  override get textureType(): NgtAnyConstructor<THREE.CompressedArrayTexture> {
    return THREE.CompressedArrayTexture;
  }

  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.CompressedArrayTexture> | undefined;

  @Input() set mipmaps(mipmaps: NgtObservableInput<ImageData[]>) {
    this.set({ mipmaps });
  }

  @Input() set width(width: NgtObservableInput<NgtNumberInput>) {
    this.set({ width: isObservable(width) ? width.pipe(map(coerceNumber)) : coerceNumber(width) });
  }

  @Input() set height(height: NgtObservableInput<NgtNumberInput>) {
    this.set({ height: isObservable(height) ? height.pipe(map(coerceNumber)) : coerceNumber(height) });
  }

  @Input() set depth(depth: NgtObservableInput<NgtNumberInput>) {
    this.set({ depth: isObservable(depth) ? depth.pipe(map(coerceNumber)) : coerceNumber(depth) });
  }

  @Input() override set format(format: NgtObservableInput<THREE.CompressedPixelFormat>) {
    this.set({ format });
  }

  @Input() override set type(type: NgtObservableInput<THREE.TextureDataType>) {
    this.set({ type });
  }

  override get optionsFields() {
    return [...super.optionsFields, 'mipmaps', 'width', 'height', 'depth', 'format', 'type'];
  }
}
