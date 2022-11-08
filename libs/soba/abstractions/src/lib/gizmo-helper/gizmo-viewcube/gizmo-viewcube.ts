import { NgtAmbientLight, NgtPointLight } from '@angular-three/core/lights';
import { NgtGroup } from '@angular-three/core/objects';
import { NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  cornerDimensions,
  corners,
  edgeDimensions,
  edges,
} from './gizmo-viewcube-constants';
import { NgtSobaGizmoViewcubeEdgeCube } from './gizmo-viewcube-edge';
import { NgtSobaGizmoViewcubeFaceCube } from './gizmo-viewcube-face';
import {
  NgtSobaGizmoViewcubeInputs,
  NgtSobaGizmoViewcubeInputsPassThrough,
  provideNgtSobaViewCubeInputs,
} from './gizmo-viewcube-inputs';

@Component({
  selector: 'ngt-soba-gizmo-viewcube',
  standalone: true,
  template: `
    <ngt-group name="gizmo-view-cube" [scale]="60">
      <ngt-soba-gizmo-viewcube-face-cube
        [ngtSobaGizmoViewcubeInputsPassThrough]="this"
      ></ngt-soba-gizmo-viewcube-face-cube>

      <ngt-soba-gizmo-viewcube-edge-cube
        *ngFor="let edge of edges; index as i"
        [position]="edge"
        [dimensions]="edgeDimensions[i]"
        [ngtSobaGizmoViewcubeInputsPassThrough]="this"
      ></ngt-soba-gizmo-viewcube-edge-cube>

      <ngt-soba-gizmo-viewcube-edge-cube
        *ngFor="let corner of corners"
        [position]="corner"
        [dimensions]="cornerDimensions"
        [ngtSobaGizmoViewcubeInputsPassThrough]="this"
      ></ngt-soba-gizmo-viewcube-edge-cube>

      <ngt-ambient-light intensity="0.5"></ngt-ambient-light>
      <ngt-point-light [position]="10" intensity="0.5"></ngt-point-light>
    </ngt-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgtGroup,
    NgtSobaGizmoViewcubeFaceCube,
    NgtSobaGizmoViewcubeEdgeCube,
    NgtAmbientLight,
    NgtPointLight,
    NgtSobaGizmoViewcubeInputsPassThrough,
    NgForOf,
  ],
  providers: [provideNgtSobaViewCubeInputs(NgtSobaGizmoViewcube)],
})
export class NgtSobaGizmoViewcube extends NgtSobaGizmoViewcubeInputs {
  readonly edges = edges;
  readonly edgeDimensions = edgeDimensions;

  readonly corners = corners;
  readonly cornerDimensions = cornerDimensions;
}
