import { NgtCanvasModule, NgtRadianPipeModule } from '@angular-three/core';
import {
    NgtBoxGeometryModule,
    NgtPlaneGeometryModule,
    NgtSphereGeometryModule,
} from '@angular-three/core/geometries';
import { NgtDirectionalLightModule } from '@angular-three/core/lights';
import {
    NgtMeshLambertMaterialModule,
    NgtMeshStandardMaterialModule,
} from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtStatsModule } from '@angular-three/core/stats';
import { NgtEffectComposerModule } from '@angular-three/postprocessing';
import { NgtSSAOModule } from '@angular-three/postprocessing/effects';
import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BlendFunction } from 'postprocessing';

@Component({
    selector: 'sandbox-postprocessing-ssao',
    template: `
        <button class="px-4 py-2 rounded bg-gray-300" (click)="toggle()">
            Toggle BlendFunction (current: {{ blendFunctionName }})
        </button>
        <div style="height: 400px; width: 400px">
            <ngt-canvas [camera]="{ position: [10, 10, 10] }">
                <ngt-directional-light
                    castShadow
                    [position]="[2.5, 5, 5]"
                ></ngt-directional-light>

                <sandbox-small-box></sandbox-small-box>
                <sandbox-box></sandbox-box>
                <sandbox-ball></sandbox-ball>
                <sandbox-wall></sandbox-wall>
                <sandbox-ground></sandbox-ground>

                <ngt-effect-composer>
                    <ngt-ssao
                        [options]="{ blendFunction, intensity: 30, samples: 31, radius: 5 }"
                    ></ngt-ssao>
                </ngt-effect-composer>

                <ngt-soba-orbit-controls></ngt-soba-orbit-controls>
                <ngt-stats></ngt-stats>
            </ngt-canvas>
        </div>
    `,
    styles: [
        `
            :host {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                height: 100%;
                width: 100%;
                justify-content: center;
                align-items: center;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostProcessingSSAOComponent {
    blendFunction = BlendFunction.MULTIPLY;

    get blendFunctionName() {
        return this.blendFunction === BlendFunction.NORMAL
            ? 'NORMAL'
            : 'MULTIPLY';
    }

    toggle() {
        this.blendFunction =
            this.blendFunction === BlendFunction.NORMAL
                ? BlendFunction.MULTIPLY
                : BlendFunction.NORMAL;
    }
}

@Component({
    selector: 'sandbox-wall',
    template: `
        <ngt-box-geometry
            #ngtGeometry
            [args]="[16, 12, 1]"
            noAttach
        ></ngt-box-geometry>

        <ngt-mesh-lambert-material
            #ngtMaterial
            noAttach
            color="pink"
        ></ngt-mesh-lambert-material>

        <ngt-mesh
            [position]="[0, 6, -3]"
            [geometry]="ngtGeometry.instance.value"
            [material]="ngtMaterial.instance.value"
            castShadow
            receiveShadow
        >
        </ngt-mesh>
        <ngt-mesh
            [position]="[-8, 6, 5]"
            [rotation]="[0, -90 | radian, 0]"
            [geometry]="ngtGeometry.instance.value"
            [material]="ngtMaterial.instance.value"
            castShadow
            receiveShadow
        >
        </ngt-mesh>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WallComponent {}

@Component({
    selector: 'sandbox-box',
    template: `
        <ngt-mesh [position]="[0, 2.5, 0]" castShadow receiveShadow>
            <ngt-box-geometry [args]="[5, 5, 5]"></ngt-box-geometry>
            <ngt-mesh-lambert-material color="red"></ngt-mesh-lambert-material>
        </ngt-mesh>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoxComponent {}

@Component({
    selector: 'sandbox-small-box',
    template: `
        <ngt-mesh [position]="[6, 1, -1.5]" castShadow receiveShadow>
            <ngt-box-geometry [args]="[2, 2, 2]"></ngt-box-geometry>
            <ngt-mesh-lambert-material
                color="green"
            ></ngt-mesh-lambert-material>
        </ngt-mesh>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmallBoxComponent {}

@Component({
    selector: 'sandbox-ball',
    template: `
        <ngt-mesh [position]="[1, 6, -1]" castShadow receiveShadow>
            <ngt-sphere-geometry [args]="[1, 128, 128]"></ngt-sphere-geometry>
            <ngt-mesh-lambert-material
                color="yellow"
            ></ngt-mesh-lambert-material>
        </ngt-mesh>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BallComponent {}

@Component({
    selector: 'sandbox-ground',
    template: `
        <ngt-mesh [rotation]="[-90 | radian, 0, 0]" receiveShadow>
            <ngt-plane-geometry [args]="[100, 1000]"></ngt-plane-geometry>
            <ngt-mesh-standard-material
                color="#ddddff"
            ></ngt-mesh-standard-material>
        </ngt-mesh>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroundComponent {}

@NgModule({
    declarations: [
        PostProcessingSSAOComponent,
        WallComponent,
        BoxComponent,
        SmallBoxComponent,
        BallComponent,
        GroundComponent,
    ],
    imports: [
        RouterModule.forChild([
            { path: '', component: PostProcessingSSAOComponent },
        ]),
        NgtMeshModule,
        NgtBoxGeometryModule,
        NgtSphereGeometryModule,
        NgtPlaneGeometryModule,
        NgtMeshStandardMaterialModule,
        NgtMeshLambertMaterialModule,
        NgtRadianPipeModule,
        NgtCanvasModule,
        NgtDirectionalLightModule,
        NgtEffectComposerModule,
        NgtSSAOModule,
        NgtSobaOrbitControlsModule,
        NgtStatsModule,
    ],
})
export class PostProcessingSSAOComponentModule {}
