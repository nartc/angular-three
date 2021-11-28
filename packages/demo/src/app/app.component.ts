import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-root',
  template: `
    <ngt-canvas>
      <ngt-stats></ngt-stats>
      <ngt-mesh #mesh="ngtMesh" (animateReady)="onAnimateReady(mesh.mesh)">
        <ngt-mesh-basic-material
          [parameters]="{ color: 'turquoise' }"
        ></ngt-mesh-basic-material>
        <ngt-box-geometry></ngt-box-geometry>
      </ngt-mesh>
    </ngt-canvas>
  `,
})
export class AppComponent {
  title = 'demo';

  onAnimateReady(mesh: THREE.Mesh) {
    mesh.rotation.x = mesh.rotation.y += 0.01;
  }
}
