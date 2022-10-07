import { make, NgtRadianPipeModule, NgtRenderState, NgtVector2 } from '@angular-three/core';
import {
  NgtBoxGeometryModule,
  NgtPlaneGeometryModule,
  NgtTorusKnotGeometryModule,
} from '@angular-three/core/geometries';
import { NgtSpotLightModule } from '@angular-three/core/lights';
import { NgtMeshPhysicalMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtTextureLoader } from '@angular-three/soba/loaders';
import { NgtSobaMeshReflectorMaterialModule } from '@angular-three/soba/shaders';
import { NgtSobaEnvironmentModule } from '@angular-three/soba/staging';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { tap } from 'rxjs';
import * as THREE from 'three';
import { Mesh } from 'three';
import { setupCanvas, setupCanvasModules } from '../setup-canvas';

/**
 * <Box args={[2, 3, 0.2]} position={[0, 1.6, -3]}>
 *         <meshPhysicalMaterial color="hotpink" />
 *       </Box>
 *       <TorusKnot args={[0.5, 0.2, 128, 32]} ref={$box} position={[0, 1, 0]}>
 *         <meshPhysicalMaterial color="hotpink" />
 *       </TorusKnot>
 *       <spotLight intensity={1} position={[10, 6, 10]} penumbra={1} angle={0.3} />
 *       <Environment preset="city" />
 */

@Component({
  selector: 'reflector-story',
  template: `
    <ngt-mesh [rotation]="[-90 | radian, 0, 90 | radian]">
      <ngt-plane-geometry [args]="[10, 10]"></ngt-plane-geometry>
      <ngt-soba-mesh-reflector-material
        resolution="1024"
        mirror="0.75"
        mixBlur="10"
        mixStrength="2"
        minDepthThreshold="0.8"
        maxDepthThreshold="1.2"
        depthToBlurRatioBias="0.2"
        color="#a0a0a0"
        metalness="0.5"
        roughness="1"
        [reflectorOffset]="reflectorOffset"
        [normalScale]="normalScale"
        [normalMap]="(normal$ | async)!"
        [roughnessMap]="(roughness$ | async)!"
        [distortion]="distortion || 0"
        [distortionMap]="(distortionMap$ | async)!"
        [blur]="blur || [0, 0]"
        [depthScale]="depthScale || 0"
      ></ngt-soba-mesh-reflector-material>
    </ngt-mesh>

    <ngt-mesh [position]="[0, 1.6, -3]">
      <ngt-box-geometry [args]="[2, 3, 0.2]"></ngt-box-geometry>
      <ngt-mesh-physical-material color="tomato"></ngt-mesh-physical-material>
    </ngt-mesh>

    <ngt-mesh [position]="[0, 1, 0]" (beforeRender)="onBeforeRender($event.state, $event.object)">
      <ngt-torus-knot-geometry [args]="[0.5, 0.2, 128, 32]"></ngt-torus-knot-geometry>
      <ngt-mesh-physical-material color="tomato"></ngt-mesh-physical-material>
    </ngt-mesh>

    <ngt-spot-light intensity="1" [position]="[10, 6, 10]" penumbra="1" angle="0.3"></ngt-spot-light>
    <ngt-soba-environment preset="city"></ngt-soba-environment>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgtTextureLoader],
})
class ReflectorStory {
  @Input() blur?: [number, number];
  @Input() depthScale?: number;
  @Input() distortion?: number;
  @Input() reflectorOffset?: number;

  @Input() set normalScale(normalScale: NgtVector2) {
    this._normalScale = make(THREE.Vector2, normalScale);
  }
  get normalScale(): THREE.Vector2 {
    return this._normalScale;
  }
  private _normalScale = new THREE.Vector2(0);

  readonly roughness$ = this.textureLoader.load('soba/roughness_floor.jpeg');
  readonly normal$ = this.textureLoader.load('soba/NORM.jpg');
  readonly distortionMap$ = this.textureLoader.load('soba/dist_map.jpeg').pipe(
    tap((distortionMap) => {
      distortionMap.wrapS = distortionMap.wrapT = THREE.RepeatWrapping;
      distortionMap.repeat.set(4, 4);
    })
  );

  constructor(private textureLoader: NgtTextureLoader) {}

  onBeforeRender(state: NgtRenderState, mesh: Mesh) {
    mesh.position.y += Math.sin(state.clock.getElapsedTime()) / 25;
    mesh.rotation.y = state.clock.getElapsedTime() / 2;
  }
}

@NgModule({
  declarations: [ReflectorStory],
  exports: [ReflectorStory],
  imports: [
    CommonModule,
    FormsModule,
    NgtMeshModule,
    NgtRadianPipeModule,
    NgtPlaneGeometryModule,
    NgtSobaMeshReflectorMaterialModule,
    NgtBoxGeometryModule,
    NgtMeshPhysicalMaterialModule,
    NgtTorusKnotGeometryModule,
    NgtSpotLightModule,
    NgtSobaEnvironmentModule,
  ],
})
class ReflectorStoryModule {}

export default {
  title: 'Shaders/MeshReflectorMaterial',
  decorators: [
    componentWrapperDecorator(setupCanvas({ cameraFov: 20, cameraPosition: [-2, 2, 6] })),
    moduleMetadata({
      imports: [...setupCanvasModules, ReflectorStoryModule],
    }),
  ],
} as Meta;

export const Default: Story = () => ({
  template: `
        <reflector-story [blur]="[100, 500]" [depthScale]="2" [distortion]="0.3" [normalScale]="0.5"></reflector-story>
    `,
});
