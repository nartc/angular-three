import { BoxProps, NgtCannonModule, SphereProps } from '@angular-three/cannon';
import { NgtPhysicBox, NgtPhysicBoxModule } from '@angular-three/cannon/box';
import { NgtPhysicPlaneModule } from '@angular-three/cannon/plane';
import { NgtPhysicSphereModule } from '@angular-three/cannon/sphere';
import {
  NgtAnimationReady,
  NgtCoreModule,
  NgtEuler,
  NgtTriplet,
  NgtVector3,
  NgtVectorPipeModule,
} from '@angular-three/core';
import {
  NgtBufferAttributeModule,
  NgtInstancedBufferAttributeModule,
} from '@angular-three/core/attributes';
import {
  NgtBoxGeometryModule,
  NgtPlaneGeometryModule,
  NgtSphereGeometryModule,
} from '@angular-three/core/geometries';
import {
  NgtHemisphereLightModule,
  NgtPointLightModule,
  NgtSpotLightModule,
} from '@angular-three/core/lights';
import {
  NgtMeshLambertMaterialModule,
  NgtMeshPhongMaterialModule,
} from '@angular-three/core/materials';
import {
  NgtInstancedMeshModule,
  NgtMeshModule,
} from '@angular-three/core/meshes';
import { NgtStatsModule } from '@angular-three/core/stats';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
// @ts-ignore
import niceColors from 'nice-color-palettes';
import * as THREE from 'three';

@Component({
  selector: 'ngt-kinematic-cube',
  template: `
    <ngt-canvas
      [shadows]="true"
      [alpha]="false"
      [camera]="{ position: [0, -12, 16] }"
    >
      <ngt-stats></ngt-stats>

      <ngt-hemisphere-light [intensity]="0.35"></ngt-hemisphere-light>
      <ngt-spot-light
        [position]="[30, 0, 30]"
        [intensity]="2"
        [shadow]="{ mapSize: [256, 256] | vector2 }"
        [castShadow]="true"
        [args]="[undefined, undefined, undefined, 0.3, 1]"
      ></ngt-spot-light>
      <ngt-point-light
        [position]="[-30, 0, -30]"
        [intensity]="0.5"
      ></ngt-point-light>

      <ngt-physics [gravity]="[0, 0, -30]">
        <app-plane [color]="niceColors[17][4]"></app-plane>
        <app-plane
          [color]="niceColors[17][1]"
          [position]="[-6, 0, 0]"
          [rotation]="[0, 0.9, 0]"
        ></app-plane>
        <app-plane
          [color]="niceColors[17][2]"
          [position]="[6, 0, 0]"
          [rotation]="[0, -0.9, 0]"
        ></app-plane>
        <app-plane
          [color]="niceColors[17][3]"
          [position]="[0, 6, 0]"
          [rotation]="[0.9, 0, 0]"
        ></app-plane>
        <app-plane
          [color]="niceColors[17][0]"
          [position]="[0, -6, 0]"
          [rotation]="[-0.9, 0, 0]"
        ></app-plane>

        <app-box></app-box>
        <app-spheres [number]="100"></app-spheres>
      </ngt-physics>
    </ngt-canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KinematicCubeComponent {
  niceColors = niceColors;
}

@Component({
  selector: 'app-plane',
  template: `
    <ngt-mesh
      ngtPhysicPlane
      [rotation]="rotation"
      [position]="position"
      [receiveShadow]="true"
    >
      <ngt-plane-geometry [args]="[1000, 1000]"></ngt-plane-geometry>
      <ngt-mesh-phong-material
        [parameters]="{ color }"
      ></ngt-mesh-phong-material>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaneComponent {
  @Input() color?: THREE.ColorRepresentation;
  @Input() position?: NgtVector3;
  @Input() rotation?: NgtEuler;
}

@Component({
  selector: 'app-box',
  template: `
    <ngt-mesh
      ngtPhysicBox
      #physicBox="ngtPhysicBox"
      [getPhysicProps]="getBoxProps"
      [castShadow]="true"
      [receiveShadow]="true"
      (click)="onClick()"
      (pointerover)="hover = true"
      (pointerout)="hover = false"
      (animateReady)="onBoxAnimate($event, physicBox)"
    >
      <ngt-box-geometry [args]="boxSize"></ngt-box-geometry>
      <ngt-mesh-lambert-material
        [parameters]="{ color: hover ? 'hotpink' : 'orange' }"
      ></ngt-mesh-lambert-material>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoxComponent {
  boxSize: NgtTriplet = [4, 4, 4];
  hover = false;
  active = false;

  onClick() {
    this.active = !this.active;
    this.boxSize = !this.active ? [4, 4, 4] : [5, 5, 5];
  }

  getBoxProps = (): BoxProps => ({
    mass: 1,
    type: 'Kinematic',
    args: this.boxSize,
  });

  onBoxAnimate(
    { animateObject, renderState }: NgtAnimationReady<THREE.Mesh>,
    { api }: NgtPhysicBox
  ) {
    const t = renderState.clock.getElapsedTime();
    api.position.set(Math.sin(t * 2) * 5, Math.cos(t * 2) * 5, 3);
    api.rotation.set(Math.sin(t * 6), Math.cos(t * 6), 0);
  }
}

@Component({
  selector: 'app-spheres',
  template: `
    <ngt-instanced-mesh
      ngtPhysicSphere
      [castShadow]="true"
      [receiveShadow]="true"
      [getPhysicProps]="getInstancedProps"
      [args]="[number]"
    >
      <ngt-sphere-geometry [args]="[1, 16, 16]">
        <ngt-instanced-buffer-attribute
          attach="color"
          [args]="[colors, 3]"
        ></ngt-instanced-buffer-attribute>
      </ngt-sphere-geometry>
      <ngt-mesh-phong-material
        [parameters]="{ vertexColors: true }"
      ></ngt-mesh-phong-material>
    </ngt-instanced-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstancedSpheresComponent {
  @Input() number = 100;

  colors!: Float32Array;

  ngOnInit() {
    this.colors = new Float32Array(this.number * 3);
    const color = new THREE.Color();

    for (let i = 0; i < this.number; i++) {
      color
        .set(niceColors[17][Math.floor(Math.random() * 5)])
        .convertSRGBToLinear()
        .toArray(this.colors, i * 3);
    }
  }

  getInstancedProps(index: number) {
    return {
      args: [1],
      mass: 1,
      position: [
        Math.random() - 0.5,
        Math.random() - 0.5,
        index * 2,
      ] as SphereProps['position'],
    } as SphereProps;
  }
}

@NgModule({
  declarations: [
    KinematicCubeComponent,
    PlaneComponent,
    BoxComponent,
    InstancedSpheresComponent,
  ],
  exports: [KinematicCubeComponent],
  imports: [
    NgtCoreModule,
    NgtStatsModule,
    NgtHemisphereLightModule,
    NgtSpotLightModule,
    NgtVectorPipeModule,
    NgtPointLightModule,
    NgtCannonModule,
    NgtPhysicPlaneModule,
    NgtPlaneGeometryModule,
    NgtMeshPhongMaterialModule,
    NgtPhysicBoxModule,
    NgtBoxGeometryModule,
    NgtMeshLambertMaterialModule,
    NgtPhysicSphereModule,
    NgtMeshModule,
    NgtInstancedMeshModule,
    NgtSphereGeometryModule,
    NgtInstancedBufferAttributeModule,
    NgtBufferAttributeModule,
  ],
})
export class KinematicCubeComponentModule {}
