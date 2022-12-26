import {
  createEventEmitter,
  injectRef,
  NgtArgs,
  NgtPush,
  NgtRef,
  NgtScene,
  NgtVector3,
  NgtWrapper,
} from '@angular-three/core-two';
import { NgtsOrbitControls } from '@angular-three/soba-two/controls';
import { injectNgtsGLTFLoader } from '@angular-three/soba-two/loaders';
import { NgIf } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, Output } from '@angular/core';
import { map } from 'rxjs';
import { AnimationMixer, BoxGeometry, Group } from 'three';

@NgtWrapper()
@Component({
  selector: 'ngts-box',
  standalone: true,
  template: `
    <ngt-mesh>
      <ngt-box-geometry *args="args"></ngt-box-geometry>
      <ng-content></ng-content>
    </ngt-mesh>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [NgtArgs],
})
export class Box {
  @Input() args: ConstructorParameters<typeof BoxGeometry> = [];
}

@Component({
  selector: 'cube',
  standalone: true,
  template: `
    <ngts-box
      *ref="meshRef"
      [position]="position"
      [visible]="visible"
      [scale]="active ? 1.5 : 1"
      (click)="active = !active; cubeClick.emit()"
      (pointerover)="hover = true"
      (pointerout)="hover = false"
      (beforeRender)="onBeforeRender()"
    >
      <ngt-mesh-normal-material *ngIf="isFun; else noFun"></ngt-mesh-normal-material>
      <ng-template #noFun>
        <ngt-mesh-basic-material
          [color]="hover ? (cubeClick.observed ? 'red' : 'hotpink') : 'orange'"
        ></ngt-mesh-basic-material>
      </ng-template>
    </ngts-box>
  `,
  imports: [NgtRef, Box, NgIf],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Cube {
  @Input() position: NgtVector3 = [0, 0, 0];
  @Input() visible = true;
  @Input() isFun = false;
  @Output() cubeClick = createEventEmitter();

  hover = false;
  active = false;
  readonly meshRef = injectRef<THREE.Mesh>();

  onBeforeRender() {
    if (this.meshRef.nativeElement) {
      this.meshRef.nativeElement.rotation.x += 0.01;
      this.meshRef.nativeElement.rotation.y += 0.01;
    }
  }
}

@Component({
  selector: 'model',
  standalone: true,
  template: `
    <ngt-primitive
      *args="[model$ | ngtPush : null]"
      scale="0.005"
      (beforeRender)="onBeforeRender($any($event).state.delta)"
    ></ngt-primitive>
  `,
  imports: [NgtArgs, NgtPush],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Model {
  private mixer?: AnimationMixer;
  readonly model$ = injectNgtsGLTFLoader('/assets/LittlestTokyo.glb').pipe(
    map((s) => {
      this.mixer = new AnimationMixer(s.scene);
      this.mixer.clipAction(s.animations[0]).play();
      return s.scene;
    })
  );

  onBeforeRender(delta: number) {
    if (this.mixer) {
      this.mixer.update(delta);
    }
  }
}

@NgtScene()
@Component({
  selector: 'cubes-scene',
  standalone: true,
  template: `
    <ngt-color *args="['skyblue']" attach="background"></ngt-color>

    <ngt-ambient-light></ngt-ambient-light>

    <ngt-group (beforeRender)="onGroupBeforeRender($any($event).object)">
      <cube *ngIf="show" [position]="[2.5, -1, 0]"></cube>
      <cube (cubeClick)="show = !show" [position]="[-2.5, 1, 0]"></cube>
      <cube [visible]="show" [isFun]="true" [position]="[2.5, 1, 0]"></cube>
      <cube [isFun]="show" [position]="[-2.5, -1, 0]"></cube>
    </ngt-group>

    <model></model>

    <ngts-orbit-controls [autoRotate]="true"></ngts-orbit-controls>
  `,
  imports: [Model, Cube, NgIf, NgtArgs, NgtsOrbitControls],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export default class Scene {
  show = true;

  onGroupBeforeRender(group: Group) {
    group.rotation.z += 0.01;
  }
}
