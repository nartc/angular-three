// GENERATED - AngularThree v7.0.0
import {
  NgtAnyConstructor,
  NgtCommonMaterial,
  provideNgtCommonMaterial,
  provideCommonMaterialRef,
  NgtObservableInput,
  coerceBoolean,
  NgtBooleanInput,
  coerceNumber,
  NgtNumberInput,
} from '@angular-three/core';
import { Component, Input } from '@angular/core';
import { isObservable, map } from 'rxjs';
import * as THREE from 'three';

@Component({
  selector: 'ngt-points-material',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonMaterial(NgtPointsMaterial), provideCommonMaterialRef(NgtPointsMaterial)],
})
export class NgtPointsMaterial extends NgtCommonMaterial<THREE.PointsMaterial> {
  @Input() set color(color: NgtObservableInput<THREE.ColorRepresentation>) {
    this.set({ color });
  }

  @Input() set map(map: NgtObservableInput<THREE.Texture | null>) {
    this.set({ map });
  }

  @Input() set alphaMap(alphaMap: NgtObservableInput<THREE.Texture | null>) {
    this.set({ alphaMap });
  }

  @Input() set size(size: NgtObservableInput<NgtNumberInput>) {
    this.set({ size: isObservable(size) ? size.pipe(map(coerceNumber)) : coerceNumber(size) });
  }

  @Input() set sizeAttenuation(sizeAttenuation: NgtObservableInput<NgtBooleanInput>) {
    this.set({
      sizeAttenuation: isObservable(sizeAttenuation)
        ? sizeAttenuation.pipe(map(coerceBoolean))
        : coerceBoolean(sizeAttenuation),
    });
  }

  @Input() set fog(fog: NgtObservableInput<NgtBooleanInput>) {
    this.set({ fog: isObservable(fog) ? fog.pipe(map(coerceBoolean)) : coerceBoolean(fog) });
  }

  override get materialType(): NgtAnyConstructor<THREE.PointsMaterial> {
    return THREE.PointsMaterial;
  }

  override get optionsFields() {
    return [...super.optionsFields, 'color', 'map', 'alphaMap', 'size', 'sizeAttenuation', 'fog'];
  }
}
