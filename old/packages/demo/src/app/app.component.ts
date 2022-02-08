import { NgtVector3, provideCanvasOptions } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'demo-root',
  template: `
    <ngt-canvas>
      <ngt-group (animateReady)="onGroupAnimate($event.object)">
        <demo-cube [position]="[2, 0, 0]"></demo-cube>
        <demo-cube [position]="[-2, 0, 0]"></demo-cube>
      </ngt-group>
    </ngt-canvas>
  `,
  providers: [provideCanvasOptions({ initialLog: true })],
})
export class AppComponent {
  onGroupAnimate(group: THREE.Object3D) {
    group.rotation.y += 0.01;
  }
}

@Component({
  selector: 'demo-cube',
  template: `
    <ngt-mesh
      (animateReady)="onCubeAnimate($event.object)"
      [position]="position"
    >
      <ngt-box-geometry></ngt-box-geometry>
      <ngt-mesh-basic-material
        [parameters]="{ color: '#00ff00' }"
      ></ngt-mesh-basic-material>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CubeComponent {
  @Input() position?: NgtVector3;

  onCubeAnimate(cube: THREE.Object3D) {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  }
}
