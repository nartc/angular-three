// GENERATED
import {
  AnyConstructor,
  NgtCommonHelper,
  provideNgtCommonHelper,
  provideCommonHelperRef,
  coerceNumberProperty,
  NumberInput,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-axes-helper',
  standalone: true,
  template: '<ng-content></ng-content>',

  providers: [
    provideNgtCommonHelper(NgtAxesHelper),
    provideCommonHelperRef(NgtAxesHelper),
  ],
})
export class NgtAxesHelper extends NgtCommonHelper<THREE.AxesHelper> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.AxesHelper>
    | undefined;

  @Input() set size(size: NumberInput) {
    this.set({ size: coerceNumberProperty(size) });
  }

  override get helperType(): AnyConstructor<THREE.AxesHelper> {
    return THREE.AxesHelper;
  }

  override get optionsFields(): Record<string, boolean> {
    return {
      ...super.optionsFields,
      size: true,
    };
  }
}
