// GENERATED
import {
  AnyConstructor,
  NgtCommonMaterial,
  provideCommonMaterialRef,
  coerceBooleanProperty,
  BooleanInput,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-shadow-material',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonMaterialRef(NgtShadowMaterial)],
})
export class NgtShadowMaterial extends NgtCommonMaterial<THREE.ShadowMaterialParameters, THREE.ShadowMaterial> {
  static ngAcceptInputType_parameters: THREE.ShadowMaterialParameters | undefined;

  @Input() set color(color: THREE.ColorRepresentation) {
    this.set({ color });
  }

  @Input() set fog(fog: BooleanInput) {
    this.set({ fog: coerceBooleanProperty(fog) });
  }

  get materialType(): AnyConstructor<THREE.ShadowMaterial> {
    return THREE.ShadowMaterial;
  }

  protected override get optionFields(): Record<string, boolean> {
    return {
      ...super.optionFields,
      color: true,
      fog: true,
    };
  }
}

@NgModule({
  imports: [NgtShadowMaterial],
  exports: [NgtShadowMaterial],
})
export class NgtShadowMaterialModule {}
