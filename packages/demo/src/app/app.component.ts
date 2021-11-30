import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-root',
  template: `
    <ngt-canvas (created)="onCreated($event.scene)">
      <ngt-stats></ngt-stats>

      <ngt-ambient-light></ngt-ambient-light>
      <ngt-spot-light [position]="[1, 1, 1]"></ngt-spot-light>

      <ngt-mesh #mesh="ngtMesh" (animateReady)="onAnimateReady(mesh.mesh)">
        <ngt-mesh-standard-material
          [parameters]="{ color: 'turquoise' }"
        ></ngt-mesh-standard-material>
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

  onCreated(scene: THREE.Scene) {
    console.log(scene);
  }
}
