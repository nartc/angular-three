import {
    BoxProps,
    NgtPhysicsModule,
    PlaneProps,
    SphereProps,
} from '@angular-three/cannon';
import {
    GetByIndex,
    NgtPhysicBoxModule,
    NgtPhysicPlaneModule,
    NgtPhysicSphere,
    NgtPhysicSphereModule,
} from '@angular-three/cannon/bodies';
import {
    NgtPhysicConeTwistConstraint,
    NgtPhysicConeTwistConstraintModule,
    NgtPhysicPointToPointConstraint,
    NgtPhysicPointToPointConstraintModule,
    NgtPhysicsConstraint,
} from '@angular-three/cannon/constraints';
import type {
    NgtRenderState,
    NgtTriple,
    NgtVector3,
} from '@angular-three/core';
import {
    NgtCanvasModule,
    NgtWrapper,
    provideWrappedObjectFactory,
} from '@angular-three/core';
import {
    NgtColorAttributeModule,
    NgtFogAttributeModule,
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
    SkipSelf,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { ConeTwistConstraintOpts } from '@pmndrs/cannon-worker-api';
import * as THREE from 'three';
import { createRagdoll, ShapeConfig, ShapeName } from './monday-morning.config';

const { joints, shapes } = createRagdoll(4.8, Math.PI / 16, Math.PI / 16, 0);

const double = ([x, y, z]: Readonly<NgtTriple>): NgtTriple => [
    x * 2,
    y * 2,
    z * 2,
];

@Component({
    selector: 'sandbox-monday-morning',
    template: `
        <ngt-canvas
            [camera]="{ far: 100, near: 1, position: [-25, 20, 25], zoom: 25 }"
            orthographic
            shadows
            style="cursor: none;"
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
                <sandbox-ragdoll [position]="[0, 0, 0]"></sandbox-ragdoll>
                <sandbox-plane></sandbox-plane>
            </ngt-physics>
        </ngt-canvas>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxMondayMorningComponent {}

@Component({
    selector: 'sandbox-cursor',
    template: `
        <ngt-mesh
            ngtPhysicSphere
            [getPhysicProps]="getSphereProps"
            (ready)="wrapped = $event"
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
        <ng-content></ng-content>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideWrappedObjectFactory<THREE.Mesh>(SandboxCursorComponent),
    ],
})
export class SandboxCursorComponent extends NgtWrapper<THREE.Mesh> {
    @ViewChild(NgtPhysicSphere, { static: true })
    physicSphere!: NgtPhysicSphere;

    getSphereProps: GetByIndex<SphereProps> = () => ({
        args: [0.5],
        position: [0, 0, 10000],
        type: 'Static',
    });

    onCursorBeforeRender({
        pointer,
        viewport: { height, width },
    }: NgtRenderState) {
        const x = pointer.x * width;
        const y = (pointer.y * height) / 1.9 + -x / 3.5;
        this.physicSphere.api.position.set(x / 1.4, y, 0);
    }
}

@Component({
    selector: 'sandbox-box',
    template: `
        <ngt-mesh
            castShadow
            receiveShadow
            (ready)="wrapped = $event"
            (beforeRender)="beforeRender.emit($event)"
            [name]="name"
            [position]="position"
            [color]="color"
            [appendMode]="appendMode"
            [appendTo]="appendTo"
            [dispose]="dispose"
            [matrixAutoUpdate]="matrixAutoUpdate"
            [scale]="scale"
            [rotation]="rotation"
            [quaternion]="quaternion"
            [raycast]="raycast"
        >
            <ngt-box-geometry [args]="args"></ngt-box-geometry>
            <ngt-mesh-standard-material
                [color]="$any(color)"
                [opacity]="opacity"
                [transparent]="transparent"
            ></ngt-mesh-standard-material>
            <ng-content></ng-content>
        </ngt-mesh>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideWrappedObjectFactory<THREE.Mesh>(SandboxBoxComponent)],
})
export class SandboxBoxComponent extends NgtWrapper<THREE.Mesh> {
    @Input() args: ConstructorParameters<typeof THREE.BoxGeometry> = [1, 1, 1];
    @Input() opacity = 1;
    @Input() transparent = false;
}

@Directive({
    selector: 'sandbox-box[sandboxDrag]',
})
export class SandboxDragConstraintDirective implements OnInit {
    constructor(
        @Optional()
        @SkipSelf()
        private pointToPointConstraint: NgtPhysicPointToPointConstraint,
        private box: SandboxBoxComponent
    ) {}

    ngOnInit() {
        this.box.pointerdown.subscribe((e: any) => {
            e.stopPropagation();
            e.target.setPointerCapture(e.pointerId);
            this.pointToPointConstraint.api.enable();
        });

        this.box.pointerup.subscribe(() => {
            this.pointToPointConstraint.api.disable();
        });

        if (this.pointToPointConstraint) {
            setTimeout(() => {
                console.log(this.pointToPointConstraint.get((s) => s.bodies));
                this.pointToPointConstraint.addBody(this.box.wrapped);
            });
            this.pointToPointConstraint.api.disable();
        }
    }
}

@Component({
    selector: 'sandbox-body-part[name]',
    template: `
        <ng-container
            ngtPhysicConeTwistConstraint
            [previous]="parentBodyPart?.boxComponent?.wrappedFactory"
        >
            <sandbox-box
                ngtPhysicBox
                [getPhysicProps]="getBoxProps"
                [transparent]="transparent"
                [opacity]="opacity"
                [color]="shape.color"
                [scale]="scale"
                [args]="args"
                [name]="name"
                [position]="position"
            >
                <ng-container
                    *ngIf="boxChildrenTemplate"
                    [ngTemplateOutlet]="boxChildrenTemplate"
                ></ng-container>
            </sandbox-box>
            <ng-content></ng-content>
        </ng-container>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NgtPhysicsConstraint,
            useFactory: (bodyPart: SandboxBodyPartComponent) => {
                return bodyPart.coneTwistConstraint;
            },
            deps: [SandboxBodyPartComponent],
        },
    ],
})
export class SandboxBodyPartComponent implements OnInit {
    // Box Inputs
    @Input() position?: NgtVector3;
    @Input() args: ConstructorParameters<typeof THREE.BoxGeometry> = [1, 1, 1];
    @Input() opacity = 1;
    @Input() transparent = false;

    @Input() name!: ShapeName;
    @Input() config: ConeTwistConstraintOpts = {};

    @ContentChild(TemplateRef) boxChildrenTemplate?: TemplateRef<unknown>;

    @ViewChild(NgtPhysicConeTwistConstraint, { static: true })
    coneTwistConstraint!: NgtPhysicConeTwistConstraint;

    @ViewChild(SandboxBoxComponent, { static: true })
    boxComponent!: SandboxBoxComponent;

    shape!: ShapeConfig;
    scale!: NgtVector3;

    constructor(
        @Optional() @SkipSelf() public parentBodyPart: SandboxBodyPartComponent,
        @Optional() @SkipSelf() public parentCursor: SandboxCursorComponent
    ) {}

    ngOnInit() {
        this.shape = shapes[this.name];
        this.scale = double(this.shape.args);
    }

    getBoxProps: GetByIndex<BoxProps> = () => {
        return {
            mass: this.shape.mass,
            position: [...this.shape.position],
            linearDamping: 0.99,
            args: [...this.shape.args],
        };
    };
}

@Component({
    selector: 'sandbox-ragdoll',
    template: `
        <sandbox-body-part name="upperBody" [position]="position">
            <sandbox-body-part
                name="head"
                [config]="joints['neckJoint']"
                [position]="position"
            >
                <ng-template>
                    <ngt-group (beforeRender)="onEyesBeforeRender($event)">
                        <sandbox-box
                            [args]="[0.3, 0.01, 0.1]"
                            color="black"
                            [opacity]="0.8"
                            [position]="[-0.3, 0.1, 0.5]"
                            [transparent]="true"
                        ></sandbox-box>
                        <sandbox-box
                            [args]="[0.3, 0.01, 0.1]"
                            color="black"
                            [opacity]="0.8"
                            [position]="[0.3, 0.1, 0.5]"
                            [transparent]="true"
                        ></sandbox-box>
                    </ngt-group>
                    <sandbox-box
                        [args]="[0.3, 0.05, 0.1]"
                        color="#270000"
                        [opacity]="0.8"
                        [position]="[0, -0.2, 0.5]"
                        [transparent]="true"
                        (beforeRender)="onMountBeforeRender($event)"
                    ></sandbox-box>
                </ng-template>
            </sandbox-body-part>
            <sandbox-body-part
                name="upperLeftArm"
                [position]="position"
                [config]="joints['leftShoulder']"
            >
                <sandbox-body-part
                    name="lowerLeftArm"
                    [position]="position"
                    [config]="joints['leftElbowJoint']"
                ></sandbox-body-part>
            </sandbox-body-part>
            <sandbox-body-part
                name="upperRightArm"
                [position]="position"
                [config]="joints['rightShoulder']"
            >
                <sandbox-body-part
                    name="lowerRightArm"
                    [position]="position"
                    [config]="joints['rightElbowJoint']"
                ></sandbox-body-part>
            </sandbox-body-part>
            <sandbox-body-part
                name="pelvis"
                [position]="position"
                [config]="joints['spineJoint']"
            >
                <sandbox-body-part
                    name="upperLeftLeg"
                    [position]="position"
                    [config]="joints['leftHipJoint']"
                >
                    <sandbox-body-part
                        name="lowerLeftLeg"
                        [position]="position"
                        [config]="joints['leftKneeJoint']"
                    ></sandbox-body-part>
                </sandbox-body-part>

                <sandbox-body-part
                    name="upperRightLeg"
                    [position]="position"
                    [config]="joints['rightHipJoint']"
                >
                    <sandbox-body-part
                        name="lowerRightLeg"
                        [position]="position"
                        [config]="joints['rightKneeJoint']"
                    ></sandbox-body-part>
                </sandbox-body-part>
            </sandbox-body-part>
        </sandbox-body-part>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxRagdollComponent {
    @Input() position?: NgtVector3;
    readonly joints = joints;

    onEyesBeforeRender({
        state: { clock },
        object,
    }: {
        state: NgtRenderState;
        object: THREE.Group;
    }) {
        object.position.y = Math.sin(clock.getElapsedTime()) * 0.06;
    }

    onMountBeforeRender({
        state: { clock },
        object,
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
        <ngt-mesh ngtPhysicPlane [getPhysicProps]="getPlaneProps">
            <ngt-plane-geometry [args]="[1000, 1000]"></ngt-plane-geometry>
            <ngt-mesh-standard-material
                color="#171720"
            ></ngt-mesh-standard-material>
        </ngt-mesh>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxPlaneComponent {
    getPlaneProps: GetByIndex<PlaneProps> = () => ({
        position: [0, -5, 0],
        rotation: [-Math.PI / 2, 0, 0],
    });
}

@NgModule({
    declarations: [
        SandboxMondayMorningComponent,
        SandboxCursorComponent,
        SandboxBoxComponent,
        SandboxBodyPartComponent,
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
        NgtPhysicConeTwistConstraintModule,
        NgtSphereGeometryModule,
        NgtMeshBasicMaterialModule,
        NgtPhysicSphereModule,
        NgtPhysicBoxModule,
        NgtPhysicPointToPointConstraintModule,
        NgtGroupModule,
        NgtPhysicPlaneModule,
        NgtPlaneGeometryModule,
        NgtCanvasModule,
        NgtColorAttributeModule,
        NgtFogAttributeModule,
        NgtAmbientLightModule,
        NgtPointLightModule,
        NgtPhysicsModule,
    ],
})
export class SandboxMondayMorningModule {}
