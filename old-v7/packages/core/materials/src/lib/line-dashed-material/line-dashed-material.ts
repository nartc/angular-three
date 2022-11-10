// GENERATED - AngularThree v7.0.0
import {
  NgtAnyConstructor,
  NgtCommonMaterial,
  provideNgtCommonMaterial,
  provideCommonMaterialRef,
  NgtObservableInput,
  coerceNumber,
  NgtNumberInput,
} from '@angular-three/core';
import { Component, Input } from '@angular/core';
import { isObservable, map } from 'rxjs';
import * as THREE from 'three';
import { NgtLineBasicMaterial } from '../line-basic-material/line-basic-material';
@Component({
  selector: 'ngt-line-dashed-material',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonMaterial(NgtLineDashedMaterial), provideCommonMaterialRef(NgtLineDashedMaterial)],
})
export class NgtLineDashedMaterial extends NgtLineBasicMaterial<THREE.LineDashedMaterial> {
  @Input() set scale(scale: NgtObservableInput<NgtNumberInput>) {
    this.set({ scale: isObservable(scale) ? scale.pipe(map(coerceNumber)) : coerceNumber(scale) });
  }

  @Input() set dashSize(dashSize: NgtObservableInput<NgtNumberInput>) {
    this.set({ dashSize: isObservable(dashSize) ? dashSize.pipe(map(coerceNumber)) : coerceNumber(dashSize) });
  }

  @Input() set gapSize(gapSize: NgtObservableInput<NgtNumberInput>) {
    this.set({ gapSize: isObservable(gapSize) ? gapSize.pipe(map(coerceNumber)) : coerceNumber(gapSize) });
  }

  override get materialType(): NgtAnyConstructor<THREE.LineDashedMaterial> {
    return THREE.LineDashedMaterial;
  }

  override get optionsFields() {
    return [...super.optionsFields, 'scale', 'dashSize', 'gapSize'];
  }
}
