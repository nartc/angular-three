// GENERATED
import { AnyConstructor, NgtCommonLight, provideNgtCommonLight, provideCommonLightRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-hemisphere-light-probe',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtCommonLight(NgtHemisphereLightProbe), provideCommonLightRef(NgtHemisphereLightProbe)],
})
export class NgtHemisphereLightProbe extends NgtCommonLight<THREE.HemisphereLightProbe> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.HemisphereLightProbe> | undefined;

  @Input() set skyColor(skyColor: THREE.ColorRepresentation) {
    this.set({ skyColor });
  }

  @Input() set groundColor(groundColor: THREE.ColorRepresentation) {
    this.set({ groundColor });
  }

  override get lightType(): AnyConstructor<THREE.HemisphereLightProbe> {
    return THREE.HemisphereLightProbe;
  }

  protected override get optionFields(): Record<string, boolean> {
    return {
      ...super.optionFields,
      skyColor: true,
      groundColor: true,
    };
  }
}

@NgModule({
  imports: [NgtHemisphereLightProbe],
  exports: [NgtHemisphereLightProbe],
})
export class NgtHemisphereLightProbeModule {}
