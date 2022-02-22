import {
    GetByIndex,
    NgtPhysicsModule,
    PlaneProps,
    SphereProps,
} from '@angular-three/cannon';
import {
    NgtPhysicPlaneModule,
    NgtPhysicSphere,
    NgtPhysicSphereModule,
} from '@angular-three/cannon/bodies';
import { NgtCannonDebugModule } from '@angular-three/cannon/debug';
import {
    NgtColorPipeModule,
    NgtCoreModule,
    NgtEuler,
    NgtRadianPipeModule,
    NgtTriplet,
    NgtVector3,
} from '@angular-three/core';
import {
    NgtPlaneGeometryModule,
    NgtSphereGeometryModule,
} from '@angular-three/core/geometries';
import {
    NgtDirectionalLightModule,
    NgtHemisphereLightModule,
} from '@angular-three/core/lights';
import {
    NgtMeshStandardMaterialModule,
    NgtShadowMaterialModule,
} from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls';
import {
    ChangeDetectionStrategy,
    Component,
    NgModule,
    ViewChild,
} from '@angular/core';

@Component({
    selector: 'storybook-sphere-debug',
    template: `
        <ngt-canvas
            [shadows]="true"
            [camera]="{ position: [-1, 2, 4] }"
            [scene]="{ background: '#a6d1f6' | color }"
        >
            <ngt-hemisphere-light></ngt-hemisphere-light>
            <ngt-directional-light
                [castShadow]="true"
                [position]="[5, 10, 5]"
            ></ngt-directional-light>

            <ngt-physics [allowSleep]="true">
                <ngt-cannon-debug [scale]="1.1">
                    <storybook-plane></storybook-plane>
                    <storybook-scalable-ball></storybook-scalable-ball>
                </ngt-cannon-debug>
            </ngt-physics>

            <ngt-soba-orbit-controls></ngt-soba-orbit-controls>
        </ngt-canvas>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SphereDebugComponent {}

@Component({
    selector: 'storybook-plane',
    template: `
        <ngt-mesh
            ngtPhysicPlane
            [getPhysicProps]="getPlaneProps"
            [rotation]="rotation"
            [receiveShadow]="true"
        >
            <ngt-plane-geometry [args]="[20, 20]"></ngt-plane-geometry>
            <ngt-shadow-material
                [parameters]="{ color: '#171717' }"
            ></ngt-shadow-material>
        </ngt-mesh>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaneComponent {
    rotation = [-Math.PI / 2, 0, 0] as NgtEuler;

    getPlaneProps: GetByIndex<PlaneProps> = () => ({
        type: 'Static',
        rotation: this.rotation as NgtTriplet,
    });
}

@Component({
    selector: 'storybook-scalable-ball',
    template: `
        <ngt-mesh
            ngtPhysicSphere
            [getPhysicProps]="getBallProps"
            [castShadow]="true"
            [receiveShadow]="true"
            [position]="position"
            (click)="onClick()"
        >
            <ngt-sphere-geometry [args]="[1, 32, 32]"></ngt-sphere-geometry>
            <ngt-mesh-standard-material
                [parameters]="{
                    color: 'blue',
                    transparent: true,
                    opacity: 0.5
                }"
            ></ngt-mesh-standard-material>
        </ngt-mesh>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScalableBallComponent {
    isSleeping = false;

    position = [0, 5, 0] as NgtVector3;

    @ViewChild(NgtPhysicSphere, { static: true })
    physicSphere!: NgtPhysicSphere;

    getBallProps: GetByIndex<SphereProps> = () => ({
        args: [1],
        mass: 1,
        position: this.position as NgtTriplet,
    });

    onClick() {
        this.isSleeping
            ? this.physicSphere.api.wakeUp()
            : this.physicSphere.api.sleep();
        this.isSleeping = !this.isSleeping;
    }
}

@NgModule({
    declarations: [SphereDebugComponent, ScalableBallComponent, PlaneComponent],
    exports: [SphereDebugComponent],
    imports: [
        NgtCoreModule,
        NgtHemisphereLightModule,
        NgtDirectionalLightModule,
        NgtPhysicsModule,
        NgtCannonDebugModule,
        NgtMeshModule,
        NgtPlaneGeometryModule,
        NgtShadowMaterialModule,
        NgtPhysicPlaneModule,
        NgtPhysicSphereModule,
        NgtRadianPipeModule,
        NgtSphereGeometryModule,
        NgtMeshStandardMaterialModule,
        NgtColorPipeModule,
        NgtSobaOrbitControlsModule,
    ],
})
export class SphereDebugComponentModule {}
