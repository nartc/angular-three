import { ChangeDetectionStrategy, Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'demo-html',
  template: `
    <ngt-canvas [camera]="{ position: [-20, 20, -20], fov: 75 }">
      <ngt-orbit-controls></ngt-orbit-controls>

      <ngt-mesh-basic-material
        ngtId="icosahedronMaterial"
        [parameters]="{ color: 'hotpink', wireframe: true }"
      ></ngt-mesh-basic-material>
      <ngt-icosahedron-geometry
        ngtId="icosahedron"
        [args]="[2, 2]"
      ></ngt-icosahedron-geometry>

      <ngt-group o3d (animateReady)="animate($event.animateObject)">
        <ngt-mesh
          o3d
          material="icosahedronMaterial"
          geometry="icosahedron"
          [position]="[3, 6, 4]"
        >
          <ngt-html [distanceFactor]="30" [domStyle]="{ color: 'white' }">
            First
          </ngt-html>
        </ngt-mesh>

        <ngt-mesh
          o3d
          material="icosahedronMaterial"
          geometry="icosahedron"
          [position]="[10, 0, 10]"
        >
          <ngt-html [distanceFactor]="30" [domStyle]="{ color: 'white' }">
            Second
          </ngt-html>
        </ngt-mesh>

        <ngt-mesh
          o3d
          material="icosahedronMaterial"
          geometry="icosahedron"
          [position]="[-20, 0, -20]"
        >
          <ngt-html [distanceFactor]="30" [domStyle]="{ color: 'white' }">
            Third
          </ngt-html>
        </ngt-mesh>
      </ngt-group>
    </ngt-canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HtmlComponent {
  animate(group: THREE.Group) {
    group.rotation.y += 0.01;
  }
}
