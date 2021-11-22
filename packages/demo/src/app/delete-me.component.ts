import { NgtOrbitControlsModule } from '@angular-three/controls/orbit-controls';
import { NgtCoreModule } from '@angular-three/core';
import { NgtLineGeometryModule } from '@angular-three/core/geometries';
import { NgtLineMaterialModule } from '@angular-three/core/materials';
import { NgtLine2Module } from '@angular-three/core/meshes';
import { NgtStatsModule } from '@angular-three/core/stats';
import {
  NgtSobaLineModule,
  NgtSobaTextModule,
} from '@angular-three/soba/abstractions';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';
// @ts-ignore
import { hilbert3D } from 'three/examples/jsm/utils/GeometryUtils';

@Component({
  selector: 'ngt-delete-me',
  template: `
    <ngt-canvas>
      <ngt-stats></ngt-stats>
      <ngt-orbit-controls></ngt-orbit-controls>
      <!--      <ngt-soba-line-->
      <!--        [points]="points"-->
      <!--        color="red"-->
      <!--        [lineWidth]="3"-->
      <!--        [dashed]="true"-->
      <!--      ></ngt-soba-line>-->
      <ngt-soba-text
        color="#EC2D2D"
        [fontSize]="12"
        [maxWidth]="200"
        [lineHeight]="1"
        [letterSpacing]="0.02"
        textAlign="left"
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
        (animateReady)="onTextAnimate($event.animateObject)"
      >
        <ngt-soba-text-content>
          LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT, SED DO
          EIUSMOD TEMPOR INCIDIDUNT UT LABORE ET DOLORE MAGNA ALIQUA. UT ENIM AD
          MINIM VENIAM, QUIS NOSTRUD EXERCITATION ULLAMCO LABORIS NISI UT
          ALIQUIP EX EA COMMODO CONSEQUAT. DUIS AUTE IRURE DOLOR IN
          REPREHENDERIT IN VOLUPTATE VELIT ESSE CILLUM DOLORE EU FUGIAT NULLA
          PARIATUR. EXCEPTEUR SINT OCCAECAT CUPIDATAT NON PROIDENT, SUNT IN
          CULPA QUI OFFICIA DESERUNT MOLLIT ANIM ID EST LABORUM.
        </ngt-soba-text-content>
      </ngt-soba-text>
    </ngt-canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteMeComponent {
  points = hilbert3D(new THREE.Vector3(0), 5).map((p: any) => [
    p.x,
    p.y,
    p.z,
  ]) as [number, number, number][];

  onTextAnimate(text: any) {
    (text as THREE.Mesh).rotation.y += 0.01;
  }
}

@NgModule({
  declarations: [DeleteMeComponent],
  exports: [DeleteMeComponent],
  imports: [
    NgtCoreModule,
    NgtSobaTextModule,
    NgtStatsModule,
    NgtLine2Module,
    NgtLineGeometryModule,
    NgtLineMaterialModule,
    NgtSobaLineModule,
    NgtOrbitControlsModule,
  ],
})
export class DeleteMeComponentModule {}
