import { NgtOrbitControlsModule } from '@angular-three/controls/orbit-controls';
import { NgtCoreModule } from '@angular-three/core';
import { NgtLineGeometryModule } from '@angular-three/core/geometries';
import { NgtGroupModule } from '@angular-three/core/group';
import { NgtAxesHelperModule } from '@angular-three/core/helpers';
import {
  NgtAmbientLightModule,
  NgtPointLightModule,
} from '@angular-three/core/lights';
import {
  NgtLineMaterialModule,
  NgtMeshStandardMaterialModule,
} from '@angular-three/core/materials';
import { NgtLine2Module } from '@angular-three/core/meshes';
import { NgtStatsModule } from '@angular-three/core/stats';
import {
  NgtSobaBillboardModule,
  NgtSobaLineModule,
  NgtSobaTextModule,
} from '@angular-three/soba/abstractions';
import {
  NgtSobaBoxModule,
  NgtSobaConeModule,
  NgtSobaPlaneModule,
} from '@angular-three/soba/shapes';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';
// @ts-ignore
import { hilbert3D } from 'three/examples/jsm/utils/GeometryUtils';

@Component({
  selector: 'ngt-delete-me',
  template: `
    <ngt-canvas
      (created)="$event.gl.setClearColor('black')"
      [camera]="{ position: [0, 0, 10] }"
    >
      <ngt-stats></ngt-stats>
      <ngt-orbit-controls
        (ready)="$event.enablePan = true; $event.zoomSpeed = 0.5"
      ></ngt-orbit-controls>

      <ngt-soba-billboard
        #firstBillboard="ngtSobaBillboard"
        [position]="[0.5, 2.05, 0.5]"
      >
        <ngt-soba-text
          [appendTo]="firstBillboard.group.object3d"
          [fontSize]="1"
          outlineWidth="5%"
          outlineColor="#000000"
          [outlineOpacity]="1"
        >
          <ngt-soba-text-content> box</ngt-soba-text-content>
        </ngt-soba-text>
      </ngt-soba-billboard>

      <ngt-soba-box [position]="[0.5, 1, 0.5]">
        <ngt-mesh-standard-material
          [parameters]="{ color: 'red' }"
        ></ngt-mesh-standard-material>
      </ngt-soba-box>

      <ngt-group #group="ngtGroup" [position]="[-2.5, -3, -1]">
        <ngt-soba-billboard
          #secondBillboard="ngtSobaBillboard"
          [appendTo]="group.object3d"
          [position]="[0, 1.05, 0]"
        >
          <ngt-soba-text
            [appendTo]="secondBillboard.group.object3d"
            [fontSize]="1"
            outlineWidth="5%"
            outlineColor="#000000"
            [outlineOpacity]="1"
          >
            <ngt-soba-text-content> cone</ngt-soba-text-content>
          </ngt-soba-text>
        </ngt-soba-billboard>

        <ngt-soba-cone>
          <ngt-mesh-standard-material
            [parameters]="{ color: 'green' }"
          ></ngt-mesh-standard-material>
        </ngt-soba-cone>
      </ngt-group>

      <ngt-soba-billboard #billboard="ngtSobaBillboard" [position]="[0, 0, -5]">
        <ngt-soba-plane [appendTo]="billboard.group.object3d" [args]="[2, 2]">
          <ngt-mesh-standard-material
            [parameters]="{ color: '#000066' }"
          ></ngt-mesh-standard-material>
        </ngt-soba-plane>
      </ngt-soba-billboard>

      <ngt-ambient-light [intensity]="0.8"></ngt-ambient-light>
      <ngt-point-light [intensity]="1" [position]="[0, 6, 0]"></ngt-point-light>

      <!--      <ngt-soba-line-->
      <!--        [points]="points"-->
      <!--        [vertexColors]="$any(colors)"-->
      <!--        color="white"-->
      <!--        [lineWidth]="3"-->
      <!--      ></ngt-soba-line>-->
      <!--      <ngt-soba-text-->
      <!--        color="#EC2D2D"-->
      <!--        [fontSize]="12"-->
      <!--        [maxWidth]="200"-->
      <!--        [lineHeight]="1"-->
      <!--        [letterSpacing]="0.02"-->
      <!--        textAlign="left"-->
      <!--        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"-->
      <!--        anchorX="center"-->
      <!--        anchorY="middle"-->
      <!--        (animateReady)="onTextAnimate($event.animateObject)"-->
      <!--      >-->
      <!--        <ngt-soba-text-content>-->
      <!--          LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT, SED DO-->
      <!--          EIUSMOD TEMPOR INCIDIDUNT UT LABORE ET DOLORE MAGNA ALIQUA. UT ENIM AD-->
      <!--          MINIM VENIAM, QUIS NOSTRUD EXERCITATION ULLAMCO LABORIS NISI UT-->
      <!--          ALIQUIP EX EA COMMODO CONSEQUAT. DUIS AUTE IRURE DOLOR IN-->
      <!--          REPREHENDERIT IN VOLUPTATE VELIT ESSE CILLUM DOLORE EU FUGIAT NULLA-->
      <!--          PARIATUR. EXCEPTEUR SINT OCCAECAT CUPIDATAT NON PROIDENT, SUNT IN-->
      <!--          CULPA QUI OFFICIA DESERUNT MOLLIT ANIM ID EST LABORUM.-->
      <!--        </ngt-soba-text-content>-->
      <!--      </ngt-soba-text>-->
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

  colors = new Array(this.points.length)
    .fill(0)
    .map(() => [Math.random(), Math.random(), Math.random()]) as [
    number,
    number,
    number
  ][];

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
    NgtSobaBillboardModule,
    NgtSobaBoxModule,
    NgtMeshStandardMaterialModule,
    NgtGroupModule,
    NgtSobaConeModule,
    NgtSobaPlaneModule,
    NgtAmbientLightModule,
    NgtPointLightModule,
    NgtAxesHelperModule,
    CommonModule,
  ],
})
export class DeleteMeComponentModule {}
