import { NgtComponentStore, NgtPortalModule, NgtStore, prepare, Ref, tapEffect } from '@angular-three/core';
import { NgtColorAttributeModule } from '@angular-three/core/attributes';
import { NgtBoxGeometryModule, NgtPlaneGeometryModule } from '@angular-three/core/geometries';
import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls';
import { NgtSobaFBO } from '@angular-three/soba/misc';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule, NgZone, OnInit } from '@angular/core';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import * as THREE from 'three';
import { NgtSobaPerspectiveCameraModule } from '../../cameras/src';
import { setupCanvas, setupCanvasModules } from '../setup-canvas';

@Component({
  selector: 'custom-camera-story',
  template: `
    <ngt-mesh>
      <ngt-plane-geometry [args]="[4, 4, 4]"></ngt-plane-geometry>
      <ngt-mesh-basic-material [map]="(fboRef | async)?.texture"></ngt-mesh-basic-material>
    </ngt-mesh>

    <ngt-portal [ref]="virtualScene">
      <ng-template ngt-portal-content>
        <ngt-mesh>
          <ngt-box-geometry></ngt-box-geometry>
          <ngt-mesh-basic-material wireframe></ngt-mesh-basic-material>
        </ngt-mesh>

        <ngt-soba-perspective-camera
          name="FBO Camera"
          [ref]="virtualCamera"
          [position]="[0, 0, 5]"
        ></ngt-soba-perspective-camera>
        <ngt-soba-orbit-controls [camera]="virtualCamera.value"></ngt-soba-orbit-controls>

        <ngt-color attach="background" color="blue"></ngt-color>
      </ng-template>
    </ngt-portal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgtSobaFBO],
})
class CustomCameraStory extends NgtComponentStore implements OnInit {
  fboRef = this.fbo.use(() => ({ width: 400, height: 400 }));

  virtualScene = new Ref(prepare(new THREE.Scene(), () => this.store.get()));
  virtualCamera = new Ref<THREE.PerspectiveCamera>();

  constructor(private fbo: NgtSobaFBO, private store: NgtStore, private zone: NgZone) {
    super();
  }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.onCanvasReady(this.store.ready$, () => {
        this.setBeforeRender();
      });
    });
  }

  private readonly setBeforeRender = this.effect<void>(
    tapEffect(() => {
      const unregister = this.store.registerBeforeRender({
        callback: ({ gl }) => {
          if (this.virtualCamera.value && this.fboRef.value) {
            gl.setRenderTarget(this.fboRef.value);
            gl.render(this.virtualScene.value, this.virtualCamera.value);

            gl.setRenderTarget(null);
          }
        },
      });

      return () => {
        unregister();
      };
    })
  );
}

@NgModule({
  declarations: [CustomCameraStory],
  exports: [CustomCameraStory],
  imports: [
    CommonModule,
    NgtMeshModule,
    NgtPlaneGeometryModule,
    NgtMeshBasicMaterialModule,
    NgtPortalModule,
    NgtBoxGeometryModule,
    NgtSobaPerspectiveCameraModule,
    NgtSobaOrbitControlsModule,
    NgtColorAttributeModule,
  ],
})
class CustomCameraStoryModule {}

export default {
  title: 'Controls/Orbit Controls',
  decorators: [
    componentWrapperDecorator(setupCanvas({ controls: false })),
    moduleMetadata({
      imports: [
        ...setupCanvasModules,
        NgtSobaOrbitControlsModule,
        NgtMeshModule,
        NgtBoxGeometryModule,
        NgtMeshBasicMaterialModule,
        CustomCameraStoryModule,
      ],
    }),
  ],
} as Meta;

export const Default: Story = () => ({
  template: `
        <ngt-soba-orbit-controls></ngt-soba-orbit-controls>
        <ngt-mesh>
            <ngt-box-geometry></ngt-box-geometry>
            <ngt-mesh-basic-material wireframe></ngt-mesh-basic-material>
        </ngt-mesh>
    `,
});

export const CustomCamera: Story = () => ({
  template: `<custom-camera-story></custom-camera-story>`,
});
