import {
    ConeTwistConstraintOpts,
    NgtPhysicsModule,
} from '@angular-three/cannon';
import {
    NgtPhysicBody,
    NgtPhysicsBodyPublicApi,
} from '@angular-three/cannon/bodies';
import {
    NgtConstraintReturn,
    NgtPhysicConstraint,
} from '@angular-three/cannon/constraints';
import {
    NgtCanvasModule,
    NgtObject,
    NgtRenderState,
    NgtTriple,
    NgtVector3,
    Ref,
} from '@angular-three/core';
import {
    NgtColorAttributeModule,
    NgtFogAttributeModule,
    NgtVector3AttributeModule,
} from '@angular-three/core/attributes';
import {
    NgtBoxGeometryModule,
    NgtPlaneGeometryModule,
    NgtSphereGeometryModule,
} from '@angular-three/core/geometries';
import { NgtGroupModule } from '@angular-three/core/group';
import {
    NgtAmbientLightModule,
    NgtPointLightModule,
} from '@angular-three/core/lights';
import {
    NgtMeshBasicMaterialModule,
    NgtMeshStandardMaterialModule,
} from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    Directive,
    Input,
    NgModule,
    OnInit,
    Optional,
    Self,
    SkipSelf,
    TemplateRef,
} from '@angular/core';
import { takeUntil } from 'rxjs';
import * as THREE from 'three';
import { createRagdoll, ShapeConfig, ShapeName } from './monday-morning.config';

const { joints, shapes } = createRagdoll(4.8, Math.PI / 16, Math.PI / 16, 0);

const double = ([x, y, z]: Readonly<NgtTriple>): NgtTriple => [
    x * 2,
    y * 2,
    z * 2,
];

const cursor = new Ref<THREE.Object3D>();

@Component({
    selector: 'sandbox-monday-morning',
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

            <ngt-ambient-light [intensity]="0.2"></ngt-ambient-light>
            <ngt-point-light
                [position]="[-10, -10, -10]"
                color="red"
                [intensity]="1.5"
            ></ngt-point-light>

            <ngt-physics
                [iterations]="15"
                [gravity]="[0, -200, 0]"
                [allowSleep]="false"
            >
                <sandbox-cursor></sandbox-cursor>
                <sandbox-ragdoll [position]="[0, 0, 0]"></sandbox-ragdoll>
                <sandbox-plane></sandbox-plane>
            </ngt-physics>

            <!--            <Physics iterations={15} gravity={[0, -200, 0]} allowSleep={false}>-->
            <!--                <Cursor />-->
            <!--                <Ragdoll position={[0, 0, 0]} />-->
            <!--                <Plane position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]} />-->
            <!--                <Chair />-->
            <!--                <Table />-->
            <!--                <Lamp />-->
            <!--            </Physics>-->
        </ngt-canvas>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxMondayMorningComponent {}

@Component({
    selector: 'sandbox-cursor',
    template: `
        <ngt-mesh
            [ref]="sphereRef.ref"
            (beforeRender)="onCursorBeforeRender($event.state)"
        >
            <ngt-sphere-geometry [args]="[0.5, 32, 32]"></ngt-sphere-geometry>
            <ngt-mesh-basic-material
                [fog]="false"
                [depthTest]="false"
                [transparent]="true"
                [opacity]="0.5"
            ></ngt-mesh-basic-material>
        </ngt-mesh>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [NgtPhysicBody],
})
export class SandboxCursorComponent {
    sphereRef = this.physicBody.useSphere(
        () => ({
            args: [0.5],
            position: [0, 0, 10000],
            type: 'Static',
        }),
        cursor
    );

    constructor(private physicBody: NgtPhysicBody) {}

    onCursorBeforeRender({
        pointer,
        viewport: { width, height },
    }: NgtRenderState) {
        const x = pointer.x * width;
        const y = (pointer.y * height) / 1.9 + -x / 3.5;
        this.sphereRef.api.position.set(x / 1.4, y, 0);
    }
}

@Directive({
    selector: '[sandboxDragConstraint]',
    providers: [NgtPhysicConstraint],
})
export class SandboxDragConstraintDirective implements OnInit {
    private constraint!: NgtConstraintReturn<'PointToPoint'>;

    constructor(
        private physicConstraint: NgtPhysicConstraint,
        @Self()
        private object: NgtObject
    ) {
        object.pointerdown
            .pipe(takeUntil(object.destroy$))
            .subscribe((event: any) => {
                event.stopPropagation();
                event.target.setPointerCapture(event.pointerId);
                this.constraint.api.enable();
            });
        object.pointerup.pipe(takeUntil(object.destroy$)).subscribe(() => {
            this.constraint.api.disable();
        });
    }

    ngOnInit() {
        this.constraint = this.physicConstraint.usePointToPointConstraint(
            cursor,
            this.object.instance as unknown as Ref<THREE.Object3D>,
            { pivotA: [0, 0, 0], pivotB: [0, 0, 0] }
        );
        this.constraint.api.disable();
    }
}

@Component({
    selector: 'sandbox-box[name]',
    template: `
        <ng-container *ngIf="boxRef">
            <ngt-mesh
                castShadow
                receiveShadow
                sandboxDragConstraint
                [ref]="boxRef.ref"
                [name]="name"
                [position]="position"
            >
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
            <ng-container
                *ngIf="childTemplate"
                [ngTemplateOutlet]="childTemplate"
            ></ng-container>
            <ng-content></ng-content>
        </ng-container>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [NgtPhysicBody, NgtPhysicConstraint],
})
export class SandboxBoxComponent implements OnInit {
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
    boxRef!: { ref: Ref<THREE.Object3D>; api: NgtPhysicsBodyPublicApi };

    constructor(
        @Optional()
        @SkipSelf()
        private parentBox: SandboxBoxComponent,
        private physicBody: NgtPhysicBody,
        private physicConstraint: NgtPhysicConstraint
    ) {}

    ngOnInit() {
        this.shape = shapes[this.name];
        this.scale = double(this.shape.args);
        this.boxRef = this.physicBody.useBox(() => ({
            args: [...this.shape.args],
            linearDamping: 0.99,
            mass: this.shape.mass,
            position: [...this.shape.position],
        }));
        if (this.parentBox) {
            this.physicConstraint.useConeTwistConstraint(
                this.boxRef.ref,
                this.parentBox.boxRef.ref,
                this.config
            );
        }
    }
}

@Component({
    selector: 'sandbox-ragdoll',
    template: `
        <sandbox-box [position]="position" name="upperBody">
            <ng-template #child>
                <sandbox-box
                    name="head"
                    [position]="position"
                    [config]="joints['neckJoint']"
                >
                    <ng-template #render let-scale="scale" let-parent="parent">
                        <ngt-group
                            (beforeRender)="onEyesBeforeRender($event)"
                            [appendTo]="parent"
                        >
                            <ngt-mesh
                                castShadow
                                receiveShadow
                                [position]="[-0.3, 0.1, 0.5]"
                            >
                                <ngt-vector3
                                    attach="scale"
                                    [vector3]="scale"
                                ></ngt-vector3>
                                <ngt-box-geometry
                                    [args]="[0.3, 0.01, 0.1]"
                                ></ngt-box-geometry>
                                <ngt-mesh-standard-material
                                    color="black"
                                    [opacity]="0.8"
                                    [transparent]="true"
                                ></ngt-mesh-standard-material>
                            </ngt-mesh>
                            <ngt-mesh
                                castShadow
                                receiveShadow
                                [position]="[0.3, 0.1, 0.5]"
                            >
                                <ngt-vector3
                                    attach="scale"
                                    [vector3]="scale"
                                ></ngt-vector3>
                                <ngt-box-geometry
                                    [args]="[0.3, 0.01, 0.1]"
                                ></ngt-box-geometry>
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
                            <ngt-vector3
                                attach="scale"
                                [vector3]="scale"
                            ></ngt-vector3>
                            <ngt-box-geometry
                                [args]="[0.3, 0.05, 0.1]"
                            ></ngt-box-geometry>
                            <ngt-mesh-standard-material
                                color="black"
                                [opacity]="0.8"
                                [transparent]="true"
                            ></ngt-mesh-standard-material>
                        </ngt-mesh>
                    </ng-template>
                </sandbox-box>

                <sandbox-box
                    name="upperLeftArm"
                    [config]="joints['leftShoulder']"
                    [position]="position"
                >
                    <ng-template #child>
                        <sandbox-box
                            [position]="position"
                            name="lowerLeftArm"
                            [config]="joints['leftElbowJoint']"
                        ></sandbox-box>
                    </ng-template>
                </sandbox-box>

                <sandbox-box
                    name="upperRightArm"
                    [config]="joints['rightShoulder']"
                    [position]="position"
                >
                    <ng-template #child>
                        <sandbox-box
                            [position]="position"
                            name="lowerRightArm"
                            [config]="joints['rightElbowJoint']"
                        ></sandbox-box>
                    </ng-template>
                </sandbox-box>

                <sandbox-box
                    name="pelvis"
                    [config]="joints['spineJoint']"
                    [position]="position"
                >
                    <ng-template #child>
                        <sandbox-box
                            name="upperLeftLeg"
                            [config]="joints['leftHipJoint']"
                            [position]="position"
                        >
                            <ng-template #child>
                                <sandbox-box
                                    name="lowerLeftLeg"
                                    [config]="joints['leftKneeJoint']"
                                    [position]="position"
                                ></sandbox-box>
                            </ng-template>
                        </sandbox-box>

                        <sandbox-box
                            name="upperRightLeg"
                            [config]="joints['rightHipJoint']"
                            [position]="position"
                        >
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
})
export class SandboxRagdollComponent {
    @Input() position?: NgtVector3;
    readonly joints = joints;

    onEyesBeforeRender({
        object,
        state: { clock },
    }: {
        state: NgtRenderState;
        object: THREE.Group;
    }) {
        object.position.y = Math.sin(clock.getElapsedTime()) * 0.06;
    }

    onMouthBeforeRender({
        object,
        state: { clock },
    }: {
        state: NgtRenderState;
        object: THREE.Mesh;
    }) {
        object.scale.y = (1 + Math.sin(clock.getElapsedTime())) * 1.5;
    }
}

@Component({
    selector: 'sandbox-plane',
    template: `
        <ngt-mesh receiveShadow [ref]="planeRef.ref">
            <ngt-plane-geometry [args]="[1000, 1000]"></ngt-plane-geometry>
            <ngt-mesh-standard-material
                color="#171720"
            ></ngt-mesh-standard-material>
        </ngt-mesh>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [NgtPhysicBody],
})
export class SandboxPlaneComponent {
    planeRef = this.physicBody.usePlane(() => ({
        args: [1000, 1000],
        position: [0, -5, 0],
        rotation: [-Math.PI / 2, 0, 0],
    }));

    constructor(private physicBody: NgtPhysicBody) {}
}

@NgModule({
    declarations: [
        SandboxMondayMorningComponent,
        SandboxCursorComponent,
        SandboxBoxComponent,
        SandboxRagdollComponent,
        SandboxPlaneComponent,
        SandboxDragConstraintDirective,
    ],
    exports: [SandboxMondayMorningComponent, SandboxBoxComponent],
    imports: [
        NgtMeshModule,
        NgtBoxGeometryModule,
        NgtMeshStandardMaterialModule,
        CommonModule,
        NgtGroupModule,
        NgtVector3AttributeModule,
        NgtPlaneGeometryModule,
        NgtCanvasModule,
        NgtColorAttributeModule,
        NgtFogAttributeModule,
        NgtAmbientLightModule,
        NgtPointLightModule,
        NgtPhysicsModule,
        NgtSphereGeometryModule,
        NgtMeshBasicMaterialModule,
    ],
})
export class SandboxMondayMorningModule {}
