// GENERATED - AngularThree v7.0.0
import {
  coerceNumber,
  NgtAnyConstructor,
  NgtCommonHelper,
  NgtNumberInput,
  NgtObservableInput,
  provideCommonHelperRef,
  provideNgtCommonHelper,
} from '@angular-three/core';
import { Component, Input } from '@angular/core';
import { isObservable, map } from 'rxjs';
import * as THREE from 'three';

@Component({
  selector: 'ngt-arrow-helper',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonHelper(NgtArrowHelper), provideCommonHelperRef(NgtArrowHelper)],
})
export class NgtArrowHelper extends NgtCommonHelper<THREE.ArrowHelper> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.ArrowHelper> | undefined;

  @Input() set dir(dir: NgtObservableInput<THREE.Vector3>) {
    this.set({ dir });
  }

  @Input() set origin(origin: NgtObservableInput<THREE.Vector3>) {
    this.set({ origin });
  }

  @Input() set length(length: NgtObservableInput<NgtNumberInput>) {
    this.set({ length: isObservable(length) ? length.pipe(map(coerceNumber)) : coerceNumber(length) });
  }

  @Input() set headLength(headLength: NgtObservableInput<NgtNumberInput>) {
    this.set({ headLength: isObservable(headLength) ? headLength.pipe(map(coerceNumber)) : coerceNumber(headLength) });
  }

  @Input() set headWidth(headWidth: NgtObservableInput<NgtNumberInput>) {
    this.set({ headWidth: isObservable(headWidth) ? headWidth.pipe(map(coerceNumber)) : coerceNumber(headWidth) });
  }

  override get helperType(): NgtAnyConstructor<THREE.ArrowHelper> {
    return THREE.ArrowHelper;
  }

  override get optionsFields() {
    return [...super.optionsFields, 'dir', 'origin', 'length', 'headLength', 'headWidth'];
  }
}
