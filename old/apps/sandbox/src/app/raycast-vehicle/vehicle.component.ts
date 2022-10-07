import { NgtPhysicBody, NgtPhysicRaycastVehicle, WheelInfoOptions } from '@angular-three/cannon';
import { NgtRadianPipe, NgtTriple, Ref } from '@angular-three/core';
import { NgtValueAttribute } from '@angular-three/core/attributes';
import { NgtGroup } from '@angular-three/core/group';
import { NgtMesh } from '@angular-three/core/meshes';
import { NgtGLTFLoader } from '@angular-three/soba/loaders';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

const beetleMaterials = [
  'Black paint',
  'Black plastic',
  'Chrom',
  'Glass',
  'Headlight',
  'Interior (dark)',
  'Interior (light)',
  'License Plate',
  'Orange plastic',
  'Paint',
  'Reflector',
  'Reverse lights',
  'Rubber',
  'Steel',
  'Tail lights',
  'Underbody',
] as const;
type BeetleMaterial = typeof beetleMaterials[number];

const beetleNodes = [
  'chassis_1',
  'chassis_2',
  'chassis_3',
  'chassis_4',
  'chassis_5',
  'chassis_6',
  'chassis_7',
  'chassis_8',
  'chassis_9',
  'chassis_10',
  'chassis_11',
  'chassis_12',
  'chassis_13',
  'chassis_14',
  'chassis_15',
  'chassis_16',
] as const;
type BeetleNode = typeof beetleNodes[number];

interface BeetleGLTF extends GLTF {
  materials: Record<BeetleMaterial, THREE.Material>;
  nodes: Record<BeetleNode, THREE.Mesh>;
}

@Component({
  selector: 'sandbox-chassis[ref]',
  standalone: true,
  template: `
    <ng-container *ngIf="beetle$ | async as beetle">
      <ngt-mesh [ref]="ref" [position]="position" [rotation]="rotation">
        <ngt-group [position]="[0, -0.6, 0]">
          <ngt-mesh
            castShadow
            [material]="beetle.materials['Black paint']"
            [geometry]="beetle.nodes['chassis_1'].geometry"
          ></ngt-mesh>
          <ngt-mesh
            castShadow
            [material]="beetle.materials['Rubber']"
            [geometry]="beetle.nodes['chassis_2'].geometry"
          ></ngt-mesh>
          <ngt-mesh
            castShadow
            [material]="beetle.materials['Paint']"
            [geometry]="beetle.nodes['chassis_3'].geometry"
          ></ngt-mesh>
          <ngt-mesh
            castShadow
            [material]="beetle.materials['Underbody']"
            [geometry]="beetle.nodes['chassis_4'].geometry"
          ></ngt-mesh>
          <ngt-mesh
            castShadow
            [material]="beetle.materials['Chrom']"
            [geometry]="beetle.nodes['chassis_5'].geometry"
          ></ngt-mesh>
          <ngt-mesh
            castShadow
            [material]="beetle.materials['Interior (dark)']"
            [geometry]="beetle.nodes['chassis_6'].geometry"
          ></ngt-mesh>
          <ngt-mesh
            castShadow
            [material]="beetle.materials['Interior (light)']"
            [geometry]="beetle.nodes['chassis_7'].geometry"
          ></ngt-mesh>
          <ngt-mesh
            castShadow
            [material]="beetle.materials['Reflector']"
            [geometry]="beetle.nodes['chassis_8'].geometry"
          ></ngt-mesh>
          <ngt-mesh castShadow [material]="beetle.materials['Glass']" [geometry]="beetle.nodes['chassis_9'].geometry">
            <ngt-value [attach]="['material', 'transparent']" [value]="true"></ngt-value>
            <ngt-value [attach]="['material', 'color']" value="black"></ngt-value>
          </ngt-mesh>
          <ngt-mesh
            castShadow
            [material]="beetle.materials['Steel']"
            [geometry]="beetle.nodes['chassis_10'].geometry"
          ></ngt-mesh>
          <ngt-mesh
            castShadow
            [material]="beetle.materials['Black plastic']"
            [geometry]="beetle.nodes['chassis_11'].geometry"
          ></ngt-mesh>
          <ngt-mesh
            castShadow
            [material]="beetle.materials['Headlight']"
            [geometry]="beetle.nodes['chassis_12'].geometry"
          ></ngt-mesh>
          <ngt-mesh
            castShadow
            [material]="beetle.materials['Reverse lights']"
            [geometry]="beetle.nodes['chassis_13'].geometry"
          ></ngt-mesh>
          <ngt-mesh
            castShadow
            [material]="beetle.materials['Orange plastic']"
            [geometry]="beetle.nodes['chassis_14'].geometry"
          ></ngt-mesh>
          <ngt-mesh
            castShadow
            [material]="beetle.materials['Tail lights']"
            [geometry]="beetle.nodes['chassis_15'].geometry"
          ></ngt-mesh>
          <ngt-mesh
            castShadow
            [material]="beetle.materials['License Plate']"
            [geometry]="beetle.nodes['chassis_16'].geometry"
          ></ngt-mesh>
        </ngt-group>
      </ngt-mesh>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, AsyncPipe, NgtMesh, NgtGroup, NgtValueAttribute],
})
export class Chassis {
  @Input() ref!: Ref;
  @Input() position?: NgtTriple;
  @Input() rotation?: NgtTriple;

  readonly beetle$ = this.gltfLoader.load('assets/Beetle.glb') as Observable<BeetleGLTF>;

  constructor(private gltfLoader: NgtGLTFLoader) {}
}

interface WheelGLTF extends GLTF {
  materials: Record<'Chrom' | 'Rubber' | 'Steel', THREE.Material>;
  nodes: Record<'wheel_1' | 'wheel_2' | 'wheel_3', THREE.Mesh>;
}

@Component({
  selector: 'sandbox-wheel[ref]',
  standalone: true,
  template: `
    <ng-container *ngIf="wheel$ | async as wheel">
      <ngt-group [ref]="ref">
        <ngt-group [rotation]="[0, 0, (leftSide ? 90 : -90) | radian]">
          <ngt-mesh [material]="wheel.materials['Rubber']" [geometry]="wheel.nodes['wheel_1'].geometry"></ngt-mesh>
          <ngt-mesh [material]="wheel.materials['Steel']" [geometry]="wheel.nodes['wheel_2'].geometry"></ngt-mesh>
          <ngt-mesh [material]="wheel.materials['Chrom']" [geometry]="wheel.nodes['wheel_3'].geometry"></ngt-mesh>
        </ngt-group>
      </ngt-group>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgtPhysicBody],
  imports: [NgIf, AsyncPipe, NgtGroup, NgtMesh, NgtRadianPipe],
})
export class Wheel implements OnInit {
  @Input() ref!: Ref;
  @Input() radius = 0.7;
  @Input() leftSide = false;

  readonly wheel$ = this.gltfLoader.load('assets/wheel.glb') as Observable<WheelGLTF>;

  constructor(private gltfLoader: NgtGLTFLoader, private physicBody: NgtPhysicBody) {}

  ngOnInit() {
    this.physicBody.useCompoundBody(
      () => ({
        collisionFilterGroup: 0,
        mass: 1,
        material: 'wheel',
        shapes: [
          {
            args: [this.radius, this.radius, 0.5, 16],
            rotation: [0, 0, -Math.PI / 2],
            type: 'Cylinder',
          },
        ],
        type: 'Kinematic',
      }),
      true,
      this.ref
    );
  }
}

const keyControlMap = {
  ' ': 'brake',
  ArrowDown: 'backward',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'forward',
  r: 'reset',
} as const;

type KeyCode = keyof typeof keyControlMap;

const keyCodes = Object.keys(keyControlMap) as KeyCode[];
const isKeyCode = (v: unknown): v is KeyCode => keyCodes.includes(v as KeyCode);

@Component({
  selector: 'sandbox-vehicle',
  standalone: true,
  template: `
    <ngt-group [ref]="raycastVehicleRef.ref" [position]="[0, -0.4, 0]" (beforeRender)="onBeforeRender()">
      <sandbox-chassis [ref]="chassisRef.ref"></sandbox-chassis>
      <sandbox-wheel
        *ngFor="let wheelRef of wheels; even as isEven"
        [ref]="wheelRef"
        [radius]="radius"
        [leftSide]="isEven"
      ></sandbox-wheel>
    </ngt-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgtPhysicBody, NgtPhysicRaycastVehicle],
  imports: [NgtGroup, Chassis, Wheel, NgForOf],
})
export class Vehicle {
  @Input() position?: NgtTriple;
  @Input() rotation?: NgtTriple;
  @Input() angularVelocity?: NgtTriple;

  private readonly back = -1.15;
  private readonly force = 1500;
  private readonly front = 1.3;
  private readonly height = -0.04;
  private readonly maxBrake = 50;
  private readonly steer = 0.5;
  private readonly width = 1.2;
  readonly radius = 0.7;

  private backward = false;
  private brake = false;
  private forward = false;
  private left = false;
  private reset = false;
  private right = false;

  readonly wheelInfo: WheelInfoOptions = {
    axleLocal: [-1, 0, 0], // This is inverted for asymmetrical wheel models (left v. right sided)
    customSlidingRotationalSpeed: -30,
    dampingCompression: 4.4,
    dampingRelaxation: 10,
    directionLocal: [0, -1, 0], // set to same as Physics Gravity
    frictionSlip: 2,
    maxSuspensionForce: 1e4,
    maxSuspensionTravel: 0.3,
    radius: this.radius,
    suspensionRestLength: 0.3,
    suspensionStiffness: 30,
    useCustomSlidingRotationalSpeed: true,
  };

  readonly wheelInfo1: WheelInfoOptions = {
    ...this.wheelInfo,
    chassisConnectionPointLocal: [-this.width / 2, this.height, this.front],
    isFrontWheel: true,
  };
  readonly wheelInfo2: WheelInfoOptions = {
    ...this.wheelInfo,
    chassisConnectionPointLocal: [this.width / 2, this.height, this.front],
    isFrontWheel: true,
  };
  readonly wheelInfo3: WheelInfoOptions = {
    ...this.wheelInfo,
    chassisConnectionPointLocal: [-this.width / 2, this.height, this.back],
    isFrontWheel: false,
  };
  readonly wheelInfo4: WheelInfoOptions = {
    ...this.wheelInfo,
    chassisConnectionPointLocal: [this.width / 2, this.height, this.back],
    isFrontWheel: false,
  };

  readonly wheels = [new Ref(), new Ref(), new Ref(), new Ref()];

  readonly chassisRef = this.physicBody.useBox<THREE.Mesh>(() => ({
    allowSleep: false,
    angularVelocity: this.angularVelocity,
    args: [1.7, 1, 4],
    mass: 500,
    onCollide: (e) => console.log('bonk', e.body.userData),
    position: this.position,
    rotation: this.rotation,
  }));

  readonly raycastVehicleRef = this.physicRaycastVehicle.useRaycastVehicle(() => ({
    chassisBody: this.chassisRef.ref as Ref,
    wheelInfos: [this.wheelInfo1, this.wheelInfo2, this.wheelInfo3, this.wheelInfo4],
    wheels: this.wheels,
  }));

  constructor(private physicBody: NgtPhysicBody, private physicRaycastVehicle: NgtPhysicRaycastVehicle) {}

  @HostListener('window:keyup', ['$event'])
  private onKeyUp(event: KeyboardEvent) {
    if (!isKeyCode(event.key)) return;
    this[keyControlMap[event.key]] = false;
  }

  @HostListener('window:keydown', ['$event'])
  private onKeyDown(event: KeyboardEvent) {
    if (!isKeyCode(event.key)) return;
    this[keyControlMap[event.key]] = true;
  }

  onBeforeRender() {
    const {
      forward,
      backward,
      force,
      chassisRef,
      raycastVehicleRef,
      left,
      right,
      steer,
      brake,
      maxBrake,
      position,
      angularVelocity,
      rotation,
      reset,
    } = this;

    if (raycastVehicleRef.ref.value && chassisRef.ref.value && this.wheels.every((wheel) => wheel.value)) {
      for (let e = 2; e < 4; e++) {
        raycastVehicleRef.api.applyEngineForce(forward || backward ? force * (forward && !backward ? -1 : 1) : 0, 2);
      }

      for (let s = 0; s < 2; s++) {
        raycastVehicleRef.api.setSteeringValue(left || right ? steer * (left && !right ? 1 : -1) : 0, s);
      }

      for (let b = 2; b < 4; b++) {
        raycastVehicleRef.api.setBrake(brake ? maxBrake : 0, b);
      }

      if (reset && position && rotation && angularVelocity) {
        chassisRef.api.position.set(...position);
        chassisRef.api.velocity.set(0, 0, 0);
        chassisRef.api.angularVelocity.set(...angularVelocity);
        chassisRef.api.rotation.set(...rotation);
      }
    }
  }
}
