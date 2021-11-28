// GENERATED

import { NgtHelper, NgtObject3d, NGT_OBJECT_3D_CONTROLLER_PROVIDER } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import { RectAreaLightHelper  } from 'three/examples/jsm/helpers/RectAreaLightHelper';

@Directive({
  selector: 'ngt-rect-area-light-helper',
  exportAs: 'ngtRectAreaLightHelper',
  providers: [
    {
      provide: NgtHelper,
      useExisting: NgtRectAreaLightHelper,
    },
    {
      provide: NgtObject3d,
      useExisting: NgtRectAreaLightHelper,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtRectAreaLightHelper extends NgtHelper<RectAreaLightHelper> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof RectAreaLightHelper> | undefined;

  @Input() set args(v: ConstructorParameters<typeof RectAreaLightHelper>) {
    this.extraArgs = v;
  }

  helperType = RectAreaLightHelper;
}

@NgModule({
  declarations: [NgtRectAreaLightHelper],
  exports: [NgtRectAreaLightHelper],
})
export class NgtRectAreaLightHelperModule {}

