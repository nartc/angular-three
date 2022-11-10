import {
  coerceNumber,
  NgtInstance,
  NgtNumberInput,
  NgtObservableInput,
  NgtPrepareInstanceFn,
  NgtVector3,
  skipFirstUndefined,
} from '@angular-three/core';
import { NgtValueAttribute } from '@angular-three/core/attributes';
import { NgtObjectPrimitive } from '@angular-three/core/primitives';
import { Component, Input } from '@angular/core';
import { isObservable, map } from 'rxjs';
import * as THREE from 'three';
import { Sky } from 'three-stdlib';

function calcPosFromAngles(inclination: number, azimuth: number, vector: THREE.Vector3 = new THREE.Vector3()) {
  const theta = Math.PI * (inclination - 0.5);
  const phi = 2 * Math.PI * (azimuth - 0.5);

  vector.x = Math.cos(phi);
  vector.y = Math.sin(theta);
  vector.z = Math.sin(phi);

  return vector;
}

@Component({
  selector: 'ngt-soba-sky',
  standalone: true,
  template: `
    <ngt-object-primitive [object]="instanceRef" [scale]="scale$">
      <ngt-value
        [attach]="['material', 'uniforms', 'mieCoefficient', 'value']"
        [value]="read('mieCoefficient')"
      ></ngt-value>
      <ngt-value
        [attach]="['material', 'uniforms', 'mieDirectionalG', 'value']"
        [value]="read('mieDirectionalG')"
      ></ngt-value>
      <ngt-value [attach]="['material', 'uniforms', 'rayleigh', 'value']" [value]="read('rayleigh')"></ngt-value>
      <ngt-value [attach]="['material', 'uniforms', 'sunPosition', 'value']" [value]="read('sunPosition')"></ngt-value>
      <ngt-value [attach]="['material', 'uniforms', 'turbidity', 'value']" [value]="read('turbidity')"></ngt-value>
    </ngt-object-primitive>
  `,
  imports: [NgtObjectPrimitive, NgtValueAttribute],
})
export class NgtSobaSky extends NgtInstance<Sky> {
  @Input() set distance(distance: NgtObservableInput<NgtNumberInput>) {
    this.set({ distance: isObservable(distance) ? distance.pipe(map(coerceNumber)) : coerceNumber(distance) });
  }

  @Input() set sunPosition(sunPosition: NgtObservableInput<NgtVector3>) {
    this.set({ sunPosition });
  }

  @Input() set inclination(inclination: NgtObservableInput<NgtNumberInput>) {
    this.set({
      inclination: isObservable(inclination) ? inclination.pipe(map(coerceNumber)) : coerceNumber(inclination),
    });
  }

  @Input() set azimuth(azimuth: NgtObservableInput<NgtNumberInput>) {
    this.set({ azimuth: isObservable(azimuth) ? azimuth.pipe(map(coerceNumber)) : coerceNumber(azimuth) });
  }

  @Input() set mieCoefficient(mieCoefficient: NgtObservableInput<NgtNumberInput>) {
    this.set({
      mieCoefficient: isObservable(mieCoefficient)
        ? mieCoefficient.pipe(map(coerceNumber))
        : coerceNumber(mieCoefficient),
    });
  }

  @Input() set mieDirectionalG(mieDirectionalG: NgtObservableInput<NgtNumberInput>) {
    this.set({
      mieDirectionalG: isObservable(mieDirectionalG)
        ? mieDirectionalG.pipe(map(coerceNumber))
        : coerceNumber(mieDirectionalG),
    });
  }

  @Input() set rayleigh(rayleigh: NgtObservableInput<NgtNumberInput>) {
    this.set({ rayleigh: isObservable(rayleigh) ? rayleigh.pipe(map(coerceNumber)) : coerceNumber(rayleigh) });
  }

  @Input() set turbidity(turbidity: NgtObservableInput<NgtNumberInput>) {
    this.set({ turbidity: isObservable(turbidity) ? turbidity.pipe(map(coerceNumber)) : coerceNumber(turbidity) });
  }

  readonly scale$ = this.select(
    this.select((s) => s['distance']).pipe(skipFirstUndefined()),
    (distance) => new THREE.Vector3().setScalar(distance),
    { debounce: true }
  );

  override initialize() {
    super.initialize();
    this.set({
      inclination: 0.6,
      azimuth: 0.1,
      distance: 1000,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.8,
      rayleigh: 0.5,
      turbidity: 10,
      sunPosition: calcPosFromAngles(0.6, 0.1),
    });
  }

  override initFn(prepareInstance: NgtPrepareInstanceFn<Sky>): (() => void) | void | undefined {
    prepareInstance(new Sky());
  }
}
