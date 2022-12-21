import {
  injectNgtStore,
  injectRef,
  NgtArgs,
  NgtPush,
  NgtRef,
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
  selector: 'cubes-scene',
  standalone: true,
  template: `
    <ngt-color *args="['skyblue']" attach="background"></ngt-color>

    <ngt-ambient-light></ngt-ambient-light>

    <cube *ngIf="show" [position]="[2.5, -1, 0]"></cube>
    <cube (cubeClick)="show = !show" [position]="[-2.5, 1, 0]"></cube>
    <cube [visible]="show" [isFun]="true" [position]="[2.5, 1, 0]"></cube>
    <cube [isFun]="show" [position]="[-2.5, -1, 0]"></cube>

    <model></model>

    <ngt-orbit-controls
      *args="[camera, domElement]"
      enableDamping
      autoRotate
      (beforeRender)="onBeforeRender($any($event).object)"
    ></ngt-orbit-controls>
  `,
  imports: [Model, Cube, NgIf, NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export default class Scene {
  private readonly store = injectNgtStore();

  readonly camera = this.store.gett((s) => s.camera);
  readonly domElement = this.store.gett((s) => s.gl.domElement);

  show = true;

  onBeforeRender(controls: OrbitControls) {
    controls.update();
  }
}
