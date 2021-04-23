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
    <!--        <ngt-canvas-->
    <!--          [linear]="true"-->
    <!--          [camera]="{ position: [0, 0, 15], near: 5, far: 20 }"-->
    <!--          (created)="$event.gl.setClearColor('lightpink')"-->
    <!--        >-->
    <!--          <demo-orbit-controls></demo-orbit-controls>-->
    <!--          <ngt-stats></ngt-stats>-->
    <!--          <ngt-ambientLight></ngt-ambientLight>-->
    <!--          <ngt-pointLight-->
    <!--            [position]="[150, 150, 150]"-->
    <!--            [args]="[undefined, 0.55]"-->
    <!--          ></ngt-pointLight>-->
    <!--          <demo-boxes></demo-boxes>-->
    <!--          <demo-boxes-effects></demo-boxes-effects>-->
    <!--        </ngt-canvas>-->
    <ngt-canvas
      [camera]="{ position: [0, 0, 5] }"
      (created)="$event.gl.setClearColor('white')"
    >
      <demo-orbit-controls></demo-orbit-controls>
      <ngt-stats></ngt-stats>
      <ngt-gridHelper></ngt-gridHelper>
      <ngt-ambientLight [args]="[undefined, 0.5]"></ngt-ambientLight>
      <ngt-spotLight
        [position]="[10, 10, 10]"
        [args]="[undefined, undefined, undefined, 0.5, 1]"
      ></ngt-spotLight>
      <ngt-pointLight [position]="[-10, -10, -10]"></ngt-pointLight>
      <demo-box [position]="[1.2, 0, 0]"></demo-box>
      <demo-box [position]="[-1.2, 0, 0]"></demo-box>
    </ngt-canvas>
    <!--    <ngt-canvas [camera]="{ position: [0, 0, 20] }">-->
    <!--      <demo-orbit-controls></demo-orbit-controls>-->
    <!--      <ngt-stats></ngt-stats>-->
    <!--      <demo-suzanne></demo-suzanne>-->
    <!--    </ngt-canvas>-->
    <!--    <ngt-canvas-->
    <!--      [linear]="true"-->
    <!--      [camera]="{ fov: 45, near: 1, far: 15000, position: [0, 0, 1000] }"-->
    <!--      [scene]="{ fog: fog }"-->
    <!--      (created)="$event.camera.updateProjectionMatrix()"-->
    <!--    >-->
    <!--      <demo-fly-controls></demo-fly-controls>-->
    <!--      <ngt-stats></ngt-stats>-->
    <!--      <ngt-pointLight-->
    <!--        [position]="[0, 0, 0]"-->
    <!--        [args]="['#ff2200']"-->
    <!--      ></ngt-pointLight>-->
    <!--      <ngt-directionalLight-->
    <!--        [position]="[0, 0, 1]"-->
    <!--        [args]="['#ffffff']"-->
    <!--      ></ngt-directionalLight>-->
    <!--      <demo-lods></demo-lods>-->
    <!--    </ngt-canvas>-->
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  fog = new THREE.Fog(0x000000, 1, 15000);
}
