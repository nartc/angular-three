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
  selector: 'ngt-framebuffer-texture',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNgtCommonTexture(NgtFramebufferTexture),
    provideCommonTextureRef(NgtFramebufferTexture),
  ],
})
export class NgtFramebufferTexture extends NgtCommonTexture<THREE.FramebufferTexture> {
  override get textureType(): AnyConstructor<THREE.FramebufferTexture> {
    return THREE.FramebufferTexture;
  }

  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.FramebufferTexture>
    | undefined;

  @Input() set width(width: NumberInput) {
    this.set({ width: coerceNumberProperty(width) });
  }

  @Input() set height(height: NumberInput) {
    this.set({ height: coerceNumberProperty(height) });
  }

  @Input() override set format(format: THREE.PixelFormat) {
    this.set({ format });
  }

  protected override get optionsFields(): Record<string, boolean> {
    return {
      ...super.optionsFields,
      width: false,
      height: false,
      format: false,
    };
  }
}
