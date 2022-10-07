import { NgtPhysicBody } from '@angular-three/cannon';
import { NgtTriple } from '@angular-three/core';
import { NgtMeshPhongMaterial } from '@angular-three/core/materials';
import { NgtMesh } from '@angular-three/core/meshes';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
// @ts-ignore
import niceColors from 'nice-color-palettes';
import * as THREE from 'three';
import { HeightFieldGeometryComponent } from './height-field-geometry.component';

@Component({
  selector: 'sandbox-height-field[elementSize][heights][position][rotation]',
  standalone: true,
  templateUrl: 'height-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgtPhysicBody],
  imports: [NgtMesh, NgtMeshPhongMaterial, HeightFieldGeometryComponent],
})
export class HeightFieldComponent {
  @Input() elementSize = 0;
  @Input() heights: number[][] = [];
  @Input() position: NgtTriple = [0, 0, 0];
  @Input() rotation: NgtTriple = [0, 0, 0];

  readonly color = niceColors[17][4];

  readonly heightFieldRef = this.physicBody.useHeightfield<THREE.Mesh>(() => ({
    args: [
      this.heights,
      {
        elementSize: this.elementSize,
      },
    ],
    position: this.position,
    rotation: this.rotation,
  }));

  constructor(private physicBody: NgtPhysicBody) {}
}
