import { NgtBoxGeometry } from '@angular-three/core/geometries';
import { NgtMeshNormalMaterial } from '@angular-three/core/materials';
import { NgtMesh } from '@angular-three/core/objects';
import { NgtObjectPrimitive } from '@angular-three/core/primitives';
import { NgtGLTFLoader } from '@angular-three/soba/loaders';
import { NgtSobaCenter } from '@angular-three/soba/staging';
import { AsyncPipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  Story,
} from '@storybook/angular';
import * as THREE from 'three';
import { setupCanvas, setupCanvasImports } from '../setup-canvas';

@Component({
  selector: 'storybook-default-center',
  standalone: true,
  template: `
    <ng-container *ngIf="node$ | async as node">
      <ngt-soba-center [position]="[5, 5, 10]" [alignTop]="alignTop">
        <ngt-mesh>
          <ngt-box-geometry [args]="[10, 10, 10]"></ngt-box-geometry>
          <ngt-mesh-normal-material wireframe></ngt-mesh-normal-material>
        </ngt-mesh>
        <ngt-object-primitive
          [object]="node.scene"
          [scale]="[0.01, 0.01, 0.01]"
          (beforeRender)="onTokyoAnimated($event.object)"
        ></ngt-object-primitive>
      </ngt-soba-center>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgtSobaCenter,
    NgIf,
    AsyncPipe,
    NgtMesh,
    NgtBoxGeometry,
    NgtMeshNormalMaterial,
    NgtObjectPrimitive,
  ],
})
class DefaultCenter {
  @Input() alignTop = false;

  readonly node$ = inject(NgtGLTFLoader).load('soba/assets/LittlestTokyo.glb');

  onTokyoAnimated(scene: THREE.Group) {
    scene.rotation.y += 0.01;
  }
}

export default {
  title: 'Staging/Center',
  decorators: [
    componentWrapperDecorator(
      setupCanvas({ camera: { position: [0, 0, -10] } })
    ),
    moduleMetadata({
      imports: [setupCanvasImports, DefaultCenter],
    }),
  ],
} as Meta;

export const Default: Story = (args) => ({
  props: args,
  template: `
<storybook-default-center [alignTop]="alignTop"></storybook-default-center>
  `,
});

Default.args = {
  alignTop: false,
};
