import { NgtRadianPipeModule, providePerformanceOptions } from '@angular-three/core';
import { NgtValueAttributeModule, NgtVector2AttributeModule } from '@angular-three/core/attributes';
import { NgtGroupModule } from '@angular-three/core/group';
import { NgtDirectionalLightModule } from '@angular-three/core/lights';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls';
import { NgtGLTFLoader } from '@angular-three/soba/loaders';
import { NgtSobaAdapativeDprModule, NgtSobaAdaptiveEventsModule } from '@angular-three/soba/performances';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { Observable } from 'rxjs';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';
import { setupCanvas, setupCanvasModules } from '../setup-canvas';

interface ArcherGLTF extends GLTF {
  materials: { material_0: THREE.Material };
  nodes: Record<'mesh_0' | 'mesh_1' | 'mesh_2', THREE.Mesh>;
}

@Component({
  selector: 'default-archer',
  template: `
    <ng-container *ngIf="archer$ | async as archer">
      <ngt-group [dispose]="null">
        <ngt-group [rotation]="[-90 | radian, 0, 0]">
          <ngt-group [position]="[0, 0, 2]">
            <ngt-mesh
              castShadow
              receiveShadow
              [material]="archer.materials.material_0"
              [geometry]="archer.nodes['mesh_0'].geometry"
            ></ngt-mesh>
            <ngt-mesh
              castShadow
              receiveShadow
              [material]="archer.materials.material_0"
              [geometry]="archer.nodes['mesh_1'].geometry"
            ></ngt-mesh>
            <ngt-mesh
              castShadow
              receiveShadow
              [material]="archer.materials.material_0"
              [geometry]="archer.nodes['mesh_2'].geometry"
            ></ngt-mesh>
          </ngt-group>
        </ngt-group>
      </ngt-group>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class DefaultArcher {
  readonly archer$ = this.gltfLoader.load('soba/archer.glb') as Observable<ArcherGLTF>;

  constructor(private gltfLoader: NgtGLTFLoader) {}
}

@Component({
  selector: 'default-adaptive-story',
  template: `
    <default-archer></default-archer>
    <ngt-directional-light intensity="0.2" [position]="[10, 10, 5]" castShadow>
      <ngt-vector2 [attach]="['shadow', 'mapSize']" [vector2]="[64, 64]"></ngt-vector2>
      <ngt-value [attach]="['shadow', 'bias']" [value]="-0.001"></ngt-value>
    </ngt-directional-light>
    <ngt-soba-adaptive-dpr pixelated></ngt-soba-adaptive-dpr>
    <ngt-soba-adaptive-events></ngt-soba-adaptive-events>
    <ngt-soba-orbit-controls regress></ngt-soba-orbit-controls>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class DefaultAdaptiveStory {}

@NgModule({
  declarations: [DefaultAdaptiveStory, DefaultArcher],
  exports: [DefaultAdaptiveStory],
  imports: [
    CommonModule,
    NgtGroupModule,
    NgtRadianPipeModule,
    NgtMeshModule,
    NgtDirectionalLightModule,
    NgtVector2AttributeModule,
    NgtValueAttributeModule,
    NgtSobaAdapativeDprModule,
    NgtSobaAdaptiveEventsModule,
    NgtSobaOrbitControlsModule,
  ],
})
class DefaultAdaptiveStoryModule {}

export default {
  title: 'Performances/Adaptive DPR',
  decorators: [
    componentWrapperDecorator(
      setupCanvas({ cameraPosition: [0, 0, 30], cameraFov: 50, controls: false, lights: false })
    ),
    moduleMetadata({
      imports: [...setupCanvasModules, DefaultAdaptiveStoryModule],
      providers: [providePerformanceOptions({ min: 0.2 })],
    }),
  ],
} as Meta;

export const Default: Story = () => ({
  template: `
    <default-adaptive-story></default-adaptive-story>
  `,
});
