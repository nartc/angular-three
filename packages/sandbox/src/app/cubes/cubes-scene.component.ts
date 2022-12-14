import {
  injectStore,
  NgtArgs,
  NgtPush,
  NgtScene,
  NgtVector3,
  NgtWrapper,
} from '@angular-three/core';
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
import { delay, of } from 'rxjs';
import { BoxGeometry } from 'three';
import type { OrbitControls } from 'three-stdlib';

@NgtWrapper()
@Component({
  selector: 'ngts-center',
  standalone: true,
  template: `
    <ngt-group>
      <ngt-group>
        <ngt-group *ngIf="true">
          <ng-content></ng-content>
        </ngt-group>
      </ngt-group>
    </ngt-group>
  `,
  imports: [NgIf],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Center {}

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
      (click)="active = !active; cubeClick.emit()"
      (pointerover)="hover = true"
      (pointerout)="hover = false"
      (beforeRender)="onBeforeRender($any($event).object)"
    >
      <ngt-mesh-basic-material
        [color]="hover ? (cubeClick.observed ? 'red' : 'hotpink') : 'orange'"
      ></ngt-mesh-basic-material>
    </ngts-box>
  `,
  imports: [Box],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Cube {
  @Input() position: NgtVector3 = [0, 0, 0];
  @Output() cubeClick = new EventEmitter();

  hover = false;
  active = false;

  onBeforeRender(mesh: THREE.Mesh) {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
  }
}

@NgtScene()
@Component({
  standalone: true,
  template: `
    <ngt-color *args="['skyblue']" attach="background"></ngt-color>

    <ngts-center>
      <cube *ngIf="show" [position]="[1.5, 0, 0]"></cube>
      <cube (cubeClick)="onCubeClick()" [position]="[-1.5, 0, 0]"></cube>
    </ngts-center>

    <ngt-mesh [position]="position$ | ngtPush : [0, 0, 0]">
      <ngt-box-geometry></ngt-box-geometry>
      <ngt-mesh-basic-material></ngt-mesh-basic-material>
    </ngt-mesh>

    <ngt-orbit-controls
      *args="[camera, domElement]"
      (beforeRender)="onBeforeRender($any($event).object)"
      [enableDamping]="true"
    ></ngt-orbit-controls>
  `,
  imports: [Cube, NgIf, Center, NgtArgs, NgtPush],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export default class Scene {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly store = injectStore();

  readonly camera = this.store.getState().camera;
  readonly domElement = this.store.getState().gl.domElement;

  readonly position$ = of([0, 1, 0]).pipe(delay(1000));

  show = true;

  onCubeClick() {
    this.show = !this.show;
    this.cdr.detectChanges();
  }

  onBeforeRender(controls: OrbitControls) {
    controls.update();
  }
}
