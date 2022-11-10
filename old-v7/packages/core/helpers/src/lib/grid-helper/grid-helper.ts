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
  selector: 'ngt-grid-helper',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonHelper(NgtGridHelper), provideCommonHelperRef(NgtGridHelper)],
})
export class NgtGridHelper extends NgtCommonHelper<THREE.GridHelper> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.GridHelper> | undefined;

  @Input() set size(size: NgtObservableInput<NgtNumberInput>) {
    this.set({ size: isObservable(size) ? size.pipe(map(coerceNumber)) : coerceNumber(size) });
  }

  @Input() set divisions(divisions: NgtObservableInput<NgtNumberInput>) {
    this.set({ divisions: isObservable(divisions) ? divisions.pipe(map(coerceNumber)) : coerceNumber(divisions) });
  }

  @Input() set color1(color1: NgtObservableInput<THREE.ColorRepresentation>) {
    this.set({ color1 });
  }

  @Input() set color2(color2: NgtObservableInput<THREE.ColorRepresentation>) {
    this.set({ color2 });
  }

  override get helperType(): NgtAnyConstructor<THREE.GridHelper> {
    return THREE.GridHelper;
  }

  override get optionsFields() {
    return [...super.optionsFields, 'size', 'divisions', 'color1', 'color2'];
  }
}
