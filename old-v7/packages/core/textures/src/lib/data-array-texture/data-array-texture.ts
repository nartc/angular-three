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
  selector: 'ngt-data-array-texture',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonTexture(NgtDataArrayTexture), provideCommonTextureRef(NgtDataArrayTexture)],
})
export class NgtDataArrayTexture extends NgtCommonTexture<THREE.DataArrayTexture> {
  override get textureType(): NgtAnyConstructor<THREE.DataArrayTexture> {
    return THREE.DataArrayTexture;
  }

  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.DataArrayTexture> | undefined;

  @Input() set data(data: NgtObservableInput<BufferSource>) {
    this.set({ data });
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

  override get optionsFields() {
    return [...super.optionsFields, 'data', 'width', 'height', 'depth'];
  }
}
