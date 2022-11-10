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
  selector: 'ngt-arrow-helper',
  standalone: true,
  template: '<ng-content></ng-content>',

  providers: [
    provideNgtCommonHelper(NgtArrowHelper),
    provideCommonHelperRef(NgtArrowHelper),
  ],
})
export class NgtArrowHelper extends NgtCommonHelper<THREE.ArrowHelper> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.ArrowHelper>
    | undefined;

  @Input() set dir(dir: THREE.Vector3) {
    this.set({ dir });
  }

  @Input() set origin(origin: THREE.Vector3) {
    this.set({ origin });
  }

  @Input() set length(length: NumberInput) {
    this.set({ length: coerceNumberProperty(length) });
  }

  @Input() set headLength(headLength: NumberInput) {
    this.set({ headLength: coerceNumberProperty(headLength) });
  }

  @Input() set headWidth(headWidth: NumberInput) {
    this.set({ headWidth: coerceNumberProperty(headWidth) });
  }

  override get helperType(): AnyConstructor<THREE.ArrowHelper> {
    return THREE.ArrowHelper;
  }

  override get optionsFields(): Record<string, boolean> {
    return {
      ...super.optionsFields,
      dir: true,
      origin: true,
      length: true,
      headLength: true,
      headWidth: true,
    };
  }
}
