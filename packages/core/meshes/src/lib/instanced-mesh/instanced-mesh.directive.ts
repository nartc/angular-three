import {
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  NgtCommonMesh,
  NgtObject3d,
} from '@angular-three/core';
import { Directive, Input, OnChanges } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-instanced-mesh',
  exportAs: 'ngtInstancedMesh',
  providers: [
    {
      provide: NgtObject3d,
      useExisting: NgtInstancedMesh,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtInstancedMesh
  extends NgtCommonMesh<THREE.InstancedMesh>
  implements OnChanges
{
  @Input() set args(v: [number]) {
    this.extraArgs = v;
  }

  meshType = THREE.InstancedMesh;

  ngOnChanges() {
    this.init();
    super.ngOnChanges();
  }

  protected canCreate(): boolean {
    return !this.object3d && this.geometry;
  }

  customize = () => {
    this.object3d.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  };
}
