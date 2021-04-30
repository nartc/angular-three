import { ChangeDetectionStrategy, Component } from '@angular/core';
import * as THREE from 'three';

let count = 0;

@Component({
  selector: 'demo-root',
  template: `
    <ngt-canvas [camera]="{ position: [0, 0, 35] }">
      <ngt-stats></ngt-stats>
      <ngt-orbit-controls></ngt-orbit-controls>
      <ngt-ambient-light [intensity]="2"></ngt-ambient-light>
      <ngt-point-light [position]="[40, 40, 40]"></ngt-point-light>
      <demo-jumbo></demo-jumbo>
      <demo-birds></demo-birds>
    </ngt-canvas>
    <!--    <ngt-canvas-->
    <!--      [linear]="true"-->
    <!--      [camera]="{ position: [0, 0, 15], near: 5, far: 20 }"-->
    <!--      (created)="$event.gl.setClearColor('lightpink')"-->
    <!--    >-->
    <!--      <demo-orbit-controls></demo-orbit-controls>-->
    <!--      <ngt-stats></ngt-stats>-->
    <!--      <ngt-ambient-light></ngt-ambient-light>-->
    <!--      <ngt-point-light-->
    <!--        [position]="[150, 150, 150]"-->
    <!--        [args]="[undefined, 0.55]"-->
    <!--      ></ngt-point-light>-->
    <!--      <demo-boxes></demo-boxes>-->
    <!--      <demo-boxes-effects></demo-boxes-effects>-->
    <!--    </ngt-canvas>-->
    <!--        <ngt-canvas-->
    <!--          [camera]="{ position: [0, 0, 5] }"-->
    <!--          (created)="$event.gl.setClearColor('white')"-->
    <!--        >-->
    <!--          <demo-orbit-controls></demo-orbit-controls>-->
    <!--          <ngt-stats></ngt-stats>-->
    <!--          <ngt-grid-helper></ngt-grid-helper>-->
    <!--          <ngt-ambient-light [args]="[undefined, 0.5]"></ngt-ambient-light>-->
    <!--          <ngt-spot-light-->
    <!--            [position]="[10, 10, 10]"-->
    <!--            [args]="[undefined, undefined, undefined, 0.5, 1]"-->
    <!--          ></ngt-spot-light>-->
    <!--          <ngt-point-light [position]="[-10, -10, -10]"></ngt-point-light>-->
    <!--          <demo-box [position]="[1.2, 0, 0]"></demo-box>-->
    <!--          <demo-box [position]="[-1.2, 0, 0]"></demo-box>-->
    <!--        </ngt-canvas>-->
    <!--        <ngt-canvas [camera]="{ position: [0, 0, 20] }">-->
    <!--          <demo-orbit-controls></demo-orbit-controls>-->
    <!--          <ngt-stats></ngt-stats>-->
    <!--          <demo-suzanne></demo-suzanne>-->
    <!--        </ngt-canvas>-->
    <!--    <ngt-canvas-->
    <!--      [linear]="true"-->
    <!--      [camera]="{ fov: 45, near: 1, far: 15000, position: [0, 0, 1000] }"-->
    <!--      [scene]="{ fog: fog }"-->
    <!--      (created)="$event.camera.updateProjectionMatrix()"-->
    <!--    >-->
    <!--      <demo-fly-controls></demo-fly-controls>-->
    <!--      <ngt-stats></ngt-stats>-->
    <!--      <ngt-point-light-->
    <!--        [position]="[0, 0, 0]"-->
    <!--        [args]="['#ff2200']"-->
    <!--      ></ngt-point-light>-->
    <!--      <ngt-directional-light-->
    <!--        [position]="[0, 0, 1]"-->
    <!--        [args]="['#ffffff']"-->
    <!--      ></ngt-directional-light>-->
    <!--      <demo-lods></demo-lods>-->
    <!--    </ngt-canvas>-->

    <!--            <ngt-canvas-->
    <!--              [shadows]="true"-->
    <!--              [camera]="{ fov: 75, position: [0, 0, 50], near: 10, far: 150 }"-->
    <!--              [scene]="{ fog: anotherFog, background: background }"-->
    <!--            >-->
    <!--              <ngt-ambient-light [intensity]="1.5"></ngt-ambient-light>-->
    <!--              <ngt-point-light-->
    <!--                [position]="[100, 10, -50]"-->
    <!--                [intensity]="20"-->
    <!--                [castShadow]="true"-->
    <!--              ></ngt-point-light>-->
    <!--              <ngt-point-light-->
    <!--                [position]="[-100, -100, -100]"-->
    <!--                [intensity]="10"-->
    <!--                color="black"-->
    <!--              ></ngt-point-light>-->
    <!--              <demo-swarm [count]="150" [position]="[0, 10, 0]"></demo-swarm>-->
    <!--              <ngt-contact-shadows-->
    <!--                [rotation]="[halfPi, 0, 0]"-->
    <!--                [position]="[0, -30, 0]"-->
    <!--                [opacity]="0.6"-->
    <!--                [width]="130"-->
    <!--                [height]="130"-->
    <!--                [blur]="1"-->
    <!--                [far]="40"-->
    <!--              ></ngt-contact-shadows>-->
    <!--            </ngt-canvas>-->
    {{ render() }}
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  fog = new THREE.Fog(0x000000, 1, 15000);
  anotherFog = new THREE.Fog('black', 60, 100);
  hovered = false;
  halfPi = Math.PI / 2;
  background = new THREE.Color('#f0f0f0');

  render() {
    console.log('render count: ', ++count);
  }
}
