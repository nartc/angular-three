import { extend, injectNgtRef, NgtArgs, NgtRef } from '@angular-three/core';
import { NgIf } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  BoxGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  PlaneGeometry,
} from 'three';

// NgtRenderNode

// 1. straight forward. THREE instances
// 2. structural directives.

/**
 * <ngt-mesh *ngIf="true">
 *   <ngt-box-geometry *args="[2, 2, 2]"></ngt-box-geometry>
 *   <ngt-mesh-basic-material *ngIf="true"></ngt-mesh-basic-material>
 * </ngt-mesh>
 */

// 3. Angular Component (w/ and w/o structural directives)
/**
 * selector: 'some-selector',
 * template: `
 *   <ngt-mesh>
 *     <ng-content></ng-content>
 *   </ngt-mesh>
 *   <some-other-component></some-other-component>
 *   <some-other-component *ngIf=""></some-other-component>
 * `
 */

// 4. THREE instances wrapping Component (w/ and w/o structural directives)
/**
 * <ngt-mesh>
 *   <some-component></some-component>
 *  </ngt-mesh>
 */

// 5. Compound Components (w/ and w/o structural directives)
/**
 * <ngt-mesh ngtCompound>
 *     </ngt-mesh>
 *     <ngt-group>
 *     </ngt-group>
 *     <some-component>
 *     <some-compound-component>
 */

/**
 * <some-compound-component [position]="[2, 2, 2]"> --> <ngt-mesh [position]="[2, 2, 2]"
 */

extend({ Mesh, BoxGeometry, PlaneGeometry, MeshBasicMaterial, MeshNormalMaterial, Group });

@Component({
  selector: 'ngts-center',
  standalone: true,
  template: `
    <ngt-group>
      <ngt-group>
        <ngt-group *ref="ref" ngtCompound>
          <ng-content></ng-content>
        </ngt-group>
      </ngt-group>
    </ngt-group>
  `,
  imports: [NgtRef],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Center {
  @Input() ref = injectNgtRef<Group>();
}

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
  @Input() ref = injectNgtRef<Mesh>();
  @Input() args: ConstructorParameters<typeof BoxGeometry> = [];
}

@Component({
  selector: 'sandbox-cube',
  standalone: true,
  template: `
    <ngts-box>
      <ng-content></ng-content>
    </ngts-box>
  `,
  imports: [Box],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Cube {}

@Component({
  selector: 'sandbox-test-scene',
  standalone: true,
  template: `
    <!-- <ngt-mesh -->
    <!-- *ref="ref" -->
    <!-- [position]="[1, 1, 1]" -->
    <!-- (click)="active = !active" -->
    <!-- [scale]="active ? 1.5 : 1" -->
    <!-- (beforeRender)="onBeforeRender()" -->
    <!-- > -->
    <!-- <ng-container *ref="geometryRef"> -->
    <!-- <ngt-box-geometry *args="[2, 2, 2]"></ngt-box-geometry> -->
    <!-- </ng-container> -->
    <!-- <ngt-mesh-basic-material -->
    <!-- *ngIf="!useNormal; else normal" -->
    <!-- color="hotpink" -->
    <!-- ></ngt-mesh-basic-material> -->
    <!-- <ng-template #normal> -->
    <!-- <ngt-mesh-normal-material></ngt-mesh-normal-material> -->
    <!-- </ng-template> -->
    <!-- </ngt-mesh> -->

    <ngts-center [position]="[1, -1, 1]">
      <ngts-box
        *ngIf="true"
        (beforeRender)="onBeforeRender($any($event).object)"
        [position]="[1, 1, 1]"
      >
        <ngt-mesh-basic-material color="red"></ngt-mesh-basic-material>
        <ngt-mesh [position]="[-2, -2, -2]">
          <ngt-box-geometry></ngt-box-geometry>
          <ngt-mesh-basic-material color="blue"></ngt-mesh-basic-material>
        </ngt-mesh>
        <ngts-box [position]="[-2, 2, -2]"></ngts-box>
      </ngts-box>
      <ngts-box [position]="[1, 1, -1]">
        <ngt-mesh-normal-material></ngt-mesh-normal-material>
        <ngts-center [position]="[-2, -2, 2]">
          <ngts-box></ngts-box>
          <ngt-mesh [position]="[-2, 0, 0]">
            <ngt-box-geometry *args="[2, 2, 2]"></ngt-box-geometry>
            <ngts-box [position]="[0, 4, 0]"></ngts-box>
          </ngt-mesh>
        </ngts-center>
      </ngts-box>
    </ngts-center>

    <!-- <ngts-center> -->
    <!-- <sandbox-cube> -->
    <!-- <ngts-box [position]="[1, 0, 1]"></ngts-box> -->
    <!-- </sandbox-cube> -->
    <!-- <sandbox-cube *ngIf="true"></sandbox-cube> -->
    <!-- </ngts-center> -->
  `,
  imports: [NgtArgs, NgtRef, NgIf, Box, Center, Cube],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Scene implements OnInit {
  readonly #cdr = inject(ChangeDetectorRef);

  useNormal = true;
  active = false;

  ngOnInit() {
    setTimeout(() => {
      this.useNormal = false;
      this.#cdr.detectChanges();
    }, 2000);
  }

  onBeforeRender(obj: Mesh) {
    obj.rotation.x += 0.01;
    obj.rotation.y += 0.01;
  }
}
