// GENERATED
import {
  AnyConstructor,
  NgtCommonMaterial,
  provideNgtCommonMaterial,
  provideCommonMaterialRef,
  coerceNumberProperty,
  NumberInput,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-line-basic-material',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtCommonMaterial(NgtLineBasicMaterial), provideCommonMaterialRef(NgtLineBasicMaterial)],
})
export class NgtLineBasicMaterial<
  TLineBasicMaterial extends THREE.LineBasicMaterial = THREE.LineBasicMaterial
> extends NgtCommonMaterial<THREE.LineBasicMaterial> {
  @Input() set color(color: THREE.ColorRepresentation) {
    this.set({ color });
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

  get materialType(): AnyConstructor<THREE.LineBasicMaterial> {
    return THREE.LineBasicMaterial;
  }

  protected override get optionFields(): Record<string, boolean> {
    return {
      ...super.optionFields,
      color: true,
      linewidth: true,
      linecap: true,
      linejoin: true,
    };
  }
}

@NgModule({
  imports: [NgtLineBasicMaterial],
  exports: [NgtLineBasicMaterial],
})
export class NgtLineBasicMaterialModule {}
