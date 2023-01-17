import { NgtcPhysics } from '@angular-three/cannon';
import {
    injectBox,
    injectCompoundBody,
    injectConeTwistConstraint,
    injectCylinder,
    injectPlane,
    injectPointToPointConstraint,
    injectSphere,
} from '@angular-three/cannon/services';
import {
    extend,
    injectNgtDestroy,
    injectNgtRef,
    injectNgtStore,
    NgtArgs,
    NgtBeforeRender,
    NgtInjectedRef,
    NgtPush,
    NgtThreeEvent,
} from '@angular-three/core';
import { injectNgtsGLTFLoader } from '@angular-three/soba/loaders';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import {
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    inject,
    Injectable,
    Input,
    OnDestroy,
    OnInit,
    TemplateRef,
} from '@angular/core';
import { ConeTwistConstraintOpts, Triplet } from '@pmndrs/cannon-worker-api';
import { BehaviorSubject, Observable, takeUntil } from 'rxjs';
import {
    AmbientLight,
    BoxGeometry,
    Color,
    ConeGeometry,
    Fog,
    Group,
    Material,
    Mesh,
    MeshBasicMaterial,
    MeshStandardMaterial,
    Object3D,
    PointLight,
    SphereGeometry,
    SpotLight,
} from 'three';
import { GLTF } from 'three-stdlib';
import { createRagdoll, ShapeConfig } from './config';

const { joints, shapes } = createRagdoll(4.8, Math.PI / 16, Math.PI / 16, 0);
const double = ([x, y, z]: Readonly<Triplet>): Triplet => [x * 2, y * 2, z * 2];

// TODO  ensure to adjust all APIs to maybe accept Observable

@Injectable()
export class CursorService {
    readonly cursor = injectNgtRef<Mesh>();
}

function injectDragConstraint(ref: NgtInjectedRef<Object3D>) {
    const cursorService = inject(CursorService);
    const [destroy$] = injectNgtDestroy();

    const constraint = injectPointToPointConstraint(cursorService.cursor, ref, {
        pivotA: [0, 0, 0],
        pivotB: [0, 0, 0],
    });

    // we stop the constraint by default
    ref.$.pipe(takeUntil(destroy$)).subscribe(() => {
        constraint.api.disable();
    });

    const onPointerDown = (e: NgtThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        // @ts-expect-error
        e.target.setPointerCapture(e.pointerId);
        constraint.api.enable();
    };

    const onPointerUp = () => {
        constraint.api.disable();
    };

    return { onPointerUp, onPointerDown };
}

extend({
    Mesh,
    Color,
    Fog,
    MeshStandardMaterial,
    BoxGeometry,
    ConeGeometry,
    SphereGeometry,
    MeshBasicMaterial,
    Group,
    AmbientLight,
    PointLight,
    SpotLight,
});

@Component({
    selector: 'sandbox-box',
    standalone: true,
    template: `
        <ngt-mesh castShadow receiveShadow ngtCompound [ref]="ref">
            <ngt-box-geometry *args="args" />
            <ngt-mesh-standard-material [color]="color" [opacity]="opacity" [transparent]="transparent" />
            <ng-content />
        </ngt-mesh>
    `,
    imports: [NgtArgs],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Box {
    @Input() ref = injectNgtRef<Mesh>();
    @Input() args: ConstructorParameters<typeof BoxGeometry> = [1, 1, 1];
    @Input() color = 'white';
    @Input() opacity = 1;
    @Input() transparent = false;
}

@Component({
    selector: 'sandbox-body-part',
    standalone: true,
    template: `
        <sandbox-box
            [castShadow]="true"
            [receiveShadow]="true"
            [scale]="scale"
            [position]="position"
            [name]="name"
            [color]="shape.color"
            [ref]="box.ref"
            (pointerdown)="dragConstraint.onPointerDown($any($event))"
            (pointerup)="dragConstraint.onPointerUp()"
        >
            <ng-container *ngIf="template" [ngTemplateOutlet]="template" />
        </sandbox-box>
        <ng-content />
    `,
    imports: [Box, NgIf, NgTemplateOutlet],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BodyPart implements OnInit {
    @Input() name!: keyof typeof shapes;
    @Input() position: Triplet = [0, 0, 0];

    readonly configSubject = new BehaviorSubject<ConeTwistConstraintOpts>({});

    @Input() set config(config: ConeTwistConstraintOpts) {
        this.configSubject.next(config);
    }

    @Input() template?: TemplateRef<unknown>;
    // TODO we want ContentChild to work. Renderer is limited right now
    // @ContentChild(TemplateRef) template?: TemplateRef<unknown>;

    shape!: ShapeConfig;
    scale!: Triplet;

    readonly parent = inject(BodyPart, { skipSelf: true, optional: true });
    readonly box = injectBox<Mesh>(() => ({
        args: [...this.shape.args],
        linearDamping: 0.99,
        mass: this.shape.mass,
        position: [...this.shape.position],
    }));
    readonly coneTwist = this.parent
        ? injectConeTwistConstraint(this.box.ref, this.parent.box.ref, this.configSubject.asObservable())
        : null;

    readonly dragConstraint = injectDragConstraint(this.box.ref);

    ngOnInit() {
        this.shape = shapes[this.name];
        this.scale = double(this.shape.args);
    }
}

@Component({
    selector: 'sandbox-ragdoll',
    standalone: true,
    template: `
        <ng-template #face>
            <ngt-group [ref]="eyes">
                <sandbox-box
                    [args]="[0.3, 0.01, 0.1]"
                    color="black"
                    [opacity]="0.8"
                    [position]="[-0.3, 0.1, 0.5]"
                    [transparent]="true"
                />
                <sandbox-box
                    [args]="[0.3, 0.01, 0.1]"
                    color="black"
                    [opacity]="0.8"
                    [position]="[0.3, 0.1, 0.5]"
                    [transparent]="true"
                />
            </ngt-group>
            <sandbox-box
                [ref]="mouth"
                [args]="[0.3, 0.05, 0.1]"
                color="#270000"
                [opacity]="0.8"
                [position]="[0, -0.2, 0.5]"
                [transparent]="true"
            />
        </ng-template>
        <sandbox-body-part [position]="position" name="upperBody">
            <sandbox-body-part [position]="position" name="head" [config]="joints['neckJoint']" [template]="face" />
            <sandbox-body-part [position]="position" name="upperLeftArm" [config]="joints['leftShoulder']">
                <sandbox-body-part [position]="position" name="lowerLeftArm" [config]="joints['leftElbowJoint']" />
            </sandbox-body-part>
            <sandbox-body-part [position]="position" name="upperRightArm" [config]="joints['rightShoulder']">
                <sandbox-body-part [position]="position" name="lowerRightArm" [config]="joints['rightElbowJoint']" />
            </sandbox-body-part>
            <sandbox-body-part [position]="position" name="pelvis" [config]="joints['spineJoint']">
                <sandbox-body-part [position]="position" name="upperLeftLeg" [config]="joints['leftHipJoint']">
                    <sandbox-body-part [position]="position" name="lowerLeftLeg" [config]="joints['leftKneeJoint']" />
                </sandbox-body-part>
                <sandbox-body-part [position]="position" name="upperRightLeg" [config]="joints['rightHipJoint']">
                    <sandbox-body-part [position]="position" name="lowerRightLeg" [config]="joints['rightKneeJoint']" />
                </sandbox-body-part>
            </sandbox-body-part>
        </sandbox-body-part>
    `,
    imports: [BodyPart, Box],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Ragdoll implements OnInit, OnDestroy {
    @Input() position: Triplet = [0, 0, 0];
    readonly joints = joints;

    readonly mouth = injectNgtRef<Mesh>();
    readonly eyes = injectNgtRef<Group>();

    readonly store = injectNgtStore();

    sub?: () => void;

    ngOnInit() {
        this.sub = this.store.get('internal').subscribe(({ clock }) => {
            if (!this.eyes.nativeElement || !this.mouth.nativeElement) return;
            this.eyes.nativeElement.position.y = Math.sin(clock.getElapsedTime() * 1) * 0.06;
            this.mouth.nativeElement.scale.y = (1 + Math.sin(clock.getElapsedTime())) * 1.5;
        });
    }

    ngOnDestroy() {
        this.sub?.();
    }
}

@Component({
    selector: 'sandbox-plane',
    standalone: true,
    template: `
        <ngt-mesh [ref]="plane.ref" receiveShadow>
            <ngt-plane-geometry *args="[1000, 1000]" />
            <ngt-mesh-standard-material color="#171720" />
        </ngt-mesh>
    `,
    imports: [NgtArgs],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Plane {
    @Input() position: Triplet = [0, 0, 0];
    @Input() rotation: Triplet = [0, 0, 0];

    readonly plane = injectPlane<Mesh>(() => ({ position: this.position, rotation: this.rotation }));
}

@Component({
    selector: 'sandbox-chair',
    standalone: true,
    template: `
        <ngt-group
            [ref]="chair.ref"
            (pointerdown)="dragConstraint.onPointerDown($any($event))"
            (pointerup)="dragConstraint.onPointerUp()"
        >
            <sandbox-box [position]="[0, 0, 0]" [scale]="[3, 3, 0.5]" />
            <sandbox-box [position]="[0, -1.75, 1.25]" [scale]="[3, 0.5, 3]" />
            <sandbox-box [position]="[5 + -6.25, -3.5, 0]" [scale]="[0.5, 3, 0.5]" />
            <sandbox-box [position]="[5 + -3.75, -3.5, 0]" [scale]="[0.5, 3, 0.5]" />
            <sandbox-box [position]="[5 + -6.25, -3.5, 2.5]" [scale]="[0.5, 3, 0.5]" />
            <sandbox-box [position]="[5 + -3.75, -3.5, 2.5]" [scale]="[0.5, 3, 0.5]" />
        </ngt-group>
    `,
    imports: [Box],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Chair {
    readonly chair = injectCompoundBody(() => ({
        mass: 1,
        position: [-6, 0, 0],
        shapes: [
            { args: [1.5, 1.5, 0.25], mass: 1, position: [0, 0, 0], type: 'Box' },
            { args: [1.5, 0.25, 1.5], mass: 1, position: [0, -1.75, 1.25], type: 'Box' },
            { args: [0.25, 1.5, 0.25], mass: 10, position: [5 + -6.25, -3.5, 0], type: 'Box' },
            { args: [0.25, 1.5, 0.25], mass: 10, position: [5 + -3.75, -3.5, 0], type: 'Box' },
            { args: [0.25, 1.5, 0.25], mass: 10, position: [5 + -6.25, -3.5, 2.5], type: 'Box' },
            { args: [0.25, 1.5, 0.25], mass: 10, position: [5 + -3.75, -3.5, 2.5], type: 'Box' },
        ],
        type: 'Dynamic',
    }));
    readonly dragConstraint = injectDragConstraint(this.chair.ref);
}

interface CupGLTF extends GLTF {
    materials: { default: Material; Liquid: Material };
    nodes: { 'buffer-0-mesh-0': Mesh; 'buffer-0-mesh-0_1': Mesh };
}

@Component({
    selector: 'sandbox-mug',
    standalone: true,
    template: `
        <ng-container *ngIf="cup$ | ngtPush : null as cup">
            <ngt-group
                [ref]="cylinder.ref"
                name="mugggg"
                (pointerdown)="dragConstraint.onPointerDown($any($event))"
                (pointerup)="dragConstraint.onPointerUp()"
            >
                <ngt-group scale="0.01">
                    <ngt-mesh
                        receiveShadow
                        castShadow
                        [geometry]="cup.nodes['buffer-0-mesh-0'].geometry"
                        [material]="cup.materials.default"
                    />
                    <ngt-mesh
                        receiveShadow
                        castShadow
                        [geometry]="cup.nodes['buffer-0-mesh-0_1'].geometry"
                        [material]="cup.materials.Liquid"
                    />
                </ngt-group>
            </ngt-group>
        </ng-container>
    `,
    imports: [NgIf, NgtPush],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Mug {
    readonly cup$ = injectNgtsGLTFLoader('assets/cup.glb') as Observable<CupGLTF>;
    readonly cylinder = injectCylinder<Group>(() => ({
        args: [0.6, 0.6, 1, 16],
        mass: 1,
        position: [9, 0, 0],
        rotation: [Math.PI / 2, 0, 0],
    }));
    readonly dragConstraint = injectDragConstraint(this.cylinder.ref);
}

@Component({
    selector: 'sandbox-table',
    standalone: true,
    template: `
        <sandbox-box [ref]="seat.ref" [scale]="[5, 0.5, 5]" />
        <sandbox-box [ref]="leg1.ref" [scale]="[0.5, 4, 0.5]" />
        <sandbox-box [ref]="leg2.ref" [scale]="[0.5, 4, 0.5]" />
        <sandbox-box [ref]="leg3.ref" [scale]="[0.5, 4, 0.5]" />
        <sandbox-box [ref]="leg4.ref" [scale]="[0.5, 4, 0.5]" />
        <sandbox-mug />
    `,
    imports: [Mug, Box],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Table {
    readonly seat = injectBox<Mesh>(() => ({ args: [2.5, 0.25, 2.5], position: [9, -0.8, 0], type: 'Static' }));
    readonly leg1 = injectBox<Mesh>(() => ({ args: [0.25, 2, 0.25], position: [7.2, -3, 1.8], type: 'Static' }));
    readonly leg2 = injectBox<Mesh>(() => ({ args: [0.25, 2, 0.25], position: [10.8, -3, 1.8], type: 'Static' }));
    readonly leg3 = injectBox<Mesh>(() => ({ args: [0.25, 2, 0.25], position: [7.2, -3, -1.8], type: 'Static' }));
    readonly leg4 = injectBox<Mesh>(() => ({ args: [0.25, 2, 0.25], position: [10.8, -3, -1.8], type: 'Static' }));
}

@Component({
    selector: 'sandbox-lamp',
    standalone: true,
    template: `
        <ngt-mesh
            [ref]="lamp.ref"
            (pointerdown)="dragConstraint.onPointerDown($any($event))"
            (pointerup)="dragConstraint.onPointerUp()"
        >
            <ngt-cone-geometry *args="[2, 2.5, 32]" />
            <ngt-mesh-standard-material />
            <ngt-point-light intensity="10" distance="5" />
            <ngt-spot-light [ref]="light" [position]="[0, 20, 0]" angle="0.4" penumbra="1" intensity="0.6" castShadow />
        </ngt-mesh>
    `,
    imports: [NgtArgs],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Lamp {
    readonly light = injectNgtRef<SpotLight>();
    readonly fixed = injectSphere(() => ({ args: [1], position: [0, 16, 0], type: 'Static' }));
    readonly lamp = injectBox<Mesh>(() => ({
        angulardamping: 1.99,
        args: [1, 0, 5],
        linearDamping: 0.9,
        mass: 1,
        position: [0, 16, 0],
    }));
    readonly constraint = injectPointToPointConstraint(this.fixed.ref, this.lamp.ref, {
        pivotA: [0, 0, 0],
        pivotB: [0, 2, 0],
    });
    readonly dragConstraint = injectDragConstraint(this.lamp.ref);
}

@Component({
    selector: 'sandbox-cursor',
    standalone: true,
    template: `
        <ngt-mesh [ref]="sphere.ref" (beforeRender)="onBeforeRender($any($event))">
            <ngt-sphere-geometry *args="[0.5, 32, 32]" />
            <ngt-mesh-basic-material fog="false" depthTest="false" transparent opacity="0.5" />
        </ngt-mesh>
    `,
    imports: [NgtArgs],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Cursor {
    readonly cursorService = inject(CursorService);
    readonly sphere = injectSphere<Mesh>(
        () => ({
            args: [0.5],
            position: [0, 0, 10000],
            type: 'Static',
        }),
        this.cursorService.cursor
    );

    onBeforeRender({ state: { pointer, viewport } }: NgtBeforeRender<Mesh>) {
        const x = pointer.x * viewport.width;
        const y = (pointer.y * viewport.height) / 1.9 + -x / 3.5;
        this.sphere.api.position.set(x / 1.4, y, 0);
    }
}

@Component({
    selector: 'sandbox-monday-morning-scene',
    standalone: true,
    template: `
        <ngt-color *args="['#171720']" attach="background" />
        <ngt-fog *args="['#171720', 20, 70]" attach="fog" />

        <ngt-ambient-light intensity="0.2" />
        <ngt-point-light [position]="[-10, -10, -10]" intensity="1.5" color="red" />

        <ngtc-physics [iterations]="15" [gravity]="[0, -200, 0]" [allowSleep]="false">
            <sandbox-cursor />
            <sandbox-ragdoll [position]="[0, 0, 0]" />
            <sandbox-plane [position]="[0, -5, 0]" [rotation]="[-Math.PI / 2, 0, 0]" />
            <sandbox-chair />
            <sandbox-table />
            <sandbox-lamp />
        </ngtc-physics>
    `,
    imports: [NgtArgs, NgtcPhysics, Cursor, Ragdoll, Plane, Chair, Table, Lamp],
    providers: [CursorService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Scene {
    readonly Math = Math;
}
