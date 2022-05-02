import { NgtPhysicBody, NgtPhysicsModule } from '@angular-three/cannon';
import { NgtCanvasModule, NgtTriple } from '@angular-three/core';
import { NgtColorAttributeModule, NgtVector2AttributeModule } from '@angular-three/core/attributes';
import { NgtBoxGeometryModule, NgtPlaneGeometryModule } from '@angular-three/core/geometries';
import { NgtAmbientLightModule, NgtDirectionalLightModule } from '@angular-three/core/lights';
import { NgtMeshLambertMaterialModule, NgtShadowMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtStatsModule } from '@angular-three/core/stats';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'sandbox-physic-cubes',
  template: `
    <ngt-canvas initialLog shadows [dpr]="[1, 2]" [gl]="{ alpha: false }" [camera]="{ position: [-1, 5, 5], fov: 45 }">
      <ngt-color attach="background" color="lightblue"></ngt-color>
      <ngt-ambient-light></ngt-ambient-light>
      <ngt-directional-light [position]="10" castShadow>
        <ngt-vector2 [attach]="['shadow', 'mapSize']" [vector2]="2048"></ngt-vector2>
      </ngt-directional-light>

      <ngt-physics>
        <sandbox-plane [position]="[0, -2.5, 0]"></sandbox-plane>
        <sandbox-cube [position]="[0.1, 5, 0]"></sandbox-cube>
        <sandbox-cube [position]="[0, 10, -1]"></sandbox-cube>
        <sandbox-cube [position]="[0, 20, -2]"></sandbox-cube>
      </ngt-physics>
    </ngt-canvas>
    <ngt-stats></ngt-stats>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxPhysicCubesComponent {}

@Component({
  selector: 'sandbox-plane',
  template: `
    <ngt-mesh receiveShadow [ref]="planeRef.ref" [position]="position" [rotation]="rotation">
      <ngt-plane-geometry [args]="[1000, 1000]"></ngt-plane-geometry>
      <ngt-shadow-material color="#171717" [transparent]="true" [opacity]="0.4"></ngt-shadow-material>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgtPhysicBody],
})
export class SandboxPlaneComponent {
  @Input() position?: NgtTriple;
  rotation = [-Math.PI / 2, 0, 0] as NgtTriple;

  planeRef = this.physicBody.usePlane(() => ({
    args: [1000, 1000],
    rotation: this.rotation,
    position: this.position,
  }));

  constructor(private physicBody: NgtPhysicBody) {}
}

@Component({
  selector: 'sandbox-cube',
  template: `
    <ngt-mesh receiveShadow castShadow [ref]="boxRef.ref" [position]="position" [rotation]="rotation">
      <ngt-box-geometry></ngt-box-geometry>
      <ngt-mesh-lambert-material color="tomato"></ngt-mesh-lambert-material>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgtPhysicBody],
})
export class SandboxCubeComponent {
  @Input() position?: NgtTriple;
  rotation = [0.4, 0.2, 0.5] as NgtTriple;

  boxRef = this.physicBody.useBox(() => ({
    mass: 1,
    position: this.position,
    rotation: this.rotation,
  }));

  constructor(private physicBody: NgtPhysicBody) {}
}

@NgModule({
  declarations: [SandboxPhysicCubesComponent, SandboxPlaneComponent, SandboxCubeComponent],
  imports: [
    RouterModule.forChild([{ path: '', component: SandboxPhysicCubesComponent }]),
    NgtCanvasModule,
    NgtColorAttributeModule,
    NgtAmbientLightModule,
    NgtDirectionalLightModule,
    NgtVector2AttributeModule,
    NgtPhysicsModule,
    NgtMeshModule,
    NgtPlaneGeometryModule,
    NgtShadowMaterialModule,
    NgtBoxGeometryModule,
    NgtMeshLambertMaterialModule,
    NgtStatsModule,
  ],
})
export class SandboxPhysicCubesModule {}
