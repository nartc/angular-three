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
  selector: 'ngt-data-array-texture',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNgtCommonTexture(NgtDataArrayTexture),
    provideCommonTextureRef(NgtDataArrayTexture),
  ],
})
export class NgtDataArrayTexture extends NgtCommonTexture<THREE.DataArrayTexture> {
  override get textureType(): AnyConstructor<THREE.DataArrayTexture> {
    return THREE.DataArrayTexture;
  }

  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.DataArrayTexture>
    | undefined;

  @Input() set data(data: BufferSource) {
    this.set({ data });
  }

  @Input() set width(width: NumberInput) {
    this.set({ width: coerceNumberProperty(width) });
  }

  @Input() set height(height: NumberInput) {
    this.set({ height: coerceNumberProperty(height) });
  }

  @Input() set depth(depth: NumberInput) {
    this.set({ depth: coerceNumberProperty(depth) });
  }

  override get optionsFields(): Record<string, boolean> {
    return {
      ...super.optionsFields,
      data: true,
      width: true,
      height: true,
      depth: true,
    };
  }
}
