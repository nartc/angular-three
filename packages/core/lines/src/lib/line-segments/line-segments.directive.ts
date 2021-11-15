// GENERATED

import { NgtCommonLine, NgtObject3d, NGT_OBJECT_3D_CONTROLLER_PROVIDER } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-line-segments',
  exportAs: 'ngtLineSegments',
  providers: [
    {
      provide: NgtObject3d,
      useExisting: NgtLineSegments,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtLineSegments extends NgtCommonLine<THREE.LineSegments> {
  

  lineType = THREE.LineSegments;
}
