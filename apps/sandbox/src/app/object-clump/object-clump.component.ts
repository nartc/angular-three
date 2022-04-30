import { NgtPhysicBody, NgtPhysicsModule } from '@angular-three/cannon';
import {
    NgtCanvasModule,
    NgtComponentStore,
    NgtRenderState,
    NgtStore,
    NgtTriple,
} from '@angular-three/core';
import {
    NgtValueAttributeModule,
    NgtVector2AttributeModule,
} from '@angular-three/core/attributes';
import { NgtSphereGeometryModule } from '@angular-three/core/geometries';
import {
    NgtAmbientLightModule,
    NgtDirectionalLightModule,
    NgtSpotLightModule,
} from '@angular-three/core/lights';
import { NgtMeshStandardMaterialModule } from '@angular-three/core/materials';
import { NgtInstancedMeshModule } from '@angular-three/core/meshes';
import { NgtEffectComposerModule } from '@angular-three/postprocessing';
import {
    NgtBloomModule,
    NgtSSAOModule,
} from '@angular-three/postprocessing/effects';
import { NgtTextureLoader } from '@angular-three/soba/loaders';
import {
    NgtSobaEnvironmentModule,
    NgtSobaSkyModule,
} from '@angular-three/soba/staging';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    NgModule,
    NgZone,
    OnInit,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import * as THREE from 'three';

@Component({
    selector: 'sandbox-object-clump',
    template: `
        <ngt-canvas
            shadows
            [dpr]="[1, 2]"
            [camera]="{ position: [0, 0, 20], fov: 35, near: 1, far: 40 }"
            initialLog
        >
            <ngt-ambient-light intensity="0.25"></ngt-ambient-light>
            <ngt-spot-light
                [position]="[30, 30, 30]"
                intensity="1"
                angle="0.2"
                penumbra="1"
                castShadow
            >
                <ngt-vector2
                    [attach]="['shadow', 'mapSize']"
                    [vector2]="[512, 512]"
                ></ngt-vector2>
            </ngt-spot-light>
            <ngt-directional-light
                [position]="[-10, -10, -10]"
                intensity="5"
                color="purple"
            ></ngt-directional-light>

            <ngt-physics [gravity]="[0, 2, 0]" iterations="10">
                <sandbox-pointer></sandbox-pointer>
                <sandbox-clump></sandbox-clump>
            </ngt-physics>

            <ngt-soba-environment
                files="assets/adamsbridge.hdr"
            ></ngt-soba-environment>
            <sandbox-effects></sandbox-effects>
            <ngt-soba-sky></ngt-soba-sky>
        </ngt-canvas>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObjectClumpComponent {}

@Component({
    selector: 'sandbox-pointer',
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [NgtPhysicBody],
})
export class PointerComponent extends NgtComponentStore implements OnInit {
    pointerRef = this.physicBody.useSphere(
        () => ({
            type: 'Kinematic',
            args: [3],
            position: [0, 0, 0],
        }),
        false
    );

    constructor(
        private physicBody: NgtPhysicBody,
        private store: NgtStore,
        private zone: NgZone
    ) {
        super();
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(
                this.store.ready$,
                () => {
                    const unregister = this.store.registerBeforeRender({
                        callback: ({ pointer, viewport }) => {
                            this.pointerRef.api.position.set(
                                (pointer.x * viewport.width) / 2,
                                (pointer.y * viewport.height) / 2,
                                0
                            );
                        },
                    });

                    return () => {
                        unregister();
                    };
                },
                true
            );
        });
    }
}

@Component({
    selector: 'sandbox-effects',
    template: `
        <ngt-effect-composer>
            <ngt-bloom></ngt-bloom>
        </ngt-effect-composer>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EffectsComponent {}

const mat = new THREE.Matrix4();
const vec = new THREE.Vector3();

@Component({
    selector: 'sandbox-clump',
    template: `
        <ngt-instanced-mesh
            [ref]="sphereRef.ref"
            [count]="count"
            castShadow
            receiveShadow
            (beforeRender)="onBeforeRender($event)"
        >
            <ngt-sphere-geometry [args]="[1, 32, 32]"></ngt-sphere-geometry>
            <ngt-mesh-standard-material
                color="red"
                roughness="0"
                envMapIntensity="0.2"
                emissive="#370037"
                [map]="(texture$ | async)!"
            ></ngt-mesh-standard-material>
        </ngt-instanced-mesh>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [NgtTextureLoader, NgtPhysicBody],
})
export class ClumpComponent {
    readonly count = 40;
    readonly texture$ = this.textureLoader.load('assets/cross.jpg');

    sphereRef = this.physicBody.useSphere(() => ({
        args: [1],
        mass: 1,
        angularDamping: 0.1,
        linearDamping: 0.65,
        position: [
            THREE.MathUtils.randFloatSpread(20),
            THREE.MathUtils.randFloatSpread(20),
            THREE.MathUtils.randFloatSpread(20),
        ] as NgtTriple,
    }));

    constructor(
        private textureLoader: NgtTextureLoader,
        private physicBody: NgtPhysicBody
    ) {}

    onBeforeRender($event: {
        state: NgtRenderState;
        object: THREE.InstancedMesh;
    }) {
        for (let i = 0; i < this.count; i++) {
            // Get current whereabouts of the instanced sphere
            $event.object.getMatrixAt(i, mat);
            // Normalize the position and multiply by a negative force.
            // This is enough to drive it towards the center-point.
            this.sphereRef.api
                .at(i)
                .applyForce(
                    vec
                        .setFromMatrixPosition(mat)
                        .normalize()
                        .multiplyScalar(-50)
                        .toArray(),
                    [0, 0, 0]
                );
        }
    }
}

@NgModule({
    declarations: [
        ObjectClumpComponent,
        PointerComponent,
        EffectsComponent,
        ClumpComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([{ path: '', component: ObjectClumpComponent }]),
        NgtEffectComposerModule,
        NgtSSAOModule,
        NgtInstancedMeshModule,
        NgtSphereGeometryModule,
        NgtMeshStandardMaterialModule,
        NgtCanvasModule,
        NgtAmbientLightModule,
        NgtSpotLightModule,
        NgtVector2AttributeModule,
        NgtDirectionalLightModule,
        NgtPhysicsModule,
        NgtSobaEnvironmentModule,
        NgtSobaSkyModule,
        NgtBloomModule,
        NgtValueAttributeModule,
    ],
})
export class ObjectClumpComponentModule {}
