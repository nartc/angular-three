import { NgtCanvasModule, NgtVector3 } from '@angular-three/core';
import { NgtColorAttributeModule } from '@angular-three/core/attributes';
import { NgtBoxGeometryModule } from '@angular-three/core/geometries';
import { NgtGroupModule } from '@angular-three/core/group';
import { NgtBoxHelperModule } from '@angular-three/core/helpers';
import {
    NgtAmbientLightModule,
    NgtPointLightModule,
} from '@angular-three/core/lights';
import { NgtMeshStandardMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtStatsModule } from '@angular-three/core/stats';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule,
} from '@angular/core';
import { Group, Mesh } from 'three';

@Component({
    selector: 'sandbox-cubes',
    template: `
        <ngt-canvas initialLog>
            <ngt-color attach="background" color="lightblue"></ngt-color>

            <ngt-ambient-light></ngt-ambient-light>
            <ngt-point-light [position]="10"></ngt-point-light>

            <sandbox-cube [position]="[-1.2, 0, 0]"></sandbox-cube>
            <sandbox-cube [position]="[1.2, 0, 0]"></sandbox-cube>

            <ngt-stats></ngt-stats>
        </ngt-canvas>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxCubesComponent {
    onGroupBeforeRender(group: Group) {
        group.rotation.z += 0.01;
    }
}

@Component({
    selector: 'sandbox-cube',
    template: `
        <ngt-mesh
            (pointerover)="hovered = true"
            (pointerout)="hovered = false"
            (click)="active = !active"
            (beforeRender)="onBeforeRender($event.object)"
            [scale]="active ? 1.5 : 1"
            [position]="position"
        >
            <ngt-box-geometry></ngt-box-geometry>
            <ngt-mesh-standard-material
                [color]="hovered ? 'hotpink' : 'orange'"
            ></ngt-mesh-standard-material>
        </ngt-mesh>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CubeComponent {
    @Input() position?: NgtVector3;

    hovered = false;
    active = false;

    onBeforeRender(cube: Mesh) {
        cube.rotation.x += 0.01;
    }
}

@NgModule({
    declarations: [SandboxCubesComponent, CubeComponent],
    exports: [SandboxCubesComponent],
    imports: [
        NgtCanvasModule,
        NgtColorAttributeModule,
        NgtAmbientLightModule,
        NgtPointLightModule,
        NgtGroupModule,
        NgtBoxHelperModule,
        NgtStatsModule,
        NgtMeshModule,
        NgtBoxGeometryModule,
        NgtMeshStandardMaterialModule,
    ],
})
export class SandboxCubesModule {}
