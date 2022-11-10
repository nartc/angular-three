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
  selector: 'ngt-framebuffer-texture',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonTexture(NgtFramebufferTexture), provideCommonTextureRef(NgtFramebufferTexture)],
})
export class NgtFramebufferTexture extends NgtCommonTexture<THREE.FramebufferTexture> {
  override get textureType(): NgtAnyConstructor<THREE.FramebufferTexture> {
    return THREE.FramebufferTexture;
  }

  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.FramebufferTexture> | undefined;

  @Input() set width(width: NgtObservableInput<NgtNumberInput>) {
    this.set({ width: isObservable(width) ? width.pipe(map(coerceNumber)) : coerceNumber(width) });
  }

  @Input() set height(height: NgtObservableInput<NgtNumberInput>) {
    this.set({ height: isObservable(height) ? height.pipe(map(coerceNumber)) : coerceNumber(height) });
  }

  @Input() override set format(format: NgtObservableInput<THREE.PixelFormat>) {
    this.set({ format });
  }

  override get optionsFields() {
    return [...super.optionsFields, 'width', 'height', 'format'];
  }
}
