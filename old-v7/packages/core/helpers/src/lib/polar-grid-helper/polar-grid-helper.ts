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
  selector: 'ngt-polar-grid-helper',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonHelper(NgtPolarGridHelper), provideCommonHelperRef(NgtPolarGridHelper)],
})
export class NgtPolarGridHelper extends NgtCommonHelper<THREE.PolarGridHelper> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.PolarGridHelper> | undefined;

  @Input() set radius(radius: NgtObservableInput<NgtNumberInput>) {
    this.set({ radius: isObservable(radius) ? radius.pipe(map(coerceNumber)) : coerceNumber(radius) });
  }

  @Input() set radials(radials: NgtObservableInput<NgtNumberInput>) {
    this.set({ radials: isObservable(radials) ? radials.pipe(map(coerceNumber)) : coerceNumber(radials) });
  }

  @Input() set circles(circles: NgtObservableInput<NgtNumberInput>) {
    this.set({ circles: isObservable(circles) ? circles.pipe(map(coerceNumber)) : coerceNumber(circles) });
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

  override get helperType(): NgtAnyConstructor<THREE.PolarGridHelper> {
    return THREE.PolarGridHelper;
  }

  override get optionsFields() {
    return [...super.optionsFields, 'radius', 'radials', 'circles', 'divisions', 'color1', 'color2'];
  }
}
