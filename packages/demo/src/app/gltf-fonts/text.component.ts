import type { ThreeVector3 } from '@angular-three/core';
import { loadFont } from '@angular-three/core/loaders';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Mesh, Vector3 } from 'three';

@Component({
  selector: 'demo-text',
  template: `
    <ngt-group [position]="position" [scale]="[0.1 * size, 0.1 * size, 0.1]">
      <ngt-mesh *ngIf="font$ | async as font" (ready)="onMeshReady($event)">
        <ngt-text-geometry
          [args]="[
            text,
            {
              font: font,
              size: 40,
              height: 30,
              curveSegments: 32,
              bevelEnabled: true,
              bevelThickness: 6,
              bevelSize: 2.5,
              bevelOffset: 0,
              bevelSegments: 8
            }
          ]"
        ></ngt-text-geometry>
        <ngt-mesh-normal-material></ngt-mesh-normal-material>
      </ngt-mesh>
    </ngt-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextComponent {
  @Input() position!: ThreeVector3;
  @Input() text = '';
  @Input() vAlign = 'center';
  @Input() hAlign = 'center';
  @Input() size = 1;
  @Input() color = '#000000';

  font$ = loadFont('/assets/bold.blob');

  onMeshReady(mesh: Mesh) {
    const size = new Vector3();
    mesh.geometry.computeBoundingBox();
    mesh.geometry.boundingBox?.getSize(size);
    mesh.position.x =
      this.hAlign === 'center'
        ? -size.x / 2
        : this.hAlign === 'right'
        ? 0
        : -size.x / 2;
    mesh.position.y =
      this.vAlign === 'center'
        ? -size.y / 2
        : this.vAlign === 'top'
        ? 0
        : -size.y / 2;

    // mesh.updateMatrix();
  }
}
