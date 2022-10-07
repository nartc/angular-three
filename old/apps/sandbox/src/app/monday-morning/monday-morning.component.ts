import {
  ConeTwistConstraintOpts,
  NgtPhysicBody,
  NgtPhysicBodyReturn,
  NgtPhysicConstraint,
  NgtPhysicConstraintReturn,
  NgtPhysics,
} from '@angular-three/cannon';
import { NgtCanvas, NgtLoader, NgtObject, NgtRenderState, NgtTriple, NgtVector3, Ref } from '@angular-three/core';
import { NgtColorAttribute, NgtFogAttribute, NgtVector3Attribute } from '@angular-three/core/attributes';
import { NgtBoxGeometry, NgtConeGeometry, NgtPlaneGeometry, NgtSphereGeometry } from '@angular-three/core/geometries';
import { NgtGroup } from '@angular-three/core/group';
import { NgtAmbientLight, NgtPointLight, NgtSpotLight } from '@angular-three/core/lights';
import { NgtMeshBasicMaterial, NgtMeshStandardMaterial } from '@angular-three/core/materials';
import { NgtMesh } from '@angular-three/core/meshes';
import { AsyncPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  Input,
  OnInit,
  Optional,
  Self,
  SkipSelf,
  TemplateRef,
} from '@angular/core';
import { Observable, takeUntil } from 'rxjs';
import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three-stdlib';
import { createRagdoll, ShapeConfig, ShapeName } from './monday-morning.config';

const { joints, shapes } = createRagdoll(4.8, Math.PI / 16, Math.PI / 16, 0);

const double = ([x, y, z]: Readonly<NgtTriple>): NgtTriple => [x * 2, y * 2, z * 2];

const cursor = new Ref<THREE.Mesh>();

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
  selector: '[sandboxDragConstraint]',
  standalone: true,
  providers: [NgtPhysicConstraint],
})
export class DragConstraint implements OnInit {
  private constraint!: NgtPhysicConstraintReturn<'PointToPoint', THREE.Mesh>;

  constructor(
    private physicConstraint: NgtPhysicConstraint,
    @Self()
    private object: NgtObject
  ) {
    object.pointerdown.pipe(takeUntil(object.destroy$)).subscribe((event: any) => {
      event.stopPropagation();
      event.target.setPointerCapture(event.pointerId);
      this.constraint.api.enable();
    });
    object.pointerup.pipe(takeUntil(object.destroy$)).subscribe(() => {
      this.constraint.api.disable();
    });
  }

  ngOnInit() {
    this.constraint = this.physicConstraint.usePointToPointConstraint<THREE.Mesh>(cursor, this.object.instance, {
      pivotA: [0, 0, 0],
      pivotB: [0, 0, 0],
    });
    this.constraint.api.disable();
  }
}

@Component({
  selector: 'sandbox-box[name]',
  standalone: true,
  template: `
    <ng-container *ngIf="boxRef">
      <ngt-mesh castShadow receiveShadow sandboxDragConstraint [ref]="boxRef.ref" [name]="name" [position]="position">
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
          [ngTemplateOutletContext]="{ scale, parent: boxRef.ref }"
        ></ng-container>
      </ngt-mesh>
      <ng-container *ngIf="childTemplate" [ngTemplateOutlet]="childTemplate"></ng-container>
      <ng-content></ng-content>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgtPhysicBody, NgtPhysicConstraint],
  imports: [
    NgtMesh,
    NgIf,
    DragConstraint,
    NgtVector3Attribute,
    NgtBoxGeometry,
    NgtMeshStandardMaterial,
    NgTemplateOutlet,
  ],
})
export class Box implements OnInit {
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

  shape!: ShapeConfig;
  scale!: NgtTriple;
  boxRef!: NgtPhysicBodyReturn<THREE.Mesh>;

  constructor(
    @Optional()
    @SkipSelf()
    private parentBox: Box,
    private physicBody: NgtPhysicBody,
    private physicConstraint: NgtPhysicConstraint
  ) {}

  ngOnInit() {
    this.shape = shapes[this.name];
    this.scale = double(this.shape.args);
    this.boxRef = this.physicBody.useBox<THREE.Mesh>(() => ({
      args: [...this.shape.args],
      linearDamping: 0.99,
      mass: this.shape.mass,
      position: [...this.shape.position],
    }));
    if (this.parentBox) {
      this.physicConstraint.useConeTwistConstraint(this.boxRef.ref, this.parentBox.boxRef.ref, this.config);
    }
  }
}

@Component({
  selector: 'sandbox-ragdoll',
  standalone: true,
  template: `
    <sandbox-box [position]="position" name="upperBody">
      <ng-template #child>
        <sandbox-box name="head" [position]="position" [config]="joints['neckJoint']">
          <ng-template #render let-scale="scale" let-parent="parent">
            <ngt-group (beforeRender)="onEyesBeforeRender($event)" [appendTo]="parent">
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
              (beforeRender)="onMouthBeforeRender($event)"
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
        </sandbox-box>

        <sandbox-box name="upperLeftArm" [config]="joints['leftShoulder']" [position]="position">
          <ng-template #child>
            <sandbox-box [position]="position" name="lowerLeftArm" [config]="joints['leftElbowJoint']"></sandbox-box>
          </ng-template>
        </sandbox-box>

        <sandbox-box name="upperRightArm" [config]="joints['rightShoulder']" [position]="position">
          <ng-template #child>
            <sandbox-box [position]="position" name="lowerRightArm" [config]="joints['rightElbowJoint']"></sandbox-box>
          </ng-template>
        </sandbox-box>

        <sandbox-box name="pelvis" [config]="joints['spineJoint']" [position]="position">
          <ng-template #child>
            <sandbox-box name="upperLeftLeg" [config]="joints['leftHipJoint']" [position]="position">
              <ng-template #child>
                <sandbox-box name="lowerLeftLeg" [config]="joints['leftKneeJoint']" [position]="position"></sandbox-box>
              </ng-template>
            </sandbox-box>

            <sandbox-box name="upperRightLeg" [config]="joints['rightHipJoint']" [position]="position">
              <ng-template #child>
                <sandbox-box
                  name="lowerRightLeg"
                  [config]="joints['rightKneeJoint']"
                  [position]="position"
                ></sandbox-box>
              </ng-template>
            </sandbox-box>
          </ng-template>
        </sandbox-box>
      </ng-template>
    </sandbox-box>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Box, NgtGroup, NgtMesh, NgtVector3Attribute, NgtBoxGeometry, NgtMeshStandardMaterial],
})
export class Ragdoll {
  @Input() position?: NgtVector3;
  readonly joints = joints;

  onEyesBeforeRender({ object, state: { clock } }: { state: NgtRenderState; object: THREE.Group }) {
    object.position.y = Math.sin(clock.getElapsedTime()) * 0.06;
  }

  onMouthBeforeRender({ object, state: { clock } }: { state: NgtRenderState; object: THREE.Mesh }) {
    object.scale.y = (1 + Math.sin(clock.getElapsedTime())) * 1.5;
  }
}

@Component({
  selector: 'sandbox-cursor',
  standalone: true,
  template: `
    <ngt-mesh [ref]="sphereRef.ref" (beforeRender)="onCursorBeforeRender($event.state)" [position]="[0, 0, 10000]">
      <ngt-sphere-geometry [args]="[0.5, 32, 32]"></ngt-sphere-geometry>
      <ngt-mesh-basic-material [fog]="false" [depthTest]="false" transparent opacity="0.5"></ngt-mesh-basic-material>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgtPhysicBody],
  imports: [NgtMesh, NgtSphereGeometry, NgtMeshBasicMaterial],
})
export class Cursor {
  readonly sphereRef = this.physicBody.useSphere<THREE.Mesh>(
    () => ({
      args: [0.5],
      position: [0, 0, 10000],
      type: 'Static',
    }),
    true,
    cursor
  );

  constructor(private physicBody: NgtPhysicBody) {}

  onCursorBeforeRender({ pointer, viewport: { width, height } }: NgtRenderState) {
    const x = pointer.x * width;
    const y = (pointer.y * height) / 1.9 + -x / 3.5;
    this.sphereRef.api.position.set(x / 1.4, y, 0);
  }
}

@Component({
  selector: 'sandbox-chair',
  standalone: true,
  template: `
    <ngt-group sandboxDragConstraint [ref]="chairRef.ref" [position]="[-6, 0, 0]">
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgtPhysicBody],
  imports: [NgtGroup, DragConstraint, NgtMesh, NgtVector3Attribute, NgtBoxGeometry, NgtMeshStandardMaterial],
})
export class Chair {
  readonly chairRef = this.physicBody.useCompoundBody<THREE.Group>(() => ({
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

  constructor(private physicBody: NgtPhysicBody) {}
}

@Component({
  selector: 'sandbox-plane',
  standalone: true,
  template: `
    <ngt-mesh receiveShadow [ref]="planeRef.ref">
      <ngt-plane-geometry [args]="[1000, 1000]"></ngt-plane-geometry>
      <ngt-mesh-standard-material color="#171720"></ngt-mesh-standard-material>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgtPhysicBody],
  imports: [NgtMesh, NgtPlaneGeometry, NgtMeshStandardMaterial],
})
export class Plane {
  readonly planeRef = this.physicBody.usePlane<THREE.Mesh>(() => ({
    args: [1000, 1000],
    position: [0, -5, 0],
    rotation: [-Math.PI / 2, 0, 0],
  }));

  constructor(private physicBody: NgtPhysicBody) {}
}

@Component({
  selector: 'sandbox-lamp',
  standalone: true,
  template: `
    <ngt-mesh sandboxDragConstraint [ref]="lampRef.ref" [position]="[0, 16, 0]">
      <ngt-cone-geometry [args]="[2, 2.5, 32]"></ngt-cone-geometry>
      <ngt-mesh-standard-material></ngt-mesh-standard-material>
      <ngt-point-light intensity="10" distance="5"></ngt-point-light>
      <ngt-spot-light [position]="[0, 20, 0]" angle="0.4" penumbra="1" intensity="0.6" castShadow></ngt-spot-light>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgtPhysicBody, NgtPhysicConstraint],
  imports: [NgtMesh, DragConstraint, NgtConeGeometry, NgtMeshStandardMaterial, NgtPointLight, NgtSpotLight],
})
export class Lamp implements OnInit {
  readonly fixtureRef = this.physicBody.useSphere(
    () => ({
      args: [1],
      position: [0, 16, 0],
      type: 'Static',
    }),
    false
  );
  readonly lampRef = this.physicBody.useBox<THREE.Mesh>(() => ({
    angulardamping: 1.99,
    args: [1, 0, 5],
    linearDamping: 0.9,
    mass: 1,
    position: [0, 16, 0],
  }));

  constructor(private physicBody: NgtPhysicBody, private physicConstraint: NgtPhysicConstraint) {}

  ngOnInit() {
    this.physicConstraint.usePointToPointConstraint(this.fixtureRef.ref, this.lampRef.ref, {
      pivotA: [0, 0, 0],
      pivotB: [0, 2, 0],
    });
  }
}

@Component({
  selector: 'sandbox-mug',
  standalone: true,
  template: `
    <ng-container *ngIf="cup$ | async as cup">
      <ngt-group sandboxDragConstraint [ref]="mugRef.ref" [dispose]="null">
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgtPhysicBody],
  imports: [NgIf, AsyncPipe, NgtGroup, DragConstraint, NgtMesh],
})
export class Mug {
  cup$ = this.loader.use(GLTFLoader, 'assets/cup.glb') as Observable<CupGLTF>;

  readonly mugRef = this.physicBody.useCylinder<THREE.Group>(() => ({
    args: [0.6, 0.6, 1, 16],
    mass: 1,
    position: [9, 0, 0],
    rotation: [Math.PI / 2, 0, 0],
  }));

  constructor(private loader: NgtLoader, private physicBody: NgtPhysicBody) {}
}

@Component({
  selector: 'sandbox-table',
  standalone: true,
  template: `
    <ngt-mesh [ref]="seatRef.ref" [position]="[9, -0.8, 0]">
      <ngt-vector3 attach="scale" [vector3]="[5, 0.5, 5]"></ngt-vector3>
      <ngt-box-geometry></ngt-box-geometry>
      <ngt-mesh-standard-material></ngt-mesh-standard-material>
    </ngt-mesh>

    <ngt-mesh [ref]="leg1Ref.ref" [position]="[7.2, -3, 1.8]">
      <ngt-vector3 attach="scale" [vector3]="[0.5, 4, 0.5]"></ngt-vector3>
      <ngt-box-geometry></ngt-box-geometry>
      <ngt-mesh-standard-material></ngt-mesh-standard-material>
    </ngt-mesh>

    <ngt-mesh [ref]="leg2Ref.ref" [position]="[10.8, -3, 1.8]">
      <ngt-vector3 attach="scale" [vector3]="[0.5, 4, 0.5]"></ngt-vector3>
      <ngt-box-geometry></ngt-box-geometry>
      <ngt-mesh-standard-material></ngt-mesh-standard-material>
    </ngt-mesh>

    <ngt-mesh [ref]="leg3Ref.ref" [position]="[7.2, -3, -1.8]">
      <ngt-vector3 attach="scale" [vector3]="[0.5, 4, 0.5]"></ngt-vector3>
      <ngt-box-geometry></ngt-box-geometry>
      <ngt-mesh-standard-material></ngt-mesh-standard-material>
    </ngt-mesh>

    <ngt-mesh [ref]="leg4Ref.ref" [position]="[10.8, -3, -1.8]">
      <ngt-vector3 attach="scale" [vector3]="[0.5, 4, 0.5]"></ngt-vector3>
      <ngt-box-geometry></ngt-box-geometry>
      <ngt-mesh-standard-material></ngt-mesh-standard-material>
    </ngt-mesh>

    <sandbox-mug></sandbox-mug>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgtPhysicBody],
  imports: [NgtMesh, NgtVector3Attribute, NgtBoxGeometry, NgtMeshStandardMaterial, Mug],
})
export class Table {
  readonly seatRef = this.physicBody.useBox<THREE.Mesh>(() => ({
    args: [2.5, 0.25, 2.5],
    position: [9, -0.8, 0],
    type: 'Static',
  }));
  readonly leg1Ref = this.physicBody.useBox<THREE.Mesh>(() => ({
    args: [0.25, 2, 0.25],
    position: [7.2, -3, 1.8],
    type: 'Static',
  }));
  readonly leg2Ref = this.physicBody.useBox<THREE.Mesh>(() => ({
    args: [0.25, 2, 0.25],
    position: [10.8, -3, 1.8],
    type: 'Static',
  }));
  readonly leg3Ref = this.physicBody.useBox<THREE.Mesh>(() => ({
    args: [0.25, 2, 0.25],
    position: [7.2, -3, -1.8],
    type: 'Static',
  }));
  readonly leg4Ref = this.physicBody.useBox<THREE.Mesh>(() => ({
    args: [0.25, 2, 0.25],
    position: [10.8, -3, -1.8],
    type: 'Static',
  }));

  constructor(private physicBody: NgtPhysicBody) {}
}

@Component({
  selector: 'sandbox-scene',
  standalone: true,
  template: `
    <ngt-ambient-light intensity="0.2"></ngt-ambient-light>
    <ngt-point-light [position]="[-10, -10, -10]" color="red" intensity="1.5"></ngt-point-light>

    <ngt-physics iterations="15" [gravity]="[0, -200, 0]" [allowSleep]="false">
      <sandbox-cursor></sandbox-cursor>
      <sandbox-ragdoll [position]="[0, 0, 0]"></sandbox-ragdoll>
      <sandbox-plane></sandbox-plane>
      <sandbox-chair></sandbox-chair>
      <sandbox-table></sandbox-table>
      <sandbox-lamp></sandbox-lamp>
    </ngt-physics>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgtAmbientLight, NgtPointLight, NgtPhysics, Cursor, Ragdoll, Plane, Chair, Table, Lamp],
})
export class Scene {}

@Component({
  selector: 'sandbox-monday-morning',
  standalone: true,
  template: `
    <ngt-canvas
      [camera]="{ far: 100, near: 1, position: [-25, 20, 25], zoom: 25 }"
      orthographic
      shadows
      style="cursor: none"
      initialLog
    >
      <ngt-color attach="background" color="#171720"></ngt-color>
      <ngt-fog attach="fog" [fog]="['#171720', 20, 70]"></ngt-fog>
      <sandbox-scene></sandbox-scene>
    </ngt-canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgtCanvas, NgtColorAttribute, NgtFogAttribute, Scene],
})
export class SandboxMondayMorningComponent {}
