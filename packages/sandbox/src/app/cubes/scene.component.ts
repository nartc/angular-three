import { extend, injectNgtRef, NgtArgs, NgtRef, NgtRendererFlags } from '@angular-three/core';
import { NgIf } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  Input,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  AmbientLight,
  BoxGeometry,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshStandardMaterial,
  TorusGeometry,
} from 'three';

extend({
  Mesh,
  MeshBasicMaterial,
  BoxGeometry,
  MeshStandardMaterial,
  MeshLambertMaterial,
  TorusGeometry,
  Group,
  AmbientLight,
  Color,
});

@Component({
  selector: 'box',
  standalone: true,
  template: `
    <ngt-mesh *ref="ref" ngtCompound>
      <ngt-box-geometry *args="args"></ngt-box-geometry>
      <ng-content></ng-content>
    </ngt-mesh>
  `,
  imports: [NgtArgs, NgtRef],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Box {
  static [NgtRendererFlags.COMPOUND] = true;
  @Input() args: ConstructorParameters<typeof BoxGeometry> = [];
  @Input() ref: ElementRef<Mesh> = injectNgtRef<Mesh>();
}

@Component({
  selector: 'cube',
  standalone: true,
  template: `
    <box [ref]="ref">
      <ngt-mesh-basic-material color="red"></ngt-mesh-basic-material>
    </box>
  `,
  imports: [Box],
  schemas: [NO_ERRORS_SCHEMA],
})
export class Cube {
  readonly ref = injectNgtRef<Mesh>();
}

@Component({
  selector: 'center',
  standalone: true,
  template: `
    <ngt-group ngtCompound>
      <ngt-group>
        <ngt-group *ref="ref">
          <ng-content></ng-content>
        </ngt-group>
      </ngt-group>
    </ngt-group>
  `,
  imports: [NgtRef],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Center {
  static [NgtRendererFlags.COMPOUND] = true;
  @Input() ref: ElementRef<Group> = injectNgtRef<Group>();
}

@Component({
  selector: 'two-cubes',
  standalone: true,
  template: `
    <cube></cube>
    <cube></cube>
    <center *ngIf="true">
      <cube></cube>
    </center>
  `,
  imports: [Center, Cube, NgIf],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TwoCubes {}

@Component({
  standalone: true,
  template: `
    <ngt-color *args="['skyblue']" attach="background"></ngt-color>
    <ngt-mesh>
      <ngt-torus-geometry></ngt-torus-geometry>
      <ngt-mesh-lambert-material></ngt-mesh-lambert-material>
    </ngt-mesh>

    <box>
      <ngt-mesh-basic-material></ngt-mesh-basic-material>
    </box>

    <box>
      <ngt-mesh-standard-material *ngIf="true"></ngt-mesh-standard-material>
    </box>

    <cube></cube>

    <ngt-group>
      <box>
        <ngt-mesh-standard-material></ngt-mesh-standard-material>
      </box>
    </ngt-group>

    <center>
      <box>
        <ngt-mesh-basic-material></ngt-mesh-basic-material>
      </box>
    </center>

    <ngt-group *ngIf="true">
      <box>
        <ngt-mesh-basic-material></ngt-mesh-basic-material>
      </box>
    </ngt-group>

    <center *ngIf="true">
      <box *ngIf="true">
        <ngt-mesh-basic-material *ngIf="true"></ngt-mesh-basic-material>
      </box>
    </center>

    <box *ngIf="true">
      <ngt-mesh-standard-material *ngIf="true"></ngt-mesh-standard-material>
      <cube *ngIf="true"></cube>
      <box>
        <ngt-mesh-lambert-material></ngt-mesh-lambert-material>
      </box>
    </box>

    <two-cubes></two-cubes>
  `,
  imports: [Box, NgIf, Center, Cube, TwoCubes, NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Scene {}
