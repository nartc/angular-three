import { NgtMeshNormalMaterialModule } from '@angular-three/core/materials';
import { NgtPrimitiveModule } from '@angular-three/core/primitive';
import { NgtGLTFLoaderService } from '@angular-three/soba/loaders';
import { NgtSobaBoxModule } from '@angular-three/soba/shapes';
import { setupCanvas, setupCanvasModules } from '@angular-three/storybook';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  Story,
} from '@storybook/angular';
import * as THREE from 'three';
import { NgtSobaCenterModule } from './center.component';

@Component({
  selector: 'ngt-default-center',
  template: `
    <ng-container *ngIf="node$ | async as node">
      <ngt-soba-center [position]="[5, 5, 10]" [alignTop]="alignTop">
        <ngt-soba-box [args]="[10, 10, 10]">
          <ngt-mesh-normal-material
            [parameters]="{ wireframe: true }"
          ></ngt-mesh-normal-material>
        </ngt-soba-box>
        <ngt-primitive
          [object]="node.scene"
          [scale]="[0.01, 0.01, 0.01]"
          (animateReady)="onTokyoAnimated(node.scene)"
        ></ngt-primitive>
      </ngt-soba-center>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class DefaultCenter {
  @Input() alignTop = false;

  node$ = this.gltfLoaderService.load('/assets/LittlestTokyo.glb');

  constructor(private gltfLoaderService: NgtGLTFLoaderService) {}

  onTokyoAnimated(scene: THREE.Group) {
    scene.rotation.y += 0.01;
  }
}

@NgModule({
  declarations: [DefaultCenter],
  exports: [DefaultCenter],
  imports: [
    CommonModule,
    NgtSobaCenterModule,
    NgtSobaBoxModule,
    NgtMeshNormalMaterialModule,
    NgtPrimitiveModule,
  ],
})
class DefaultCenterModule {}

export default {
  title: 'Soba/Staging/Center',
  decorators: [
    componentWrapperDecorator(
      setupCanvas({ cameraPosition: [0, 0, -10], black: true })
    ),
    moduleMetadata({
      imports: [...setupCanvasModules, DefaultCenterModule],
    }),
  ],
} as Meta;

export const Default: Story = (args) => ({
  props: args,
  template: `
    <ngt-default-center [alignTop]='alignTop'></ngt-default-center>
  `,
});

Default.args = {
  alignTop: false,
};
