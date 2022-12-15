import {
  injectStore,
  NgtArgs,
  NgtPush,
  NgtScene,
  NgtVector3,
  NgtWrapper,
} from '@angular-three/core';
import { injectNgtsGLTFLoader } from '@angular-three/soba/loaders';
import { NgIf } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { map } from 'rxjs';
import * as THREE from 'three';
import { AnimationMixer, BoxGeometry } from 'three';
import { OrbitControls } from 'three-stdlib';

function createEventEmitter<T>(): EventEmitter<T> {
  const cdr = inject(ChangeDetectorRef);
  const parentCdr = inject(ChangeDetectorRef, { skipSelf: true, optional: true });

  const eventEmitter = new EventEmitter<T>();

  const originalEmit = eventEmitter.emit.bind(eventEmitter);

  eventEmitter.emit = (...args: Parameters<EventEmitter<T>['emit']>) => {
    originalEmit(...args);
    cdr.detectChanges();
    if (parentCdr) {
      parentCdr.detectChanges();
    }
  };

  return eventEmitter;
}

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
  imports: [NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Box {
  @Input() args: ConstructorParameters<typeof BoxGeometry> = [];
}

@Component({
  selector: 'cube',
  standalone: true,
  template: `
    <ngts-box
      [position]="position"
      [scale]="active ? 1.5 : 1"
      [visible]="visible"
      (click)="active = !active; cubeClick.emit()"
      (pointerover)="hover = true"
      (pointerout)="hover = false"
      (beforeRender)="onBeforeRender($any($event).object)"
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
  @Input() visible = true;
  @Input() isFun = false;
  @Output() cubeClick = createEventEmitter();

  hover = false;
  active = false;

  onBeforeRender(mesh: THREE.Mesh) {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
  }
}

@Component({
  selector: 'model',
  standalone: true,
  template: `
    <ngt-primitive
      *args="[model$ | ngtPush : null]"
      [scale]="0.005"
      (beforeRender)="onBeforeRender($any($event).state.delta)"
    ></ngt-primitive>
  `,
  imports: [NgtArgs, NgtPush],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Model {
  private mixer?: AnimationMixer;
  readonly model$ = injectNgtsGLTFLoader()
    .load('/assets/LittlestTokyo.glb')
    .pipe(
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
  standalone: true,
  template: `
    <ngt-color *args="['skyblue']" attach="background"></ngt-color>

    <ngt-ambient-light></ngt-ambient-light>

    <cube [visible]="show" [position]="[2.5, -1, 0]"></cube>
    <cube (cubeClick)="show = !show" [position]="[-2.5, 1, 0]"></cube>
    <cube [isFun]="true" [position]="[2.5, 1, 0]"></cube>
    <cube [isFun]="true" [position]="[-2.5, -1, 0]"></cube>

    <model></model>

    <ngt-orbit-controls
      *args="[camera, domElement]"
      (beforeRender)="onBeforeRender($any($event).object)"
      [enableDamping]="true"
      [autoRotate]="true"
    ></ngt-orbit-controls>
  `,
  imports: [Cube, NgtArgs, Model],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export default class Scene {
  private readonly store = injectStore();

  readonly camera = this.store.getState().camera;
  readonly domElement = this.store.getState().gl.domElement;

  show = true;

  onBeforeRender(controls: OrbitControls) {
    controls.update();
  }
}
