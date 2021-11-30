import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-root',
  template: `
    <ngt-canvas>
      <ngt-stats></ngt-stats>

      <ngt-ambient-light></ngt-ambient-light>
      <ngt-spot-light [position]="[1, 1, 1]"></ngt-spot-light>

      <ngt-mesh
        #mesh="ngtMesh"
        (animateReady)="onAnimateReady(mesh.mesh)"
        (pointerover)="hover = true"
        (pointerout)="hover = false"
      >
        <ngt-mesh-standard-material
          [parameters]="{ color: hover ? 'turquoise' : 'tomato' }"
        ></ngt-mesh-standard-material>
        <ngt-box-geometry></ngt-box-geometry>
      </ngt-mesh>

      <ngt-soba-orbit-controls></ngt-soba-orbit-controls>
    </ngt-canvas>
  `,
})
export class AppComponent {
  hover = false;

  onAnimateReady(mesh: THREE.Mesh) {
    mesh.rotation.x = mesh.rotation.y += 0.01;
  }
}
