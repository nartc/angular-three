import {
  extend,
  injectNgtRef,
  NgtArgs,
  NgtPush,
  NgtRef,
  NgtRendererFlags,
  NgtVector3,
} from '@angular-three/core';
import { NgtsOrbitControls } from '@angular-three/soba/controls';
import { injectNgtsGLTFLoader } from '@angular-three/soba/loaders';
import { NgIf } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import { map } from 'rxjs';
import {
  AmbientLight,
  AnimationMixer,
  BoxGeometry,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
} from 'three';

extend({
  Mesh,
  BoxGeometry,
  MeshBasicMaterial,
  MeshNormalMaterial,
  AmbientLight,
  Color,
  Group,
});

@Component({
  selector: 'ngts-box',
  standalone: true,
  template: `
    <ngt-mesh ngtCompound *ref="ref">
      <ngt-box-geometry *args="args"></ngt-box-geometry>
      <ng-content></ng-content>
    </ngt-mesh>
  `,
  imports: [NgtRef, NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Box {
  static [NgtRendererFlags.COMPOUND] = true;
  @Input() ref = injectNgtRef<Mesh>();
  @Input() args: ConstructorParameters<typeof BoxGeometry> = [];
}

@Component({
  selector: 'cube',
  standalone: true,
  template: `
    <ngts-box
      [ref]="meshRef"
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
  imports: [Box, NgIf],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Cube {
  @Input() position: NgtVector3 = [0, 0, 0];
  @Input() isFun = false;
  @Input() visible = true;
  @Output() cubeClick = new EventEmitter();

  hover = false;
  active = false;

  readonly meshRef = injectNgtRef<Mesh>();

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
  #mixer?: AnimationMixer;
  readonly model$ = injectNgtsGLTFLoader('/assets/LittlestTokyo.glb').pipe(
    map((s) => {
      this.#mixer = new AnimationMixer(s.scene);
      this.#mixer.clipAction(s.animations[0]).play();
      return s.scene;
    })
  );

  onBeforeRender(delta: number) {
    if (this.#mixer) {
      this.#mixer.update(delta);
    }
  }
}

@Component({
  selector: 'cubes-scene',
  standalone: true,
  template: `
    <ngt-color *args="['skyblue']" attach="background"></ngt-color>

    <ngt-ambient-light></ngt-ambient-light>

    <ngt-group (beforeRender)="onBeforeRender($any($event).object)">
      <cube *ngIf="show" [position]="[2.5, -1, 0]"></cube>
      <cube (cubeClick)="show = !show" [position]="[-2.5, 1, 0]"></cube>
      <cube [visible]="show" [isFun]="true" [position]="[2.5, 1, 0]"></cube>
      <cube [isFun]="show" [position]="[-2.5, -1, 0]"></cube>
    </ngt-group>

    <model></model>

    <ngts-orbit-controls [autoRotate]="true"></ngts-orbit-controls>
  `,
  imports: [Cube, NgIf, NgtArgs, NgtsOrbitControls, Model],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Scene {
  show = true;

  onBeforeRender(group: Group) {
    group.rotation.z += 0.01;
  }
}
