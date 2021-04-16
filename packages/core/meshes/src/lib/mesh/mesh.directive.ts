import { ThreeObject3d } from '@angular-three/core';
import { AfterContentInit, Directive } from '@angular/core';
import { Mesh } from 'three';
import { ThreeMesh } from '../abstracts';

@Directive({
  selector: 'ngt-mesh',
  exportAs: 'ngtMesh',
  providers: [{ provide: ThreeObject3d, useExisting: MeshDirective }],
})
export class MeshDirective extends ThreeMesh implements AfterContentInit {
  ngAfterContentInit() {
    this.init();
  }

  meshType = Mesh;
}
