import { BoxProps, GetByIndex, NgtPhysicsModule } from '@angular-three/cannon';
import {
    NgtPhysicBoxModule,
    NgtPhysicPlaneModule,
} from '@angular-three/cannon/bodies';
import {
    NgtColorPipeModule,
    NgtCoreModule,
    NgtEuler,
    NgtRadianPipeModule,
    NgtTriplet,
    NgtVector3,
    NgtVectorPipeModule,
} from '@angular-three/core';
import {
    NgtBoxGeometryModule,
    NgtPlaneGeometryModule,
} from '@angular-three/core/geometries';
import {
    NgtAmbientLightModule,
    NgtDirectionalLightModule,
} from '@angular-three/core/lights';
import {
    NgtMeshLambertMaterialModule,
    NgtShadowMaterialModule,
} from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule,
} from '@angular/core';

@Component({
    selector: 'storybook-simple-physics',
    template: `
        <ngt-canvas
            [shadows]="true"
            [gl]="{ alpha: false }"
            [camera]="{ position: [-1, 5, 5], fov: 45 }"
            [scene]="{ background: 'lightblue' | color }"
        >
            <ngt-ambient-light></ngt-ambient-light>
            <ngt-directional-light
                [position]="[10, 10, 10]"
                [castShadow]="true"
                [shadow]="{ mapSize: [2048, 2048] | vector2 }"
            ></ngt-directional-light>

            <ngt-physics>
                <storybook-plane [position]="[0, -2.5, 0]"></storybook-plane>
                <storybook-cube [position]="[0.1, 5, 0]"></storybook-cube>
                <storybook-cube [position]="[0, 10, -1]"></storybook-cube>
                <storybook-cube [position]="[0, 20, -2]"></storybook-cube>
            </ngt-physics>
        </ngt-canvas>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimplePhysicsComponent {}

@Component({
    selector: 'storybook-single-simple-physics',
    template: `
        <ngt-canvas
            [shadows]="true"
            [gl]="{ alpha: false }"
            [camera]="{ position: [-1, 5, 5], fov: 45 }"
            [scene]="{ background: 'lightblue' | color }"
        >
            <ngt-ambient-light></ngt-ambient-light>
            <ngt-directional-light
                [position]="[10, 10, 10]"
                [castShadow]="true"
                [shadow]="{ mapSize: [2048, 2048] | vector2 }"
            ></ngt-directional-light>

            <ngt-physics>
                <storybook-plane [position]="[0, -2.5, 0]"></storybook-plane>
                <storybook-cube [position]="[0.1, 5, 0]"></storybook-cube>
            </ngt-physics>
        </ngt-canvas>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleSinglePhysicsComponent {}

@Component({
    selector: 'storybook-plane',
    template: `
        <ngt-mesh
            ngtPhysicPlane
            [receiveShadow]="true"
            [position]="position"
            [rotation]="[-90 | radian, 0, 0]"
        >
            <ngt-plane-geometry [args]="[1000, 1000]"></ngt-plane-geometry>
            <ngt-shadow-material
                [parameters]="{
                    color: '#171717',
                    transparent: true,
                    opacity: 0.4
                }"
            ></ngt-shadow-material>
        </ngt-mesh>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaneComponent {
    @Input() position?: NgtVector3;
}

@Component({
    selector: 'storybook-cube',
    template: `
        <ngt-mesh
            ngtPhysicBox
            [getPhysicProps]="getCubeProps"
            [receiveShadow]="true"
            [castShadow]="true"
            [position]="position"
            [rotation]="rotation"
        >
            <ngt-box-geometry></ngt-box-geometry>
            <ngt-mesh-lambert-material
                [parameters]="{ color: 'hotpink' }"
            ></ngt-mesh-lambert-material>
        </ngt-mesh>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CubeComponent {
    @Input() position?: NgtVector3;
    rotation = [0.4, 0.2, 0.5] as NgtEuler;

    getCubeProps: GetByIndex<BoxProps> = () => ({
        mass: 1,
        position: this.position as NgtTriplet,
        rotation: this.rotation as NgtTriplet,
    });
}

@NgModule({
    declarations: [
        SimplePhysicsComponent,
        SimpleSinglePhysicsComponent,
        PlaneComponent,
        CubeComponent,
    ],
    exports: [SimplePhysicsComponent, SimpleSinglePhysicsComponent],
    imports: [
        NgtAmbientLightModule,
        NgtBoxGeometryModule,
        NgtColorPipeModule,
        NgtCoreModule,
        NgtDirectionalLightModule,
        NgtMeshLambertMaterialModule,
        NgtMeshModule,
        NgtPhysicBoxModule,
        NgtPhysicPlaneModule,
        NgtPhysicsModule,
        NgtPlaneGeometryModule,
        NgtRadianPipeModule,
        NgtShadowMaterialModule,
        NgtVectorPipeModule,
    ],
})
export class SimplePhysicsComponentModule {}