// GENERATED

import { NgtHelper, NgtObject3d, NGT_OBJECT_3D_CONTROLLER_PROVIDER } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import { VertexTangentsHelper  } from 'three/examples/jsm/helpers/VertexTangentsHelper';

@Directive({
  selector: 'ngt-vertex-tangents-helper',
  exportAs: 'ngtVertexTangentsHelper',
  providers: [
    {
      provide: NgtHelper,
      useExisting: NgtVertexTangentsHelper,
    },
    {
      provide: NgtObject3d,
      useExisting: NgtVertexTangentsHelper,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtVertexTangentsHelper extends NgtHelper<VertexTangentsHelper> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof VertexTangentsHelper> | undefined;

  @Input() set args(v: ConstructorParameters<typeof VertexTangentsHelper>) {
    this.extraArgs = v;
  }

  helperType = VertexTangentsHelper;
}

@NgModule({
  declarations: [NgtVertexTangentsHelper],
  exports: [NgtVertexTangentsHelper],
})
export class NgtVertexTangentsHelperModule {}

