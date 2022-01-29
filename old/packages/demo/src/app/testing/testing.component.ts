import {
  EnhancedRxState,
  NgtColorPipeModule,
  NgtCoreModule,
  NgtMathPipeModule,
} from '@angular-three/core';
import {
  NgtAmbientLightModule,
  NgtPointLightModule,
} from '@angular-three/core/lights';
import {
  NgtMeshBasicMaterialModule,
  NgtMeshPhongMaterialModule,
} from '@angular-three/core/materials';
import { NgtStatsModule } from '@angular-three/core/stats';
import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls';
import {
  NGT_SOBA_DEPTH_BUFFER_PROVIDER,
  NgtSobaDepthBuffer,
} from '@angular-three/soba/misc';
import {
  NgtSobaBoxModule,
  NgtSobaPlaneModule,
} from '@angular-three/soba/shapes';
import { NgtSobaSpotLightModule } from '@angular-three/soba/staging';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-testing',
  template: `
    <ngt-canvas
      [shadows]="true"
      [camera]="{ position: [-5, 5, 5], fov: 75 }"
      [scene]="{ background: 'black' | color }"
    >
      <ngt-default-spot-light></ngt-default-spot-light>
      <ngt-soba-orbit-controls></ngt-soba-orbit-controls>
      <ngt-stats></ngt-stats>
    </ngt-canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestingComponent {}

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
      [color]="color"
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
  color = '#FF005B';

  constructor(sobaDepthBuffer: NgtSobaDepthBuffer) {
    super();
    this.connect('depthBuffer', sobaDepthBuffer.use());
  }

  ngOnInit() {
    setTimeout(() => {
      this.color = '#00fff7';
    }, 2000);
  }
}

@NgModule({
  declarations: [TestingComponent, DefaultSpotLight],
  exports: [TestingComponent],
  imports: [
    NgtCoreModule,
    NgtColorPipeModule,
    NgtStatsModule,
    NgtAmbientLightModule,
    NgtPointLightModule,
    NgtSobaOrbitControlsModule,
    NgtMeshBasicMaterialModule,
    NgtSobaBoxModule,
    NgtSobaSpotLightModule,
    NgtMeshPhongMaterialModule,
    NgtMathPipeModule,
    NgtSobaPlaneModule,
  ],
})
export class TestingComponentModule {}
