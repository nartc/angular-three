// GENERATED

import { NgtHelper, NgtObject3d, NGT_OBJECT_3D_CONTROLLER_PROVIDER } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { VertexNormalsHelper  } from 'three/examples/jsm/helpers/VertexNormalsHelper';

@Directive({
  selector: 'ngt-vertex-normals-helper',
  exportAs: 'ngtVertexNormalsHelper',
  providers: [
    {
      provide: NgtHelper,
      useExisting: NgtVertexNormalsHelper,
    },
    {
      provide: NgtObject3d,
      useExisting: NgtVertexNormalsHelper,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtVertexNormalsHelper extends NgtHelper<VertexNormalsHelper> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof VertexNormalsHelper> | undefined;

  @Input() set args(v: ConstructorParameters<typeof VertexNormalsHelper>) {
    this.extraArgs = v;
  }

  helperType = VertexNormalsHelper;
}
