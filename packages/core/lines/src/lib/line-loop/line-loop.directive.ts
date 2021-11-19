// GENERATED

import { NgtCommonLine, NgtObject3d, NGT_OBJECT_3D_CONTROLLER_PROVIDER } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-line-loop',
  exportAs: 'ngtLineLoop',
  providers: [
    {
      provide: NgtCommonLine,
      useExisting: NgtLineLoop,
    },
    {
      provide: NgtObject3d,
      useExisting: NgtLineLoop,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtLineLoop extends NgtCommonLine<THREE.LineLoop> {
  

  lineType = THREE.LineLoop;
}
