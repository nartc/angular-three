import {
  EnhancedRxState,
  NGT_CANVAS_OPTIONS,
  NgtMathPipeModule,
  provideCanvasOptions,
} from '@angular-three/core';
import { NgtMeshPhongMaterialModule } from '@angular-three/core/materials';
import {
  NGT_SOBA_DEPTH_BUFFER_PROVIDER,
  NgtSobaDepthBuffer,
} from '@angular-three/soba/misc';
import {
  NgtSobaBoxModule,
  NgtSobaPlaneModule,
} from '@angular-three/soba/shapes';
import { setupCanvas, setupCanvasModules } from '@angular-three/storybook';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  Story,
} from '@storybook/angular';
import * as THREE from 'three';
import { NgtSobaSpotLightModule } from './spot-light.component';

@Component({
  selector: 'ngt-default-spot-light',
  template: `
    <ngt-soba-spot-light
      [penumbra]="0.5"
      [position]="[-3, 2, 0]"
      [intensity]="0.5"
      [angle]="0.5"
      color="#0EEC82"
      [castShadow]="true"
      [depthBuffer]="get('depthBuffer')"
    ></ngt-soba-spot-light>

    <ngt-soba-spot-light
      [penumbra]="0.5"
      [position]="[3, 2, 0]"
      [intensity]="0.5"
      [angle]="0.5"
      color="#FF005B"
      [castShadow]="true"
      [depthBuffer]="get('depthBuffer')"
    ></ngt-soba-spot-light>

    <ngt-soba-box [position]="[0, 0.5, 0]" [castShadow]="true">
      <ngt-mesh-phong-material></ngt-mesh-phong-material>
    </ngt-soba-box>

    <ngt-soba-plane
      [receiveShadow]="true"
      [rotation]="[-0.5 | mathConst: 'PI', 0, 0]"
      [args]="[100, 100]"
    >
      <ngt-mesh-phong-material></ngt-mesh-phong-material>
    </ngt-soba-plane>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NGT_SOBA_DEPTH_BUFFER_PROVIDER],
})
class DefaultSpotLight extends EnhancedRxState<{
  depthBuffer: THREE.DepthTexture;
}> {
  constructor(sobaDepthBuffer: NgtSobaDepthBuffer) {
    super();
    this.connect('depthBuffer', sobaDepthBuffer.use());
  }
}

@NgModule({
  declarations: [DefaultSpotLight],
  exports: [DefaultSpotLight],
  imports: [
    NgtSobaSpotLightModule,
    NgtMeshPhongMaterialModule,
    NgtMathPipeModule,
    NgtSobaPlaneModule,
    NgtSobaBoxModule,
    CommonModule,
  ],
})
class DefaultSpotLightModule {}

export default {
  title: 'Soba/Staging/Spot Light',
  decorators: [
    componentWrapperDecorator(setupCanvas({ black: true, lights: false })),
    moduleMetadata({
      imports: [...setupCanvasModules, DefaultSpotLightModule],
      providers: [
        {
          provide: NGT_CANVAS_OPTIONS,
          useValue: provideCanvasOptions({ projectContent: true }),
        },
      ],
    }),
  ],
} as Meta;

export const Default: Story = (args) => ({
  props: args,
  template: `
    <ngt-default-spot-light></ngt-default-spot-light>
  `,
});
