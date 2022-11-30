// GENERATED - AngularThree v7.0.0
import {
  coerceBoolean,
  NgtAnyConstructor,
  NgtBooleanInput,
  NgtCommonMaterial,
  NgtObservableInput,
  provideCommonMaterialRef,
  provideNgtCommonMaterial,
} from '@angular-three/core';
import { Component, Input } from '@angular/core';
import { isObservable, map } from 'rxjs';
import * as THREE from 'three';

@Component({
  selector: 'ngt-shadow-material',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonMaterial(NgtShadowMaterial), provideCommonMaterialRef(NgtShadowMaterial)],
})
export class NgtShadowMaterial extends NgtCommonMaterial<THREE.ShadowMaterial> {
  @Input() set color(color: NgtObservableInput<THREE.ColorRepresentation>) {
    this.set({ color });
  }

  @Input() set fog(fog: NgtObservableInput<NgtBooleanInput>) {
    this.set({ fog: isObservable(fog) ? fog.pipe(map(coerceBoolean)) : coerceBoolean(fog) });
  }

  override get materialType(): NgtAnyConstructor<THREE.ShadowMaterial> {
    return THREE.ShadowMaterial;
  }

  override get optionsFields() {
    return [...super.optionsFields, 'color', 'fog'];
  }
}
