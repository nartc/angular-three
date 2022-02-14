import { NgtCoreModule, NgtVector3 } from '@angular-three/core';
import { NgtBoxGeometryModule } from '@angular-three/core/geometries';
import { NgtGroupModule } from '@angular-three/core/group';
import {
    NgtBoxHelperModule,
    NgtGridHelperModule,
} from '@angular-three/core/helpers';
import {
    NgtAmbientLightModule,
    NgtSpotLightModule,
} from '@angular-three/core/lights';
import { NgtMeshStandardMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtStatsModule } from '@angular-three/core/stats';
import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule,
} from '@angular/core';
import { Object3D } from 'three';

@Component({
    selector: 'demo-simple-cube',
    template: `
        <ngt-canvas [camera]="{ position: [5, 5, 5] }">
            <ngt-ambient-light></ngt-ambient-light>
            <ngt-spot-light [position]="[5, 5, 5]"></ngt-spot-light>

            <ngt-group
                [ngtBoxHelper]="['red']"
                (animateReady)="onGroupAnimate($event.object)"
            >
                <demo-cube [position]="[2, 0, 0]"></demo-cube>
                <demo-cube [position]="[-2, 0, 0]"></demo-cube>
                <demo-cube [position]="[0, 0, 2]"></demo-cube>
                <demo-cube [position]="[0, 0, -2]"></demo-cube>
            </ngt-group>

            <ngt-grid-helper></ngt-grid-helper>
            <ngt-soba-orbit-controls></ngt-soba-orbit-controls>

            <ngt-stats></ngt-stats>
        </ngt-canvas>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleCubeComponent {
    onGroupAnimate(group: Object3D) {
        group.rotation.y += 0.01;
    }
}

@Component({
    selector: 'demo-cube',
    template: `
        <ngt-mesh
            [ngtBoxHelper]="['black']"
            (animateReady)="onCubeAnimate($event.object)"
            (click)="active = !active"
            (pointerover)="hover = true"
            (pointerout)="hover = false"
            [scale]="active ? [1.5, 1.5, 1.5] : [1, 1, 1]"
            [position]="position"
        >
            <ngt-box-geometry></ngt-box-geometry>
            <ngt-mesh-standard-material
                [parameters]="{ color: hover ? 'hotpink' : 'orange' }"
            ></ngt-mesh-standard-material>
        </ngt-mesh>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CubeComponent {
    @Input() position?: NgtVector3;

    hover = false;
    active = false;

    onCubeAnimate(cube: Object3D) {
        cube.rotation.x = cube.rotation.y += 0.01;
    }
}

@NgModule({
    declarations: [SimpleCubeComponent, CubeComponent],
    exports: [SimpleCubeComponent],
    imports: [
        NgtCoreModule,
        NgtBoxGeometryModule,
        NgtMeshStandardMaterialModule,
        NgtAmbientLightModule,
        NgtSpotLightModule,
        NgtBoxHelperModule,
        NgtStatsModule,
        NgtMeshModule,
        NgtSobaOrbitControlsModule,
        NgtGridHelperModule,
        NgtGroupModule,
    ],
})
export class SimpleCubeComponentModule {}
