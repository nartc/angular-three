import { NgtPhysics } from '@angular-three/cannon';
import {
  NgtPhysicBodyReturn,
  NgtPhysicsBody,
  NgtPhysicsConstraint,
  NgtPhysicsConstraintReturn,
} from '@angular-three/cannon/services';
import { NgtCanvas, NgtLoader, NgtObject, NgtRef, NgtRenderState, NgtTriple, NgtVector3 } from '@angular-three/core';
import { NgtColorAttribute, NgtFogAttribute, NgtVector3Attribute } from '@angular-three/core/attributes';
import { NgtBoxGeometry, NgtConeGeometry, NgtPlaneGeometry, NgtSphereGeometry } from '@angular-three/core/geometries';
import { NgtAmbientLight, NgtPointLight, NgtSpotLight } from '@angular-three/core/lights';
import { NgtMeshBasicMaterial, NgtMeshStandardMaterial } from '@angular-three/core/materials';
import { NgtGroup, NgtMesh } from '@angular-three/core/objects';
import { AsyncPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  inject,
  Input,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { ConeTwistConstraintOpts, Triplet } from '@pmndrs/cannon-worker-api';
import { Observable, takeUntil } from 'rxjs';
import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three-stdlib';
import { createRagdoll, ShapeConfig, ShapeName } from './monday-morning.config';

const { joints, shapes } = createRagdoll(4.8, Math.PI / 16, Math.PI / 16, 0);

const double = ([x, y, z]: Readonly<Triplet>): Triplet => [x * 2, y * 2, z * 2];

const cursor = new NgtRef<THREE.Mesh>();

interface CupGLTF extends GLTF {
  materials: {
    default: THREE.Material;
    Liquid: THREE.Material;
  };
  nodes: {
    'buffer-0-mesh-0': THREE.Mesh;
    'buffer-0-mesh-0_1': THREE.Mesh;
  };
}

@Directive({
  selector: '[dragConstraint]',
  standalone: true,
  providers: [NgtPhysicsConstraint],
})
class DragConstraint implements OnInit {
  private readonly object = inject(NgtObject, { self: true });
  private readonly physicsConstraint = inject(NgtPhysicsConstraint);

  private constraint?: NgtPhysicsConstraintReturn<'PointToPoint', THREE.Mesh>;

  constructor() {
    this.object.pointerdown.pipe(takeUntil(this.object.destroy$)).subscribe((event: any) => {
      event.stopPropagation();
      event.target.setPointerCapture(event.pointerId);
      this.constraint?.api.enable();
    });
    this.object.pointerup.pipe(takeUntil(this.object.destroy$)).subscribe(() => {
      this.constraint?.api.disable();
    });
  }

  ngOnInit() {
    this.constraint = this.physicsConstraint.usePointToPointConstraint<THREE.Mesh>(cursor, this.object.instanceRef, {
      pivotA: [0, 0, 0],
      pivotB: [0, 0, 0],
    });
    this.constraint.api.disable();
  }
}

@Component({
  selector: 'box[name]',
  standalone: true,
  template: `
    <ng-container *ngIf="boxBody">
      <ngt-mesh castShadow receiveShadow dragConstraint [ref]="boxBody.ref" [name]="name" [position]="position">
        <ngt-vector3 attach="scale" [vector3]="scale"></ngt-vector3>
        <ngt-box-geometry [args]="args"></ngt-box-geometry>
        <ngt-mesh-standard-material
          [color]="shape.color"
          [opacity]="opacity"
          [transparent]="transparent"
        ></ngt-mesh-standard-material>
        <ng-container
          *ngIf="renderTemplate && name !== 'upperBody'"
          [ngTemplateOutlet]="renderTemplate"
          [ngTemplateOutletContext]="{ scale, parent: boxBody.ref }"
        ></ng-container>
      </ngt-mesh>
      <ng-container *ngIf="childTemplate" [ngTemplateOutlet]="childTemplate"></ng-container>
      <ng-content></ng-content>
    </ng-container>
  `,
  providers: [NgtPhysicsBody, NgtPhysicsConstraint],
  imports: [
    DragConstraint,
    NgtMesh,
    NgtVector3Attribute,
    NgtBoxGeometry,
    NgtMeshStandardMaterial,
    NgTemplateOutlet,
    NgIf,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class Box implements OnInit {
  @Input() position?: NgtVector3;
  @Input() args: ConstructorParameters<typeof THREE.BoxGeometry> = [1, 1, 1];
  @Input() opacity = 1;
  @Input() transparent = false;

  @Input() name!: ShapeName;
  @Input() config: ConeTwistConstraintOpts = {};

  @ContentChild('child', { read: TemplateRef })
  childTemplate?: TemplateRef<unknown>;
  @ContentChild('render', { read: TemplateRef })
  renderTemplate?: TemplateRef<unknown>;

  private readonly parentBox = inject(Box, { skipSelf: true, optional: true });
  private readonly physicsBody = inject(NgtPhysicsBody);
  private readonly physicsConstraint = inject(NgtPhysicsConstraint);

  shape!: ShapeConfig;
  scale!: NgtTriple;
  boxBody!: NgtPhysicBodyReturn<THREE.Mesh>;

  ngOnInit() {
    this.shape = shapes[this.name];
    this.scale = double(this.shape.args);
    this.boxBody = this.physicsBody.useBox<THREE.Mesh>(() => ({
      args: [...this.shape.args],
      linearDamping: 0.99,
      mass: this.shape.mass,
      position: [...this.shape.position],
    }));

    if (this.parentBox) {
      this.physicsConstraint.useConeTwistConstraint(this.boxBody.ref, this.parentBox.boxBody.ref, this.config);
    }
  }
}

@Component({
  selector: 'ragdoll',
  standalone: true,
  template: `
    <box [position]="position" name="upperBody">
      <ng-template #child>
        <box name="head" [position]="position" [config]="joints['neckJoint']">
          <ng-template #render let-scale="scale" let-parent="parent">
            <ngt-group (beforeRender)="onEyesBeforeRender($event.object, $event.state.clock)" [appendTo]="parent">
              <ngt-mesh castShadow receiveShadow [position]="[-0.3, 0.1, 0.5]">
                <ngt-vector3 attach="scale" [vector3]="scale"></ngt-vector3>
                <ngt-box-geometry [args]="[0.3, 0.01, 0.1]"></ngt-box-geometry>
                <ngt-mesh-standard-material
                  color="black"
                  [opacity]="0.8"
                  [transparent]="true"
                ></ngt-mesh-standard-material>
              </ngt-mesh>
              <ngt-mesh castShadow receiveShadow [position]="[0.3, 0.1, 0.5]">
                <ngt-vector3 attach="scale" [vector3]="scale"></ngt-vector3>
                <ngt-box-geometry [args]="[0.3, 0.01, 0.1]"></ngt-box-geometry>
                <ngt-mesh-standard-material
                  color="black"
                  [opacity]="0.8"
                  [transparent]="true"
                ></ngt-mesh-standard-material>
              </ngt-mesh>
            </ngt-group>
            <ngt-mesh
              castShadow
              receiveShadow
              [position]="[0, -0.2, 0.5]"
              (beforeRender)="onMouthBeforeRender($event.object, $event.state.clock)"
              [appendTo]="parent"
            >
              <ngt-vector3 attach="scale" [vector3]="scale"></ngt-vector3>
              <ngt-box-geometry [args]="[0.3, 0.05, 0.1]"></ngt-box-geometry>
              <ngt-mesh-standard-material
                color="black"
                [opacity]="0.8"
                [transparent]="true"
              ></ngt-mesh-standard-material>
            </ngt-mesh>
          </ng-template>
        </box>

        <box name="upperLeftArm" [config]="joints['leftShoulder']" [position]="position">
          <ng-template #child>
            <box [position]="position" name="lowerLeftArm" [config]="joints['leftElbowJoint']"></box>
          </ng-template>
        </box>

        <box name="upperRightArm" [config]="joints['rightShoulder']" [position]="position">
          <ng-template #child>
            <box [position]="position" name="lowerRightArm" [config]="joints['rightElbowJoint']"></box>
          </ng-template>
        </box>

        <box name="pelvis" [config]="joints['spineJoint']" [position]="position">
          <ng-template #child>
            <box name="upperLeftLeg" [config]="joints['leftHipJoint']" [position]="position">
              <ng-template #child>
                <box name="lowerLeftLeg" [config]="joints['leftKneeJoint']" [position]="position"></box>
              </ng-template>
            </box>

            <box name="upperRightLeg" [config]="joints['rightHipJoint']" [position]="position">
              <ng-template #child>
                <box name="lowerRightLeg" [config]="joints['rightKneeJoint']" [position]="position"></box>
              </ng-template>
            </box>
          </ng-template>
        </box>
      </ng-template>
    </box>
  `,
  imports: [Box, NgtGroup, NgtMesh, NgtVector3Attribute, NgtBoxGeometry, NgtMeshStandardMaterial],
})
class Ragdoll {
  @Input() position?: NgtVector3;
  readonly joints = joints;

  onEyesBeforeRender(object: THREE.Group, clock: THREE.Clock) {
    object.position.y = Math.sin(clock.getElapsedTime()) * 0.06;
  }

  onMouthBeforeRender(object: THREE.Mesh, clock: THREE.Clock) {
    object.scale.y = (1 + Math.sin(clock.getElapsedTime())) * 1.5;
  }
}

@Component({
  selector: 'cursor',
  standalone: true,
  template: `
    <ngt-mesh [ref]="sphereBody.ref" (beforeRender)="onCursorBeforeRender($event.state)" [position]="position">
      <ngt-sphere-geometry [args]="[radius, 32, 32]"></ngt-sphere-geometry>
      <ngt-mesh-basic-material [fog]="false" [depthTest]="false" transparent opacity="0.5"></ngt-mesh-basic-material>
    </ngt-mesh>
  `,
  providers: [NgtPhysicsBody],
  imports: [NgtMesh, NgtSphereGeometry, NgtMeshBasicMaterial],
})
class Cursor {
  readonly position = [0, 0, 10000] as Triplet;
  readonly radius = 0.5;

  readonly sphereBody = inject(NgtPhysicsBody).useSphere<THREE.Mesh>(
    () => ({
      args: [this.radius],
      position: this.position,
      type: 'Static',
    }),
    true,
    cursor
  );

  onCursorBeforeRender({ pointer, viewport: { width, height } }: NgtRenderState) {
    const x = pointer.x * width;
    const y = (pointer.y * height) / 1.9 + -x / 3.5;
    this.sphereBody.api.position.set(x / 1.4, y, 0);
  }
}

@Component({
  selector: 'chair',
  standalone: true,
  template: `
    <ngt-group dragConstraint [ref]="chairBody.ref" [position]="[-6, 0, 0]">
      <ngt-mesh [position]="[0, 0, 0]">
        <ngt-vector3 attach="scale" [vector3]="[3, 3, 0.5]"></ngt-vector3>
        <ngt-box-geometry></ngt-box-geometry>
        <ngt-mesh-standard-material></ngt-mesh-standard-material>
      </ngt-mesh>

      <ngt-mesh [position]="[0, -1.75, 1.25]">
        <ngt-vector3 attach="scale" [vector3]="[3, 0.5, 3]"></ngt-vector3>
        <ngt-box-geometry></ngt-box-geometry>
        <ngt-mesh-standard-material></ngt-mesh-standard-material>
      </ngt-mesh>

      <ngt-mesh [position]="[5 + -6.25, -3.5, 0]">
        <ngt-vector3 attach="scale" [vector3]="[0.5, 3, 0.5]"></ngt-vector3>
        <ngt-box-geometry></ngt-box-geometry>
        <ngt-mesh-standard-material></ngt-mesh-standard-material>
      </ngt-mesh>

      <ngt-mesh [position]="[5 + -3.75, -3.5, 0]">
        <ngt-vector3 attach="scale" [vector3]="[0.5, 3, 0.5]"></ngt-vector3>
        <ngt-box-geometry></ngt-box-geometry>
        <ngt-mesh-standard-material></ngt-mesh-standard-material>
      </ngt-mesh>

      <ngt-mesh [position]="[5 + -6.25, -3.5, 2.5]">
        <ngt-vector3 attach="scale" [vector3]="[0.5, 3, 0.5]"></ngt-vector3>
        <ngt-box-geometry></ngt-box-geometry>
        <ngt-mesh-standard-material></ngt-mesh-standard-material>
      </ngt-mesh>

      <ngt-mesh [position]="[5 + -3.75, -3.5, 2.5]">
        <ngt-vector3 attach="scale" [vector3]="[0.5, 3, 0.5]"></ngt-vector3>
        <ngt-box-geometry></ngt-box-geometry>
        <ngt-mesh-standard-material></ngt-mesh-standard-material>
      </ngt-mesh>
    </ngt-group>
  `,
  providers: [NgtPhysicsBody],
  imports: [NgtGroup, DragConstraint, NgtMesh, NgtVector3Attribute, NgtBoxGeometry, NgtMeshStandardMaterial],
})
class Chair {
  readonly chairBody = inject(NgtPhysicsBody).useCompoundBody<THREE.Group>(() => ({
    mass: 1,
    position: [-6, 0, 0],
    shapes: [
      {
        args: [1.5, 1.5, 0.25],
        mass: 1,
        position: [0, 0, 0],
        type: 'Box',
      },
      {
        args: [1.5, 0.25, 1.5],
        mass: 1,
        position: [0, -1.75, 1.25],
        type: 'Box',
      },
      {
        args: [0.25, 1.5, 0.25],
        mass: 10,
        position: [5 + -6.25, -3.5, 0],
        type: 'Box',
      },
      {
        args: [0.25, 1.5, 0.25],
        mass: 10,
        position: [5 + -3.75, -3.5, 0],
        type: 'Box',
      },
      {
        args: [0.25, 1.5, 0.25],
        mass: 10,
        position: [5 + -6.25, -3.5, 2.5],
        type: 'Box',
      },
      {
        args: [0.25, 1.5, 0.25],
        mass: 10,
        position: [5 + -3.75, -3.5, 2.5],
        type: 'Box',
      },
    ],
    type: 'Dynamic',
  }));
}

@Component({
  selector: 'plane',
  standalone: true,
  template: `
    <ngt-mesh receiveShadow [ref]="planeBody.ref">
      <ngt-plane-geometry [args]="args"></ngt-plane-geometry>
      <ngt-mesh-standard-material color="#171720"></ngt-mesh-standard-material>
    </ngt-mesh>
  `,
  providers: [NgtPhysicsBody],
  imports: [NgtMesh, NgtPlaneGeometry, NgtMeshStandardMaterial],
})
class Plane {
  readonly args = [1000, 1000] as [number, number];
  readonly planeBody = inject(NgtPhysicsBody).usePlane<THREE.Mesh>(() => ({
    args: this.args,
    position: [0, -5, 0],
    rotation: [-Math.PI / 2, 0, 0],
  }));
}

@Component({
  selector: 'lamp',
  standalone: true,
  template: `
    <ngt-mesh dragConstraint [ref]="lambBody.ref" [position]="position">
      <ngt-cone-geometry [args]="[2, 2.5, 32]"></ngt-cone-geometry>
      <ngt-mesh-standard-material></ngt-mesh-standard-material>
      <ngt-point-light intensity="10" distance="5"></ngt-point-light>
      <ngt-spot-light [position]="[0, 20, 0]" angle="0.4" penumbra="1" intensity="0.6" castShadow></ngt-spot-light>
    </ngt-mesh>
  `,
  providers: [NgtPhysicsBody, NgtPhysicsConstraint],
  imports: [NgtMesh, DragConstraint, NgtConeGeometry, NgtMeshStandardMaterial, NgtPointLight, NgtSpotLight],
})
class Lamp implements OnInit {
  private readonly physicsBody = inject(NgtPhysicsBody);
  private readonly physicsConstraint = inject(NgtPhysicsConstraint);
  readonly position = [0, 16, 0] as Triplet;

  readonly fixtureBody = this.physicsBody.useSphere(
    () => ({
      args: [1],
      position: this.position,
      type: 'Static',
    }),
    false
  );

  readonly lambBody = this.physicsBody.useBox<THREE.Mesh>(() => ({
    angulardamping: 1.99,
    args: [1, 0, 5],
    linearDamping: 0.9,
    mass: 1,
    position: this.position,
  }));

  ngOnInit() {
    this.physicsConstraint.usePointToPointConstraint(this.fixtureBody.ref, this.lambBody.ref, {
      pivotA: [0, 0, 0],
      pivotB: [0, 2, 0],
    });
  }
}

@Component({
  selector: 'mug',
  standalone: true,
  template: `
    <ng-container *ngIf="cup$ | async as cup">
      <ngt-group dragConstraint [ref]="mugBody.ref" [dispose]="null">
        <ngt-group [scale]="[0.01, 0.01, 0.01]">
          <ngt-mesh
            receiveShadow
            castShadow
            [material]="cup.materials.default"
            [geometry]="cup.nodes['buffer-0-mesh-0'].geometry"
          ></ngt-mesh>
          <ngt-mesh
            receiveShadow
            castShadow
            [material]="cup.materials.Liquid"
            [geometry]="cup.nodes['buffer-0-mesh-0_1'].geometry"
          ></ngt-mesh>
        </ngt-group>
      </ngt-group>
    </ng-container>
  `,
  providers: [NgtPhysicsBody],
  imports: [NgIf, AsyncPipe, NgtGroup, DragConstraint, NgtMesh],
})
class Mug {
  readonly cup$ = inject(NgtLoader).use(GLTFLoader, 'assets/cup.glb') as Observable<CupGLTF>;
  readonly mugBody = inject(NgtPhysicsBody).useCylinder<THREE.Group>(() => ({
    args: [0.6, 0.6, 1, 16],
    mass: 1,
    position: [9, 0, 0],
    rotation: [Math.PI / 2, 0, 0],
  }));
}

@Component({
  selector: 'table',
  standalone: true,
  template: `
    <ngt-mesh [ref]="seatBody.ref" [position]="[9, -0.8, 0]">
      <ngt-vector3 attach="scale" [vector3]="[5, 0.5, 5]"></ngt-vector3>
      <ngt-box-geometry></ngt-box-geometry>
      <ngt-mesh-standard-material></ngt-mesh-standard-material>
    </ngt-mesh>

    <ngt-mesh [ref]="leg1Body.ref" [position]="[7.2, -3, 1.8]">
      <ngt-vector3 attach="scale" [vector3]="[0.5, 4, 0.5]"></ngt-vector3>
      <ngt-box-geometry></ngt-box-geometry>
      <ngt-mesh-standard-material></ngt-mesh-standard-material>
    </ngt-mesh>

    <ngt-mesh [ref]="leg2Body.ref" [position]="[10.8, -3, 1.8]">
      <ngt-vector3 attach="scale" [vector3]="[0.5, 4, 0.5]"></ngt-vector3>
      <ngt-box-geometry></ngt-box-geometry>
      <ngt-mesh-standard-material></ngt-mesh-standard-material>
    </ngt-mesh>

    <ngt-mesh [ref]="leg3Body.ref" [position]="[7.2, -3, -1.8]">
      <ngt-vector3 attach="scale" [vector3]="[0.5, 4, 0.5]"></ngt-vector3>
      <ngt-box-geometry></ngt-box-geometry>
      <ngt-mesh-standard-material></ngt-mesh-standard-material>
    </ngt-mesh>

    <ngt-mesh [ref]="leg4Body.ref" [position]="[10.8, -3, -1.8]">
      <ngt-vector3 attach="scale" [vector3]="[0.5, 4, 0.5]"></ngt-vector3>
      <ngt-box-geometry></ngt-box-geometry>
      <ngt-mesh-standard-material></ngt-mesh-standard-material>
    </ngt-mesh>

    <mug></mug>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgtPhysicsBody],
  imports: [NgtMesh, NgtVector3Attribute, NgtBoxGeometry, NgtMeshStandardMaterial, Mug],
})
class Table {
  private readonly physicsBody = inject(NgtPhysicsBody);
  readonly seatBody = this.physicsBody.useBox<THREE.Mesh>(() => ({
    args: [2.5, 0.25, 2.5],
    position: [9, -0.8, 0],
    type: 'Static',
  }));
  readonly leg1Body = this.physicsBody.useBox<THREE.Mesh>(() => ({
    args: [0.25, 2, 0.25],
    position: [7.2, -3, 1.8],
    type: 'Static',
  }));
  readonly leg2Body = this.physicsBody.useBox<THREE.Mesh>(() => ({
    args: [0.25, 2, 0.25],
    position: [10.8, -3, 1.8],
    type: 'Static',
  }));
  readonly leg3Body = this.physicsBody.useBox<THREE.Mesh>(() => ({
    args: [0.25, 2, 0.25],
    position: [7.2, -3, -1.8],
    type: 'Static',
  }));
  readonly leg4Body = this.physicsBody.useBox<THREE.Mesh>(() => ({
    args: [0.25, 2, 0.25],
    position: [10.8, -3, -1.8],
    type: 'Static',
  }));
}

@Component({
  selector: 'scene',
  standalone: true,
  template: `
    <ngt-ambient-light intensity="0.2"></ngt-ambient-light>
    <ngt-point-light [position]="[-10, -10, -10]" color="red" intensity="1.5"></ngt-point-light>

    <ngt-physics iterations="15" [gravity]="[0, -200, 0]" [allowSleep]="false">
      <cursor></cursor>
      <ragdoll [position]="[0, 0, 0]"></ragdoll>
      <plane></plane>
      <chair></chair>
      <table></table>
      <lamp></lamp>
    </ngt-physics>
  `,
  imports: [NgtAmbientLight, NgtPointLight, NgtPhysics, Cursor, Ragdoll, Plane, Chair, Table, Lamp],
})
class Scene {}

@Component({
  selector: 'monday-morning',
  standalone: true,
  template: `
    <ngt-canvas
      [camera]="{ far: 100, near: 1, position: [-25, 20, 25], zoom: 25 }"
      orthographic
      shadows
      initialLog
      style="cursor: none"
    >
      <ngt-color attach="background" color="#171720"></ngt-color>
      <ngt-fog attach="fog" [fog]="['#171720', 20, 70]"></ngt-fog>

      <scene></scene>
    </ngt-canvas>
  `,
  imports: [NgtCanvas, NgtColorAttribute, NgtFogAttribute, Scene],
})
export default class SandboxMondayMorning {}
