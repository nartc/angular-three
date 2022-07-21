import { NgtCannonDebugModule, NgtPhysicBody, NgtPhysicsModule } from '@angular-three/cannon';
import { NgtCanvasModule, NgtRadianPipeModule, NgtTriple, UnknownRecord } from '@angular-three/core';
import {
  NgtColorAttributeModule,
  NgtFogAttributeModule,
  NgtValueAttributeModule,
} from '@angular-three/core/attributes';
import { NgtCylinderGeometryModule, NgtPlaneGeometryModule } from '@angular-three/core/geometries';
import { NgtGroupModule } from '@angular-three/core/group';
import { NgtAmbientLightModule, NgtSpotLightModule } from '@angular-three/core/lights';
import { NgtMeshNormalMaterialModule, NgtMeshStandardMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtSobaEnvironmentModule } from '@angular-three/soba/staging';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, Input, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CylinderArgs } from '@pmndrs/cannon-worker-api';
import * as THREE from 'three';
import { Chassis, Vehicle, Wheel } from './vehicle.component';

@Component({
  selector: 'sandbox-raycast-vehicle',
  template: `
    <ngt-canvas initialLog shadows [camera]="{ fov: 50, position: [0, 5, 15] }">
      <ngt-fog attach="fog" [fog]="['#171720', 10, 50]"></ngt-fog>
      <ngt-color attach="background" color="#171720"></ngt-color>

      <ngt-ambient-light intensity="0.1"></ngt-ambient-light>
      <ngt-spot-light castShadow [position]="[10, 10, 10]" angle="0.5" intensity="1" penumbra="1"></ngt-spot-light>

      <ngt-physics
        broadphase="SAP"
        [defaultContactMaterial]="{ contactEquationRelaxation: 4, friction: 1e-3 }"
        allowSleep
      >
        <sandbox-world *ngIf="isDebugDisabled; else debugEnabled"></sandbox-world>
        <ng-template #debugEnabled>
          <ngt-cannon-debug>
            <sandbox-world></sandbox-world>
          </ngt-cannon-debug>
        </ng-template>
      </ngt-physics>

      <ngt-soba-environment preset="night"></ngt-soba-environment>
    </ngt-canvas>
    <div class="instruction">
      <pre>* ↑←↓→ to drive, space to brake
        <br />r to reset
        <br />? to debug
      </pre>
    </div>
  `,
  styles: [
    `
      .instruction {
        color: white;
        font-size: 1.2em;
        left: 50px;
        position: absolute;
        top: 20px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RaycastVehicleComponent {
  isDebugDisabled = true;

  @HostListener('window:keyup', ['$event'])
  private onKeyDown(event: KeyboardEvent) {
    if (event.key === '?') {
      this.isDebugDisabled = !this.isDebugDisabled;
    }
  }
}

@Component({
  selector: 'sandbox-world',
  template: `
    <sandbox-plane [rotation]="[-90 | radian, 0, 0]" [userData]="{ id: 'floor' }"></sandbox-plane>

    <sandbox-vehicle
      [position]="[0, 2, 0]"
      [rotation]="[0, -45 | radian, 0]"
      [angularVelocity]="[0, 0.5, 0]"
    ></sandbox-vehicle>

    <sandbox-pillar [position]="[-5, 2.5, -5]" [userData]="{ id: 'pillar-1' }"></sandbox-pillar>
    <sandbox-pillar [position]="[0, 2.5, -5]" [userData]="{ id: 'pillar-2' }"></sandbox-pillar>
    <sandbox-pillar [position]="[5, 2.5, -5]" [userData]="{ id: 'pillar-3' }"></sandbox-pillar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class World {}

@Component({
  selector: 'sandbox-plane',
  template: `
    <ngt-group [ref]="planeRef.ref" [rotation]="rotation" [userData]="userData">
      <ngt-mesh receiveShadow>
        <ngt-plane-geometry [args]="[100, 100]"></ngt-plane-geometry>
        <ngt-mesh-standard-material color="#303030"></ngt-mesh-standard-material>
      </ngt-mesh>
    </ngt-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgtPhysicBody],
})
export class Plane {
  @Input() rotation?: NgtTriple;
  @Input() userData: UnknownRecord = {};

  readonly planeRef = this.physicBody.usePlane<THREE.Group>(() => ({
    material: 'ground',
    rotation: this.rotation,
    type: 'Static',
    userData: this.userData,
    args: [100, 100],
  }));

  constructor(private physicBody: NgtPhysicBody) {}
}

@Component({
  selector: 'sandbox-pillar',
  template: `
    <ngt-mesh [ref]="pillarRef.ref" [position]="position" [userData]="userData">
      <ngt-cylinder-geometry [args]="args"></ngt-cylinder-geometry>
      <ngt-mesh-normal-material></ngt-mesh-normal-material>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgtPhysicBody],
})
export class Pillar {
  @Input() position?: NgtTriple;
  @Input() userData: UnknownRecord = {};

  readonly args: CylinderArgs = [0.7, 0.7, 5, 16];

  readonly pillarRef = this.physicBody.useCylinder<THREE.Mesh>(() => ({
    args: this.args,
    mass: 10,
    position: this.position,
    userData: this.userData,
  }));

  constructor(private physicBody: NgtPhysicBody) {}
}

@NgModule({
  declarations: [RaycastVehicleComponent, Plane, Pillar, Vehicle, Chassis, Wheel, World],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: RaycastVehicleComponent,
      },
    ]),
    CommonModule,
    NgtCanvasModule,
    NgtFogAttributeModule,
    NgtColorAttributeModule,
    NgtAmbientLightModule,
    NgtSpotLightModule,
    NgtPhysicsModule,
    NgtCannonDebugModule,
    NgtGroupModule,
    NgtMeshModule,
    NgtPlaneGeometryModule,
    NgtMeshStandardMaterialModule,
    NgtRadianPipeModule,
    NgtCylinderGeometryModule,
    NgtMeshNormalMaterialModule,
    NgtSobaEnvironmentModule,
    NgtValueAttributeModule,
  ],
})
export class RaycastVehicleComponentModule {}
