import { NgtCoreModule } from '@angular-three/core';
import { NgtBoxGeometryModule } from '@angular-three/core/geometries';
import {
  NgtMeshBasicMaterialModule,
  NgtMeshStandardMaterialModule,
} from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Mesh } from 'three';

@Component({
  selector: 'ngt-routed-cube',
  template: `
    <ngt-mesh #ngtMesh="ngtMesh" (animateReady)="onAnimate(ngtMesh.mesh)">
      <ngt-box-geometry></ngt-box-geometry>
      <ngt-mesh-standard-material
        [parameters]="{ color: 'pink' }"
      ></ngt-mesh-standard-material>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutedCubeComponent {
  onAnimate(mesh: Mesh) {
    mesh.rotation.x = mesh.rotation.y += 0.01;
  }
}

@NgModule({
  declarations: [RoutedCubeComponent],
  imports: [
    RouterModule.forChild([{ path: '', component: RoutedCubeComponent }]),
    NgtCoreModule,
    NgtMeshModule,
    NgtMeshBasicMaterialModule,
    NgtBoxGeometryModule,
    NgtMeshStandardMaterialModule,
  ],
})
export class RoutedCubeComponentModule {}
