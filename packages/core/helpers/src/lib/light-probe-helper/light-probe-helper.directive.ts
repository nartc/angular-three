// GENERATED

import { NgtHelper, NgtObject3d, NGT_OBJECT_3D_CONTROLLER_PROVIDER } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import { LightProbeHelper  } from 'three/examples/jsm/helpers/LightProbeHelper';

@Directive({
  selector: 'ngt-light-probe-helper',
  exportAs: 'ngtLightProbeHelper',
  providers: [
    {
      provide: NgtHelper,
      useExisting: NgtLightProbeHelper,
    },
    {
      provide: NgtObject3d,
      useExisting: NgtLightProbeHelper,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtLightProbeHelper extends NgtHelper<LightProbeHelper> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof LightProbeHelper> | undefined;

  @Input() set args(v: ConstructorParameters<typeof LightProbeHelper>) {
    this.extraArgs = v;
  }

  helperType = LightProbeHelper;
}

@NgModule({
  declarations: [NgtLightProbeHelper],
  exports: [NgtLightProbeHelper],
})
export class NgtLightProbeHelperModule {}

