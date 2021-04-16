import { ThreeObject3d } from '@angular-three/core';
import { Directive, Input, OnChanges } from '@angular/core';
import { DynamicDrawUsage, InstancedMesh } from 'three';
import { ThreeMesh } from '../abstracts';

@Directive({
  selector: 'ngt-instancedMesh',
  exportAs: 'ngtInstancedMesh',
  providers: [{ provide: ThreeObject3d, useExisting: InstancedMeshDirective }],
})
export class InstancedMeshDirective
  extends ThreeMesh<InstancedMesh>
  implements OnChanges {
  @Input() set args(v: [number]) {
    this.extraArgs = v;
  }

  meshType = InstancedMesh;

  ngOnChanges() {
    this.init();
    super.ngOnChanges();
  }

  protected canCreate(): boolean {
    return !this.object3d && this.geometry;
  }

  customize = () => {
    this.object3d.instanceMatrix.setUsage(DynamicDrawUsage);
  };
}
