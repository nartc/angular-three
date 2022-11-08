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
  selector: 'ngt-data3-dtexture',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNgtCommonTexture(NgtData3DTexture),
    provideCommonTextureRef(NgtData3DTexture),
  ],
})
export class NgtData3DTexture extends NgtCommonTexture<THREE.Data3DTexture> {
  override get textureType(): AnyConstructor<THREE.Data3DTexture> {
    return THREE.Data3DTexture;
  }

  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.Data3DTexture>
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
      data: false,
      width: false,
      height: false,
      depth: false,
    };
  }
}
