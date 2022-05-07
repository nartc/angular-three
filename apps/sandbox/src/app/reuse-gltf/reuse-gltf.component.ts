import {
  AnyFunction,
  NGT_OBJECT_HOST_REF,
  NGT_OBJECT_REF,
  NgtCanvasModule,
  NgtObjectInputs,
  NgtObjectPassThroughModule,
  NgtRadianPipeModule,
  NgtStore,
  provideObjectHostRef,
  Ref,
} from '@angular-three/core';
import { NgtValueAttributeModule } from '@angular-three/core/attributes';
import { NgtSphereGeometryModule } from '@angular-three/core/geometries';
import { NgtGroupModule } from '@angular-three/core/group';
import { NgtMeshPhongMaterialModule, NgtMeshStandardMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls';
import { NgtGLTFLoader } from '@angular-three/soba/loaders';
import { NgtSobaContactShadowsModule, NgtSobaStageModule } from '@angular-three/soba/staging';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgModule, NgZone, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

@Component({
  selector: 'sandbox-reuse-gltf',
  template: `
    <ngt-canvas shadows [dpr]="[1, 2]" initialLog [camera]="{ position: [0, 0, 150], fov: 40 }">
      <ngt-soba-stage environment="city" intensity="0.6">
        <ng-template ngt-soba-stage-content>
          <sandbox-shoe color="tomato" [position]="[0, 0, 0]"></sandbox-shoe>
          <sandbox-shoe
            color="orange"
            [scale]="-1"
            [rotation]="[0, 0.5, 180 | radian]"
            [position]="[0, 0, -2]"
          ></sandbox-shoe>
        </ng-template>
      </ngt-soba-stage>

      <ngt-soba-orbit-controls autoRotate></ngt-soba-orbit-controls>
    </ngt-canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReuseGltfComponent {}

interface ShoeGLTF extends GLTF {
  nodes: {
    [key in 'shoe' | 'shoe_1' | 'shoe_2' | 'shoe_3' | 'shoe_4' | 'shoe_5' | 'shoe_6' | 'shoe_7']: THREE.Mesh;
  };
  materials: {
    [key in 'laces' | 'mesh' | 'caps' | 'inner' | 'sole' | 'stripes' | 'band' | 'patch']: THREE.MeshStandardMaterial;
  };
}

@Component({
  selector: 'sandbox-shoe',
  template: `
    <ng-container *ngIf="shoe$ | async as shoe">
      <ngt-group [ngtObjectInputs]="this" [ngtObjectOutputs]="this">
        <ngt-mesh castShadow receiveShadow [geometry]="shoe.nodes.shoe.geometry" [material]="shoe.materials.laces">
          <ngt-value [attach]="['material', 'envMapIntensity']" [value]="0.8"></ngt-value>
        </ngt-mesh>

        <ngt-mesh castShadow receiveShadow [geometry]="shoe.nodes.shoe_1.geometry">
          <ngt-mesh-standard-material
            [color]="$any(color)"
            [aoMap]="shoe.materials.mesh.aoMap"
            [normalMap]="shoe.materials.mesh.normalMap"
            [roughnessMap]="shoe.materials.mesh.roughnessMap"
            [metalnessMap]="shoe.materials.mesh.metalnessMap"
            envMapIntensity="0.8"
          >
            <ngt-value [attach]="['normalMap', 'encoding']" [value]="encoding"></ngt-value>
          </ngt-mesh-standard-material>
        </ngt-mesh>

        <ngt-mesh castShadow receiveShadow [geometry]="shoe.nodes.shoe_2.geometry" [material]="shoe.materials.caps">
          <ngt-value [attach]="['material', 'envMapIntensity']" [value]="0.8"></ngt-value>
        </ngt-mesh>
        <ngt-mesh castShadow receiveShadow [geometry]="shoe.nodes.shoe_3.geometry" [material]="shoe.materials.inner">
          <ngt-value [attach]="['material', 'envMapIntensity']" [value]="0.8"></ngt-value>
        </ngt-mesh>
        <ngt-mesh castShadow receiveShadow [geometry]="shoe.nodes.shoe_4.geometry" [material]="shoe.materials.sole">
          <ngt-value [attach]="['material', 'envMapIntensity']" [value]="0.8"></ngt-value>
        </ngt-mesh>
        <ngt-mesh castShadow receiveShadow [geometry]="shoe.nodes.shoe_5.geometry" [material]="shoe.materials.stripes">
          <ngt-value [attach]="['material', 'envMapIntensity']" [value]="0.8"></ngt-value>
        </ngt-mesh>
        <ngt-mesh castShadow receiveShadow [geometry]="shoe.nodes.shoe_6.geometry" [material]="shoe.materials.band">
          <ngt-value [attach]="['material', 'envMapIntensity']" [value]="0.8"></ngt-value>
        </ngt-mesh>
        <ngt-mesh castShadow receiveShadow [geometry]="shoe.nodes.shoe_7.geometry" [material]="shoe.materials.patch">
          <ngt-value [attach]="['material', 'envMapIntensity']" [value]="0.8"></ngt-value>
        </ngt-mesh>
      </ngt-group>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideObjectHostRef(Shoe)],
})
export class Shoe extends NgtObjectInputs<THREE.Group> {
  readonly shoe$: Observable<ShoeGLTF> = this.gltfLoader.load('assets/shoe.gltf') as Observable<ShoeGLTF>;
  readonly encoding = THREE.LinearEncoding;

  constructor(
    zone: NgZone,
    store: NgtStore,
    @Optional()
    @SkipSelf()
    @Inject(NGT_OBJECT_REF)
    parentObjectRef: AnyFunction<Ref<THREE.Object3D>>,
    @Optional()
    @SkipSelf()
    @Inject(NGT_OBJECT_HOST_REF)
    parentObjectHostRef: AnyFunction<Ref<THREE.Object3D>>,
    private gltfLoader: NgtGLTFLoader
  ) {
    super(zone, store, parentObjectRef, parentObjectHostRef);
  }
}

@NgModule({
  declarations: [ReuseGltfComponent, Shoe],
  imports: [
    RouterModule.forChild([{ path: '', component: ReuseGltfComponent }]),
    CommonModule,
    NgtGroupModule,
    NgtObjectPassThroughModule,
    NgtMeshModule,
    NgtValueAttributeModule,
    NgtMeshStandardMaterialModule,
    NgtSobaStageModule,
    NgtRadianPipeModule,
    NgtSobaOrbitControlsModule,
    NgtCanvasModule,
    NgtSphereGeometryModule,
    NgtMeshPhongMaterialModule,
    NgtSobaContactShadowsModule,
  ],
})
export class ReuseGltfComponentModule {}
