import { ChangeDetectionStrategy, Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'demo-root',
  template: `
    <!--    <ngt-canvas [camera]="{ position: [0, 0, 35] }">-->
    <!--      <ngt-stats></ngt-stats>-->
    <!--      <ngt-ambientLight [intensity]="2"></ngt-ambientLight>-->
    <!--      <ngt-pointLight [position]="[40, 40, 40]"></ngt-pointLight>-->
    <!--      <demo-jumbo></demo-jumbo>-->
    <!--      <demo-birds></demo-birds>-->
    <!--    </ngt-canvas>-->
    <!--    <ngt-canvas-->
    <!--      [linear]="true"-->
    <!--      [camera]="{ position: [0, 0, 15], near: 5, far: 20 }"-->
    <!--      (created)="$event.gl.setClearColor('lightpink')"-->
    <!--    >-->
    <!--      <demo-orbit-controls></demo-orbit-controls>-->
    <!--      <ngt-stats></ngt-stats>-->
    <!--      <ngt-ambientLight></ngt-ambientLight>-->
    <!--      <ngt-pointLight-->
    <!--        [position]="[150, 150, 150]"-->
    <!--        [args]="[undefined, 0.55]"-->
    <!--      ></ngt-pointLight>-->
    <!--      <demo-boxes></demo-boxes>-->
    <!--      <demo-boxes-effects></demo-boxes-effects>-->
    <!--    </ngt-canvas>-->
    <!--        <ngt-canvas [camera]="{ position: [0, 0, 5] }">-->
    <!--          <demo-orbit-controls></demo-orbit-controls>-->
    <!--          <ngt-stats></ngt-stats>-->
    <!--          <ngt-ambientLight [args]="[undefined, 0.5]"></ngt-ambientLight>-->
    <!--          <ngt-spotLight-->
    <!--            [position]="[10, 10, 10]"-->
    <!--            [args]="[undefined, undefined, undefined, 0.5, 1]"-->
    <!--          ></ngt-spotLight>-->
    <!--          <ngt-pointLight [position]="[-10, -10, -10]"></ngt-pointLight>-->
    <!--          <demo-box [position]="[1.2, 0, 0]"></demo-box>-->
    <!--          <demo-box [position]="[-1.2, 0, 0]"></demo-box>-->
    <!--        </ngt-canvas>-->
    <!--    <ngt-canvas [camera]="{ position: [0, 0, 20] }">-->
    <!--      <demo-orbit-controls></demo-orbit-controls>-->
    <!--      <ngt-stats></ngt-stats>-->
    <!--      <demo-suzanne></demo-suzanne>-->
    <!--    </ngt-canvas>-->
    <ngt-canvas
      [camera]="{ fov: 45, near: 1, far: 15000, position: [0, 0, 1000] }"
      [scene]="{ fog: fog }"
      (created)="$event.camera.updateProjectionMatrix()"
    >
      <demo-fly-controls></demo-fly-controls>
      <ngt-stats></ngt-stats>
      <ngt-pointLight
        [position]="[0, 0, 0]"
        [args]="['#ff2200']"
      ></ngt-pointLight>
      <ngt-directionalLight
        [position]="[0, 0, 1]"
        [args]="['#ffffff']"
      ></ngt-directionalLight>
      <demo-lods></demo-lods>
    </ngt-canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  fog = new THREE.Fog(0x000000, 1, 15000);
}

@Component({
  selector: 'demo-lods',
  template: `
    <ngt-icosahedronGeometry
      ngtId="highestDetail"
      [args]="[100, 16]"
    ></ngt-icosahedronGeometry>
    <ngt-icosahedronGeometry
      ngtId="highDetail"
      [args]="[100, 8]"
    ></ngt-icosahedronGeometry>
    <ngt-icosahedronGeometry
      ngtId="normal"
      [args]="[100, 4]"
    ></ngt-icosahedronGeometry>
    <ngt-icosahedronGeometry
      ngtId="lowDetail"
      [args]="[100, 2]"
    ></ngt-icosahedronGeometry>
    <ngt-icosahedronGeometry
      ngtId="lowestDetail"
      [args]="[100, 1]"
    ></ngt-icosahedronGeometry>
    <ngt-meshLambertMaterial
      ngtId="lambertMaterial"
      [parameters]="{ color: '#ffffff', wireframe: true }"
    ></ngt-meshLambertMaterial>
    <ngt-lod
      *ngFor="let position of amount"
      [position]="position"
      [matrixAutoUpdate]="false"
    >
      <ngt-mesh
        *ngFor="let geometry of geometries"
        [lodDistance]="geometry.distance"
        [material]="'lambertMaterial'"
        [geometry]="geometry.id"
        [scale]="[1.5, 1.5, 1.5]"
        [matrixAutoUpdate]="false"
      ></ngt-mesh>
    </ngt-lod>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LodComponent {
  amount = Array.from({ length: 1000 })
    .fill(undefined)
    .map(
      () =>
        [this.getXZ(), this.getY(), this.getXZ()] as [number, number, number]
    );
  geometries = [
    {
      id: 'highestDetail',
      distance: 50,
    },
    {
      id: 'highDetail',
      distance: 300,
    },
    {
      id: 'normal',
      distance: 1000,
    },
    {
      id: 'lowDetail',
      distance: 2000,
    },
    {
      id: 'lowestDetail',
      distance: 8000,
    },
  ];

  getXZ() {
    return 10000 * (0.5 - Math.random());
  }

  getY() {
    return 7500 * (0.5 - Math.random());
  }
}
