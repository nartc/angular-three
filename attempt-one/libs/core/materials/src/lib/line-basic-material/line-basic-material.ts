// GENERATED - AngularThree v7.0.0
import {
  AnyConstructor,
  NgtCommonMaterial,
  provideNgtCommonMaterial,
  provideCommonMaterialRef,
  coerceBooleanProperty,
  BooleanInput,
  coerceNumberProperty,
  NumberInput,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-line-basic-material',
  standalone: true,
  template: '<ng-content></ng-content>',

  providers: [
    provideNgtCommonMaterial(NgtLineBasicMaterial),
    provideCommonMaterialRef(NgtLineBasicMaterial),
  ],
})
export class NgtLineBasicMaterial<
  TLineBasicMaterial extends THREE.LineBasicMaterial = THREE.LineBasicMaterial
> extends NgtCommonMaterial<TLineBasicMaterial> {
  @Input() set color(color: THREE.ColorRepresentation) {
    this.set({ color });
  }

  @Input() set fog(fog: BooleanInput) {
    this.set({ fog: coerceBooleanProperty(fog) });
  }

  @Input() set linewidth(linewidth: NumberInput) {
    this.set({ linewidth: coerceNumberProperty(linewidth) });
  }

  @Input() set linecap(linecap: string) {
    this.set({ linecap });
  }

  @Input() set linejoin(linejoin: string) {
    this.set({ linejoin });
  }

  override get materialType(): AnyConstructor<TLineBasicMaterial> {
    return THREE.LineBasicMaterial as AnyConstructor<TLineBasicMaterial>;
  }

  override get optionsFields(): Record<string, boolean> {
    return {
      ...super.optionsFields,
      color: true,
      fog: true,
      linewidth: true,
      linecap: true,
      linejoin: true,
    };
  }
}
