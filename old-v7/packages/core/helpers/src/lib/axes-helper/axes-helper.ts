// GENERATED - AngularThree v7.0.0
import {
  NgtAnyConstructor,
  NgtCommonHelper,
  provideNgtCommonHelper,
  provideCommonHelperRef,
  NgtObservableInput,
  coerceNumber,
  NgtNumberInput,
} from '@angular-three/core';
import { isObservable, map } from 'rxjs';
import { Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-axes-helper',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonHelper(NgtAxesHelper), provideCommonHelperRef(NgtAxesHelper)],
})
export class NgtAxesHelper extends NgtCommonHelper<THREE.AxesHelper> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.AxesHelper> | undefined;

  @Input() set size(size: NgtObservableInput<NgtNumberInput>) {
    this.set({ size: isObservable(size) ? size.pipe(map(coerceNumber)) : coerceNumber(size) });
  }

  override get helperType(): NgtAnyConstructor<THREE.AxesHelper> {
    return THREE.AxesHelper;
  }

  override get optionsFields() {
    return [...super.optionsFields, 'size'];
  }
}