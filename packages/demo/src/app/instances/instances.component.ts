import { NgtCoreModule } from '@angular-three/core';
import { NgtInstancedBufferAttributeModule } from '@angular-three/core/attributes';
import { NgtSphereGeometryModule } from '@angular-three/core/geometries';
import {
  NgtAmbientLightModule,
  NgtDirectionalLightModule,
} from '@angular-three/core/lights';
import { NgtMeshLambertMaterialModule } from '@angular-three/core/materials';
import { NgtInstancedMeshModule } from '@angular-three/core/meshes';
import {
  NgtSobaOrbitControls,
  NgtSobaOrbitControlsModule,
} from '@angular-three/soba/controls';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
// @ts-ignore
import niceColors from 'nice-color-palettes';
import * as THREE from 'three';

const size = 125000;
const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();
const colors = new Array(size)
  .fill(undefined)
  .map(() => niceColors[17][Math.floor(Math.random() * 5)]);

const colorArray = Float32Array.from(
  new Array(size).fill(undefined).reduce((result, _, i) => {
    result.push(...tempColor.set(colors[i]).toArray());
    return result;
  }, [])
  // .flatMap((_, i) => this.tempColor.set(this.colors[i]).toArray())
);

@Component({
  selector: 'ngt-instances',
  template: `
    <ngt-canvas linear [camera]="{ position: [0, 0, 0.1] }">
      <ngt-ambient-light></ngt-ambient-light>
      <ngt-directional-light
        [intensity]="0.55"
        [position]="[150, 150, 150]"
      ></ngt-directional-light>

      <ngt-spheres></ngt-spheres>

      <ngt-soba-orbit-controls
        #sobaControls="ngtSobaOrbitControls"
        (ready)="onReady(sobaControls)"
      ></ngt-soba-orbit-controls>
    </ngt-canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstancesComponent {
  onReady(sobaControls: NgtSobaOrbitControls) {
    sobaControls.controls.autoRotate = true;
    sobaControls.controls.enablePan = false;
  }
}

@Component({
  selector: 'ngt-spheres',
  template: `
    <ngt-instanced-mesh
      #instancedMesh="ngtInstancedMesh"
      (ready)="onInstancedMeshReady(instancedMesh.mesh)"
      [args]="[size]"
    >
      <ngt-sphere-geometry [args]="[0.15, 8, 6]">
        <ngt-instanced-buffer-attribute
          attach="color"
          [args]="[colorArray, 3]"
        ></ngt-instanced-buffer-attribute>
      </ngt-sphere-geometry>
      <ngt-mesh-lambert-material
        [parameters]="{ vertexColors: true }"
      ></ngt-mesh-lambert-material>
    </ngt-instanced-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpheresComponent {
  size = size;
  colorArray = colorArray;

  onInstancedMeshReady(mesh: THREE.InstancedMesh) {
    let i = 0;
    for (let x = 0; x < 50; x++)
      for (let y = 0; y < 50; y++)
        for (let z = 0; z < 50; z++) {
          const id = i++;
          tempObject.position.set(25 - x, 25 - y, 25 - z);
          tempObject.updateMatrix();
          mesh.setMatrixAt(id, tempObject.matrix);
        }
    mesh.instanceMatrix.needsUpdate = true;
  }
}

@NgModule({
  declarations: [InstancesComponent, SpheresComponent],
  exports: [InstancesComponent],
  imports: [
    NgtCoreModule,
    NgtAmbientLightModule,
    NgtDirectionalLightModule,
    NgtInstancedMeshModule,
    NgtInstancedBufferAttributeModule,
    NgtMeshLambertMaterialModule,
    NgtSobaOrbitControlsModule,
    NgtSphereGeometryModule,
  ],
})
export class InstancesComponentModule {}
