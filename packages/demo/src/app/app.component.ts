import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Color } from 'three';

@Component({
  selector: 'demo-root',
  template: `
    <!--    <ngt-canvas-->
    <!--      [linear]="true"-->
    <!--      [camera]="{ position: [0, 0, 15], near: 5, far: 20 }"-->
    <!--      (created)="$event.gl.setClearColor('lightpink')"-->
    <!--    >-->
    <!--      <ngt-stats></ngt-stats>-->
    <!--      <ngt-ambientLight></ngt-ambientLight>-->
    <!--      <ngt-pointLight-->
    <!--        [position]="[150, 150, 150]"-->
    <!--        [args]="[undefined, 0.55]"-->
    <!--      ></ngt-pointLight>-->
    <!--      <demo-boxes></demo-boxes>-->
    <!--    </ngt-canvas>-->
    <!--        <ngt-canvas-->
    <!--          [camera]="{ position: [0, 0, 5] }"-->
    <!--          [scene]="{ background: sceneColor }"-->
    <!--        >-->
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
    <!--    <ngt-canvas-->
    <!--      [camera]="{ position: [0, 0, 20] }"-->
    <!--      [scene]="{ background: sceneColor }"-->
    <!--    >-->
    <!--      <demo-orbit-controls></demo-orbit-controls>-->
    <!--      <ngt-stats></ngt-stats>-->
    <!--      <demo-suzanne></demo-suzanne>-->
    <!--    </ngt-canvas>-->
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  sceneColor = new Color(255, 255, 255);
}
