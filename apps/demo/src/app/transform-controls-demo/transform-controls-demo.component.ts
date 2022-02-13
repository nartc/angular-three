import { NgtColorPipeModule, NgtCoreModule } from '@angular-three/core';
import { NgtBoxGeometryModule } from '@angular-three/core/geometries';
import {
    NgtAmbientLightModule,
    NgtPointLightModule,
} from '@angular-three/core/lights';
import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtStatsModule } from '@angular-three/core/stats';
import {
    NgtSobaOrbitControlsModule,
    NgtSobaTransformControlsModule,
} from '@angular-three/soba/controls';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
    selector: 'demo-transform-controls',
    template: `
        <ngt-canvas
            [shadows]="true"
            [camera]="{ position: [-5, 5, 5], fov: 75 }"
            [scene]="{ background: 'black' | color }"
        >
            <ngt-stats></ngt-stats>

            <ngt-ambient-light [intensity]="0.8"></ngt-ambient-light>
            <ngt-point-light
                [intensity]="1"
                [position]="[0, 6, 0]"
            ></ngt-point-light>

            <ngt-soba-transform-controls>
                <ngt-mesh>
                    <ngt-box-geometry></ngt-box-geometry>
                    <ngt-mesh-basic-material
                        [parameters]="{ wireframe: true }"
                    ></ngt-mesh-basic-material>
                </ngt-mesh>
            </ngt-soba-transform-controls>

            <ngt-soba-orbit-controls
                [makeDefault]="true"
            ></ngt-soba-orbit-controls>
        </ngt-canvas>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransformControlsDemoComponent {}

@NgModule({
    declarations: [TransformControlsDemoComponent],
    exports: [TransformControlsDemoComponent],
    imports: [
        NgtCoreModule,
        NgtColorPipeModule,
        NgtStatsModule,
        NgtAmbientLightModule,
        NgtPointLightModule,
        NgtSobaOrbitControlsModule,
        NgtSobaTransformControlsModule,
        NgtMeshModule,
        NgtBoxGeometryModule,
        NgtMeshBasicMaterialModule,
    ],
})
export class TransformControlsDemoComponentModule {}
