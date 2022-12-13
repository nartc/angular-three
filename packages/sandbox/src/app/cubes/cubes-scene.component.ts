import { NgtScene, NgtWrapper } from '@angular-three/core';
import { NgIf } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@NgtWrapper()
@Component({
  selector: 'center',
  standalone: true,
  template: `
    <group>
      <group>
        <group>
          <ng-content></ng-content>
        </group>
      </group>
    </group>
  `,
  schemas: [NO_ERRORS_SCHEMA],
})
export class Center {}

@NgtWrapper()
@Component({
  selector: 'box',
  standalone: true,
  template: `
    <mesh>
      <box-geometry></box-geometry>
      <ng-content></ng-content>
    </mesh>
  `,
  imports: [NgIf],
  schemas: [NO_ERRORS_SCHEMA],
})
export class Box {}

@Component({
  selector: 'cube',
  standalone: true,
  template: `
    <center *ngIf="true">
      <box>
        <mesh-basic-material *ngIf="true" color="hotpink"></mesh-basic-material>
      </box>
    </center>
  `,
  imports: [NgIf, Box, Center],
  schemas: [NO_ERRORS_SCHEMA],
})
export class Cube {}

@NgtScene()
@Component({
  standalone: true,
  template: `
    <center>
      <cube *ngIf="true"></cube>
    </center>
  `,
  imports: [Cube, NgIf, Center],
  schemas: [NO_ERRORS_SCHEMA],
})
export default class Scene {
  flag = true;
}
