import { injectStore, NgtArgs, NgtScene, NgtVector3, NgtWrapper } from '@angular-three/core';
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
    <ngt-mesh
      [scale]="active ? 1.5 : 1"
      (click)="active = !active"
      (beforeRender)="onBeforeRender($any($event).object)"
    >
      <ngt-box-geometry></ngt-box-geometry>
      <ng-content></ng-content>
    </ngt-mesh>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Box {
  active = false;

  onBeforeRender(mesh: THREE.Mesh) {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
  }
}

@Component({
  selector: 'cube',
  standalone: true,
  template: `
    <ngts-box
      (click)="cubeClick.emit()"
      [position]="position"
      (pointerover)="hover = true"
      (pointerout)="hover = false"
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

    <ngt-orbit-controls
      *args="[camera, domElement]"
      (beforeRender)="onBeforeRender($any($event).object)"
      [enableDamping]="true"
    ></ngt-orbit-controls>
  `,
  imports: [Cube, NgIf, Center, NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export default class Scene {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly store = injectStore();

  readonly camera = this.store.getState().camera;
  readonly domElement = this.store.getState().gl.domElement;

  show = true;

  onCubeClick() {
    this.show = !this.show;
    this.cdr.detectChanges();
  }

  onBeforeRender(controls: OrbitControls) {
    controls.update();
  }
}
