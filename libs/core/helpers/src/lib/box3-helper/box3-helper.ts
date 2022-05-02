// GENERATED
import { AnyConstructor, NgtCommonObjectHelper, provideCommonObjectHelperRef, Tail } from '@angular-three/core';
import { Directive, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: '[ngtBox3Helper]',
  exportAs: 'ngtBox3Helper',
  providers: [provideCommonObjectHelperRef(NgtBox3Helper)],
})
export class NgtBox3Helper extends NgtCommonObjectHelper<THREE.Box3Helper> {
  static ngAcceptInputType_ngtBox3Helper: Tail<ConstructorParameters<typeof THREE.Box3Helper>> | '' | undefined;

  @Input() set ngtBox3Helper(v: Tail<ConstructorParameters<typeof THREE.Box3Helper>> | '') {
    if (v) {
      this.instanceArgs = v;
    }
  }

  override get objectHelperType(): AnyConstructor<THREE.Box3Helper> {
    return THREE.Box3Helper;
  }
}

@NgModule({
  declarations: [NgtBox3Helper],
  exports: [NgtBox3Helper],
})
export class NgtBox3HelperModule {}
