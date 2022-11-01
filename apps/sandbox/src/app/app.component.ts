import { NgtBeforeRender, NgtCanvas } from '@angular-three/core';
import { NgtColorAttribute } from '@angular-three/core/attributes';
import { NgtBoxGeometry } from '@angular-three/core/geometries';
import { NgtBoxHelper } from '@angular-three/core/helpers';
import { NgtMeshBasicMaterial } from '@angular-three/core/materials';
import { NgtMesh } from '@angular-three/core/meshes';
import { Component } from '@angular/core';
import { Mesh } from 'three';

@Component({
  selector: 'sandbox-root',
  standalone: true,
  template: `
    <ngt-canvas>
      <ngt-color attach="background" color="lightblue"></ngt-color>

      <ngt-mesh ngtBoxHelper (beforeRender)="onBeforeRender($event)">
        <ngt-box-geometry></ngt-box-geometry>
        <ngt-mesh-basic-material></ngt-mesh-basic-material>
      </ngt-mesh>
    </ngt-canvas>
  `,
  imports: [
    NgtCanvas,
    NgtMesh,
    NgtBoxGeometry,
    NgtMeshBasicMaterial,
    NgtColorAttribute,
    NgtBoxHelper,
  ],
})
export class AppComponent {
  onBeforeRender({ object }: NgtBeforeRender<Mesh>) {
    object.rotation.x += 0.01;
    object.rotation.y += 0.01;
  }
}
