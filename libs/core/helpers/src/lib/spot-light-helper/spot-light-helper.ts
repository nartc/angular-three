// GENERATED
import { AnyConstructor, NgtCommonObjectHelper, provideCommonObjectHelperRef, Tail } from '@angular-three/core';
import { Directive, Input, NgModule } from '@angular/core';
import * as THREE from 'three/src/Three';

@Directive({
  selector: '[ngtSpotLightHelper]',
  standalone: true,
  exportAs: 'ngtSpotLightHelper',
  providers: [provideCommonObjectHelperRef(NgtSpotLightHelper)],
})
export class NgtSpotLightHelper extends NgtCommonObjectHelper<THREE.SpotLightHelper> {
  static ngAcceptInputType_ngtSpotLightHelper:
    | Tail<ConstructorParameters<typeof THREE.SpotLightHelper>>
    | ''
    | undefined;

  @Input() set ngtSpotLightHelper(v: Tail<ConstructorParameters<typeof THREE.SpotLightHelper>> | '') {
    if (v) {
      this.instanceArgs = v;
    }
  }

  override get objectHelperType(): AnyConstructor<THREE.SpotLightHelper> {
    return THREE.SpotLightHelper;
  }
}

@NgModule({
  imports: [NgtSpotLightHelper],
  exports: [NgtSpotLightHelper],
})
export class NgtSpotLightHelperModule {}
