import { NgtPhysicBody, NgtPhysics } from '@angular-three/cannon';
import { NgtCanvas, NgtTriple } from '@angular-three/core';
import { NgtColorAttribute, NgtVector2Attribute } from '@angular-three/core/attributes';
import { NgtBoxGeometry, NgtPlaneGeometry } from '@angular-three/core/geometries';
import { NgtAmbientLight, NgtDirectionalLight } from '@angular-three/core/lights';
import { NgtMeshLambertMaterial, NgtShadowMaterial } from '@angular-three/core/materials';
import { NgtMesh } from '@angular-three/core/meshes';
import { NgtStats } from '@angular-three/core/stats';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'sandbox-floor',
  standalone: true,
  template: `
    <ngt-mesh receiveShadow [ref]="planeRef.ref" [position]="position" [rotation]="rotation">
      <ngt-plane-geometry [args]="[1000, 1000]"></ngt-plane-geometry>
      <ngt-shadow-material color="#171717" [transparent]="true" [opacity]="0.4"></ngt-shadow-material>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgtPhysicBody],
  imports: [NgtMesh, NgtPlaneGeometry, NgtShadowMaterial],
})
export class Floor {
  @Input() position?: NgtTriple;
  rotation = [-Math.PI / 2, 0, 0] as NgtTriple;

  readonly planeRef = this.physicBody.usePlane<THREE.Mesh>(() => ({
    args: [1000, 1000],
    rotation: this.rotation,
    position: this.position,
  }));

  constructor(private physicBody: NgtPhysicBody) {}
}

@Component({
  selector: 'sandbox-cube',
  standalone: true,
  template: `
    <ngt-mesh receiveShadow castShadow [ref]="boxRef.ref" [position]="position" [rotation]="rotation">
      <ngt-box-geometry></ngt-box-geometry>
      <ngt-mesh-lambert-material color="tomato"></ngt-mesh-lambert-material>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgtPhysicBody],
  imports: [NgtMesh, NgtBoxGeometry, NgtMeshLambertMaterial],
})
export class Cube {
  @Input() position?: NgtTriple;
  rotation = [0.4, 0.2, 0.5] as NgtTriple;

  readonly boxRef = this.physicBody.useBox<THREE.Mesh>(() => ({
    mass: 1,
    position: this.position,
    rotation: this.rotation,
  }));

  constructor(private physicBody: NgtPhysicBody) {}
}

@Component({
  selector: 'sandbox-physic-cubes',
  standalone: true,
  template: `
    <ngt-canvas initialLog shadows [dpr]="[1, 2]" [gl]="{ alpha: false }" [camera]="{ position: [-1, 5, 5], fov: 45 }">
      <ngt-color attach="background" color="lightblue"></ngt-color>
      <ngt-ambient-light></ngt-ambient-light>
      <ngt-directional-light [position]="10" castShadow>
        <ngt-vector2 [attach]="['shadow', 'mapSize']" [vector2]="2048"></ngt-vector2>
      </ngt-directional-light>

      <ngt-physics>
        <sandbox-floor [position]="[0, -2.5, 0]"></sandbox-floor>
        <sandbox-cube [position]="[0.1, 5, 0]"></sandbox-cube>
        <sandbox-cube [position]="[0, 10, -1]"></sandbox-cube>
        <sandbox-cube [position]="[0, 20, -2]"></sandbox-cube>
      </ngt-physics>
    </ngt-canvas>
    <ngt-stats></ngt-stats>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgtCanvas,
    NgtColorAttribute,
    NgtAmbientLight,
    NgtDirectionalLight,
    NgtVector2Attribute,
    NgtPhysics,
    Floor,
    Cube,
    NgtStats,
  ],
})
export class SandboxPhysicCubesComponent {}
