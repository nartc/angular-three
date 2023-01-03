import { extend, NgtArgs } from '@angular-three/core';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three';

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

extend({ Mesh, BoxGeometry, MeshBasicMaterial });

@Component({
  selector: 'sandbox-test-scene',
  standalone: true,
  template: `
    <ngt-mesh>
      <ngt-box-geometry *args="[2, 2, 2]"></ngt-box-geometry>
      <ngt-mesh-basic-material></ngt-mesh-basic-material>
    </ngt-mesh>
  `,
  imports: [NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Scene {}
