import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-root',
  template: `
    <ngt-canvas>
      <ngt-physics>
        <ngt-ambient-light></ngt-ambient-light>
        <ngt-directional-light></ngt-directional-light>

        <ngt-mesh
          (click)="active = !active"
          (pointerover)="hover = true"
          (pointerout)="hover = false"
          (animateReady)="onAnimateReady($event.animateObject)"
          [scale]="active ? [1.5, 1.5, 1.5] : [1, 1, 1]"
        >
          <ngt-mesh-phong-material
            [parameters]="{ color: hover ? 'hotpink' : 'orange' }"
          ></ngt-mesh-phong-material>
          <ngt-box-geometry></ngt-box-geometry>
        </ngt-mesh>
      </ngt-physics>
    </ngt-canvas>
  `,
  styles: [``],
})
export class AppComponent {
  title = 'docs';

  hover = false;
  active = false;

  onAnimateReady(cube: THREE.Mesh) {
    cube.rotation.x = cube.rotation.y += 0.01;
  }
}
