import {
  CompoundBodyProps,
  GetByIndex,
  NgtCannonDebugModule,
  NgtPhysicsModule,
  PlaneProps,
} from '@angular-three/cannon';
import {
  NgtPhysicCompound,
  NgtPhysicCompoundModule,
  NgtPhysicPlaneModule,
} from '@angular-three/cannon/bodies';
import {
  NgtColorPipeModule,
  NgtCoreModule,
  NgtEuler,
  NgtMathPipeModule,
  NgtTriplet,
  NgtVector3,
  NgtVectorPipeModule,
} from '@angular-three/core';
import {
  NgtBoxGeometryModule,
  NgtPlaneGeometryModule,
  NgtSphereGeometryModule,
} from '@angular-three/core/geometries';
import { NgtGroupModule } from '@angular-three/core/group';
import {
  NgtHemisphereLightModule,
  NgtSpotLightModule,
} from '@angular-three/core/lights';
import {
  NgtMeshBasicMaterialModule,
  NgtMeshNormalMaterialModule,
  NgtShadowMaterialModule,
} from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtStatsModule } from '@angular-three/core/stats';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
} from '@angular/core';
import { mapTo, startWith, tap, timer } from 'rxjs';

@Component({
  selector: 'ngt-compound-body',
  template: `
    <ngt-canvas
      [shadows]="true"
      [camera]="{ position: [-2, 1, 7], fov: 50 }"
      [scene]="{ background: '#f6d186' | color }"
    >
      <ngt-stats></ngt-stats>
      <ngt-hemisphere-light [intensity]="0.35"></ngt-hemisphere-light>
      <ngt-spot-light
        [intensity]="2"
        [args]="[undefined, undefined, undefined, 0.3, 1]"
        [castShadow]="true"
        [position]="[5, 5, 5]"
        [shadow]="{ mapSize: [1028, 1028] | vector2 }"
      ></ngt-spot-light>

      <ngt-physics [iterations]="6" [gravity]="[0, -9.81, 0]">
        <ngt-cannon-debug [scale]="1.1" color="black">
          <ngt-plane [rotation]="[-(0.5 | mathConst: 'PI'), 0, 0]"></ngt-plane>
          <ngt-compound
            [position]="[1.5, 5, 0.5]"
            [rotation]="[1.25, 0, 0]"
          ></ngt-compound>
          <ngt-compound
            [position]="[2.5, 3, 0.25]"
            [rotation]="[1.25, -1.25, 0]"
            (positionChange)="!isCopied && (position = $event)"
            (rotationChange)="!isCopied && (rotation = $event)"
          ></ngt-compound>

          <ngt-compound
            *ngIf="ready$ | async"
            [position]="[2.5, 4, 0.25]"
            [rotation]="[1.25, -1.25, 0]"
          ></ngt-compound>

          <ngt-compound
            *ngIf="copy$ | async"
            [isTrigger]="true"
            [mass]="0"
            [position]="position"
            [rotation]="rotation"
          ></ngt-compound>
          ,
        </ngt-cannon-debug>
      </ngt-physics>
    </ngt-canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompoundBodyComponent {
  ready$ = timer(2000).pipe(mapTo(true), startWith(false));
  copy$ = timer(1000).pipe(
    tap(() => {
      this.isCopied = true;
    }),
    mapTo(true),
    startWith(false)
  );

  isCopied = false;

  position: NgtVector3 = [0, 0, 0];
  rotation: NgtEuler = [0, 0, 0];
}

@Component({
  selector: 'ngt-plane',
  template: `
    <ngt-group
      ngtPhysicPlane
      [getPhysicProps]="getPlaneProps"
      [rotation]="rotation"
    >
      <ngt-mesh>
        <ngt-plane-geometry [args]="[8, 8]"></ngt-plane-geometry>
        <ngt-mesh-basic-material
          [parameters]="{ color: '#ffb385' }"
        ></ngt-mesh-basic-material>
      </ngt-mesh>

      <ngt-mesh [receiveShadow]="true">
        <ngt-plane-geometry [args]="[8, 8]"></ngt-plane-geometry>
        <ngt-shadow-material
          [parameters]="{ color: 'lightsalmon' }"
        ></ngt-shadow-material>
      </ngt-mesh>
    </ngt-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaneComponent {
  @Input() rotation?: NgtEuler;

  getPlaneProps: GetByIndex<PlaneProps> = () => ({
    rotation: this.rotation as NgtTriplet,
    type: 'Static',
  });
}

@Component({
  selector: 'ngt-compound',
  template: `
    <ngt-group
      ngtPhysicCompound
      #ngtPhysicCompound="ngtPhysicCompound"
      (ready)="onReady(ngtPhysicCompound)"
      [getPhysicProps]="getCompoundProps"
      [position]="position"
      [rotation]="rotation"
    >
      <ngt-mesh [castShadow]="true">
        <ngt-box-geometry [args]="boxSize"></ngt-box-geometry>
        <ngt-mesh-normal-material></ngt-mesh-normal-material>
      </ngt-mesh>
      <ngt-mesh [castShadow]="true" [position]="[1, 0, 0]">
        <ngt-sphere-geometry
          [args]="[sphereRadius, 16, 16]"
        ></ngt-sphere-geometry>
        <ngt-mesh-normal-material></ngt-mesh-normal-material>
      </ngt-mesh>
    </ngt-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompoundComponent {
  @Input() isTrigger?: boolean;
  @Input() mass = 12;
  @Input() position?: NgtVector3;
  @Input() rotation?: NgtEuler;

  @Output() positionChange = new EventEmitter<NgtVector3>();
  @Output() rotationChange = new EventEmitter<NgtEuler>();

  boxSize: NgtTriplet = [1, 1, 1];
  sphereRadius = 0.65;

  #positionSubscription?: () => void;
  #rotationSubscription?: () => void;

  ngOnDestroy() {
    this.#positionSubscription?.();
    this.#rotationSubscription?.();
  }

  getCompoundProps: GetByIndex<CompoundBodyProps> = () => {
    return {
      isTrigger: this.isTrigger,
      mass: this.mass,
      position: this.position as NgtTriplet,
      rotation: this.rotation as NgtTriplet,
      shapes: [
        {
          type: 'Box',
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          args: this.boxSize,
        },
        {
          type: 'Sphere',
          position: [1, 0, 0],
          rotation: [0, 0, 0],
          args: [this.sphereRadius],
        },
      ],
    };
  };

  onReady(ngtPhysicCompound: NgtPhysicCompound) {
    if (this.positionChange.observed) {
      this.#positionSubscription = ngtPhysicCompound.api.position.subscribe(
        this.positionChange.emit.bind(this.positionChange)
      );
    }

    if (this.rotationChange.observed) {
      this.#rotationSubscription = ngtPhysicCompound.api.rotation.subscribe(
        this.rotationChange.emit.bind(this.rotationChange)
      );
    }
  }
}

@NgModule({
  declarations: [CompoundBodyComponent, PlaneComponent, CompoundComponent],
  exports: [CompoundBodyComponent],
  imports: [
    NgtCoreModule,
    NgtGroupModule,
    NgtMeshModule,
    NgtPlaneGeometryModule,
    NgtMeshBasicMaterialModule,
    NgtShadowMaterialModule,
    NgtPhysicsModule,
    NgtPhysicPlaneModule,
    NgtPhysicCompoundModule,
    NgtBoxGeometryModule,
    NgtMeshNormalMaterialModule,
    NgtSphereGeometryModule,
    NgtHemisphereLightModule,
    NgtSpotLightModule,
    NgtCannonDebugModule,
    CommonModule,
    NgtStatsModule,
    NgtColorPipeModule,
    NgtVectorPipeModule,
    NgtMathPipeModule,
  ],
})
export class CompoundBodyComponentModule {}
