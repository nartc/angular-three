import { NgtBeforeRender, NgtCanvas } from '@angular-three/core';
import { NgtBoxGeometry } from '@angular-three/core/geometries';
import { NgtMeshBasicMaterial } from '@angular-three/core/materials';
import { NgtMesh } from '@angular-three/core/meshes';
import { Component } from '@angular/core';
import { Mesh } from 'three';

@Component({
  selector: 'sandbox-root',
  standalone: true,
  template: `
    <ngt-canvas>
      <ngt-mesh (beforeRender)="onBeforeRender($event)">
        <ngt-box-geometry></ngt-box-geometry>
        <ngt-mesh-basic-material></ngt-mesh-basic-material>
      </ngt-mesh>
    </ngt-canvas>
  `,
  styles: [],
  imports: [NgtCanvas, NgtMesh, NgtBoxGeometry, NgtMeshBasicMaterial],
})
export class AppComponent {
  title = 'sandbox';

  onBeforeRender({ object }: NgtBeforeRender<Mesh>) {
    object.rotation.x += 0.01;
    object.rotation.y += 0.01;
  }
}
