// GENERATED
import {
  NGT_OBJECT_3D_PROVIDER,
  NgtObjectHelper,
  Tail,
} from '@angular-three/core';
import { Directive, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: '[ngtSkeletonHelper]',
  exportAs: 'ngtSkeletonHelper',
  providers: [
    {
      provide: NgtObjectHelper,
      useExisting: NgtSkeletonHelper,
    },
    NGT_OBJECT_3D_PROVIDER,
  ],
})
export class NgtSkeletonHelper extends NgtObjectHelper<THREE.SkeletonHelper> {
  static ngAcceptInputType_ngtSkeletonHelper:
    | Tail<ConstructorParameters<typeof THREE.SkeletonHelper>>
    | ''
    | undefined;

  @Input() set ngtSkeletonHelper(
    v: Tail<ConstructorParameters<typeof THREE.SkeletonHelper>> | ''
  ) {
    if (v) {
      this.objectHelperArgs = v;
    }
  }

  objectHelperType = THREE.SkeletonHelper;
}

@NgModule({
  declarations: [NgtSkeletonHelper],
  exports: [NgtSkeletonHelper],
})
export class NgtSkeletonHelperModule {}
