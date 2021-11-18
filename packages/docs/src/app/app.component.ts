// import { NgtCamera } from '@angular-three/core';
// import { Component } from '@angular/core';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//
// @Component({
//   selector: 'ngt-root',
//   template: `
//     <!--    fov?: number, aspect?: number, near?: number, far?: number-->
//     <ngt-canvas
//       [shadows]="true"
//       [camera]="{ fov: 35, near: 1, far: 1000, position: [160, 40, 10] }"
//       (created)="onCanvasReady($event)"
//     >
//       <ngt-orbit-controls
//         (ready)="onControlsReady($event)"
//       ></ngt-orbit-controls>
//
//       <ngt-ambient-light [intensity]="0.1"></ngt-ambient-light>
//       <ngt-spot-light
//         #spotLight="ngtSpotLight"
//         [intensity]="1"
//         [position]="[15, 40, 35]"
//         [castShadow]="true"
//         [args]="[undefined, undefined, 200, 0.25 | mathConst: 'PI', 0.1, 2]"
//         (ready)="onSpotLightReady($event)"
//       ></ngt-spot-light>
//       <!--      <ngt-spot-light-helper-->
//       <!--        (animateReady)="$event.animateObject.update()"-->
//       <!--        [args]="[spotLight.object3d]"-->
//       <!--      ></ngt-spot-light-helper>-->
//
//       <!--      <ngt-camera-helper-->
//       <!--        [args]="[spotLight.object3d.shadow.camera]"-->
//       <!--      ></ngt-camera-helper>-->
//
//       <ngt-mesh
//         [position]="[0, -1, 0]"
//         [receiveShadow]="true"
//         (ready)="onPlaneReady($event)"
//       >
//         <ngt-plane-geometry [args]="[2000, 2000]"></ngt-plane-geometry>
//         <ngt-mesh-phong-material
//           [parameters]="{ color: '#808080', dithering: true }"
//         ></ngt-mesh-phong-material>
//       </ngt-mesh>
//
//       <ngt-mesh [position]="[0, 5, 0]" [castShadow]="true">
//         <ngt-cylinder-geometry
//           [args]="[5, 5, 2, 32, 1, false]"
//         ></ngt-cylinder-geometry>
//         <ngt-mesh-phong-material
//           [parameters]="{ color: '#4080ff', dithering: true }"
//         ></ngt-mesh-phong-material>
//       </ngt-mesh>
//     </ngt-canvas>
//   `,
// })
// export class AppComponent {
//   scene?: THREE.Scene;
//
//   onControlsReady(controls: OrbitControls) {
//     controls.minDistance = 20;
//     controls.maxDistance = 500;
//     controls.enablePan = false;
//   }
//
//   onSpotLightReady(spotLight: THREE.SpotLight) {
//     setTimeout(() => {
//       const lightHelper = new THREE.SpotLightHelper(spotLight);
//       this.scene!.add(lightHelper);
//     });
//   }
//
//   onPlaneReady(plane: THREE.Mesh) {
//     plane.rotation.x = -Math.PI / 2;
//   }
//
//   onCanvasReady($event: {
//     gl: THREE.WebGLRenderer;
//     camera: NgtCamera;
//     scene: THREE.Scene;
//   }) {
//     $event.gl.setClearColor('black');
//     this.scene = $event.scene;
//   }
// }

import { BoxProps, SphereProps } from '@angular-three/cannon';
import { NgtPhysicBox } from '@angular-three/cannon/box';
import {
  NgtAnimationReady,
  NgtColor,
  NgtEuler,
  NgtTriplet,
  NgtVector3,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
// @ts-ignore
import niceColors from 'nice-color-palettes';
import * as THREE from 'three';

@Component({
  selector: 'ngt-root',
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
        [shadow]="{ mapSize: mapSize }"
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

        <!--        <app-box [position]="[0.1, 5, 0]"></app-box>-->
        <!--        <app-box [position]="[0, 10, -1]"></app-box>-->
        <!--        <app-box [position]="[0, 20, -2]"></app-box>-->
      </ngt-physics>
    </ngt-canvas>
  `,
})
export class AppComponent {
  niceColors = niceColors;
  mapSize = new THREE.Vector2(256, 256);
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
        [parameters]="{ color: $any(color) }"
      ></ngt-mesh-phong-material>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaneComponent {
  @Input() color?: NgtColor;
  @Input() position?: NgtVector3;
  @Input() rotation?: NgtEuler;
}

@Component({
  selector: 'app-box',
  template: `
    <ngt-mesh
      ngtPhysicBox
      #physicBox="ngtPhysicBox"
      [getPhysicProps]="getBoxProps.bind(this)"
      [castShadow]="true"
      [receiveShadow]="true"
      (animateReady)="onBoxAnimate($event, physicBox)"
    >
      <ngt-box-geometry [args]="boxSize"></ngt-box-geometry>
      <!--      <ngt-mesh-phong-material-->
      <!--        [parameters]="{ color: 'hotpink' }"-->
      <!--      ></ngt-mesh-phong-material>-->
      <ngt-mesh-lambert-material
        [parameters]="{ color: 'white' }"
      ></ngt-mesh-lambert-material>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoxComponent {
  @Input() position?: NgtVector3;
  boxSize: NgtTriplet = [4, 4, 4];

  getBoxProps(): BoxProps {
    return { mass: 1, type: 'Kinematic', args: this.boxSize };
  }

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
