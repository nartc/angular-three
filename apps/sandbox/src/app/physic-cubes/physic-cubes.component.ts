import { BoxProps, NgtPhysicsModule, PlaneProps } from '@angular-three/cannon';
import {
    GetByIndex,
    NgtPhysicBoxModule,
    NgtPhysicPlaneModule,
} from '@angular-three/cannon/bodies';
import { NgtCannonDebugModule } from '@angular-three/cannon/debug';
import {
    NgtCanvasModule,
    NgtColorPipeModule,
    NgtEuler,
    NgtTriple,
    NgtVector3,
} from '@angular-three/core';
import {
    NgtColorAttributeModule,
    NgtVector2AttributeModule,
} from '@angular-three/core/attributes';
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
    selector: 'sandbox-physic-cubes',
    template: `
        <ngt-canvas
            initialLog
            shadows
            [dpr]="[1, 2]"
            [gl]="{ alpha: false }"
            [camera]="{ position: [-1, 5, 5], fov: 45 }"
        >
            <ngt-color attach="background" color="lightblue"></ngt-color>
            <ngt-ambient-light></ngt-ambient-light>
            <ngt-directional-light [position]="10" castShadow>
                <ngt-vector2
                    [attach]="['shadow', 'mapSize']"
                    [vector2]="2048"
                ></ngt-vector2>
            </ngt-directional-light>

            <ngt-physics>
                <sandbox-plane [position]="[0, -2.5, 0]"></sandbox-plane>
                <sandbox-cube [position]="[0.1, 5, 0]"></sandbox-cube>
                <sandbox-cube [position]="[0, 10, -1]"></sandbox-cube>
                <sandbox-cube [position]="[0, 20, -2]"></sandbox-cube>
            </ngt-physics>
        </ngt-canvas>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxPhysicCubesComponent {}

@Component({
    selector: 'sandbox-plane',
    template: `
        <ngt-mesh
            ngtPhysicPlane
            [getPhysicProps]="getPlaneProps"
            receiveShadow
            [position]="position"
            [rotation]="rotation"
        >
            <ngt-plane-geometry [args]="[1000, 1000]"></ngt-plane-geometry>
            <ngt-shadow-material
                color="#171717"
                [transparent]="true"
                [opacity]="0.4"
            ></ngt-shadow-material>
        </ngt-mesh>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxPlaneComponent {
    @Input() position?: NgtVector3;
    rotation = [-Math.PI / 2, 0, 0] as NgtEuler;

    getPlaneProps: GetByIndex<PlaneProps> = () => ({
        args: [1000, 1000],
        rotation: this.rotation as NgtTriple,
        position: this.position as NgtTriple,
    });
}

@Component({
    selector: 'sandbox-cube',
    template: `
        <ngt-mesh
            ngtPhysicBox
            [getPhysicProps]="getCubeProps"
            receiveShadow
            castShadow
            [position]="position"
            [rotation]="rotation"
            [scale]="scale"
        >
            <ngt-box-geometry></ngt-box-geometry>
            <ngt-mesh-lambert-material
                color="hotpink"
            ></ngt-mesh-lambert-material>
        </ngt-mesh>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxCubeComponent {
    @Input() position?: NgtVector3;
    @Input() scale?: NgtVector3 = 1;
    rotation = [0.4, 0.2, 0.5] as NgtEuler;

    getCubeProps: GetByIndex<BoxProps> = () => ({
        mass: 1,
        position: this.position as NgtTriple,
        rotation: this.rotation as NgtTriple,
        args: (Array.isArray(this.scale)
            ? this.scale
            : [this.scale, this.scale, this.scale]) as NgtTriple,
    });
}

@NgModule({
    declarations: [
        SandboxPhysicCubesComponent,
        SandboxPlaneComponent,
        SandboxCubeComponent,
    ],
    exports: [SandboxPhysicCubesComponent],
    imports: [
        NgtCanvasModule,
        NgtColorAttributeModule,
        NgtAmbientLightModule,
        NgtDirectionalLightModule,
        NgtVector2AttributeModule,
        NgtPhysicsModule,
        NgtPhysicPlaneModule,
        NgtMeshModule,
        NgtPlaneGeometryModule,
        NgtShadowMaterialModule,
        NgtPhysicBoxModule,
        NgtBoxGeometryModule,
        NgtMeshLambertMaterialModule,
        NgtCannonDebugModule,
        NgtColorPipeModule,
    ],
})
export class SandboxPhysicCubesModule {}
