// GENERATED - AngularThree v7.0.0
import {
  coerceBoolean,
  coerceNumber,
  NgtAnyConstructor,
  NgtBooleanInput,
  NgtCommonMaterial,
  NgtNumberInput,
  NgtObservableInput,
  provideCommonMaterialRef,
  provideNgtCommonMaterial,
} from '@angular-three/core';
import { Component, Input } from '@angular/core';
import { isObservable, map } from 'rxjs';
import * as THREE from 'three';

@Component({
  selector: 'ngt-line-basic-material',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonMaterial(NgtLineBasicMaterial), provideCommonMaterialRef(NgtLineBasicMaterial)],
})
export class NgtLineBasicMaterial<
  TLineBasicMaterial extends THREE.LineBasicMaterial = THREE.LineBasicMaterial
> extends NgtCommonMaterial<TLineBasicMaterial> {
  @Input() set color(color: NgtObservableInput<THREE.ColorRepresentation>) {
    this.set({ color });
  }

  @Input() set fog(fog: NgtObservableInput<NgtBooleanInput>) {
    this.set({ fog: isObservable(fog) ? fog.pipe(map(coerceBoolean)) : coerceBoolean(fog) });
  }

  @Input() set linewidth(linewidth: NgtObservableInput<NgtNumberInput>) {
    this.set({ linewidth: isObservable(linewidth) ? linewidth.pipe(map(coerceNumber)) : coerceNumber(linewidth) });
  }

  @Input() set linecap(linecap: NgtObservableInput<string>) {
    this.set({ linecap });
  }

  @Input() set linejoin(linejoin: NgtObservableInput<string>) {
    this.set({ linejoin });
  }

  override get materialType(): NgtAnyConstructor<TLineBasicMaterial> {
    return THREE.LineBasicMaterial as NgtAnyConstructor<TLineBasicMaterial>;
  }

  override get optionsFields() {
    return [...super.optionsFields, 'color', 'fog', 'linewidth', 'linecap', 'linejoin'];
  }
}
