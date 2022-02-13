import { NgtRadianPipeModule, NgtStore } from '@angular-three/core';
import {
    NgtBoxGeometryModule,
    NgtPlaneGeometryModule,
} from '@angular-three/core/geometries';
import { NgtMeshPhongMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import {
    NGT_SOBA_DEPTH_BUFFER_PROVIDER,
    NgtSobaDepthBuffer,
} from '@angular-three/soba/misc';
import { NgtSobaSpotLightModule } from '@angular-three/soba/staging';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import {
    componentWrapperDecorator,
    Meta,
    moduleMetadata,
    Story,
} from '@storybook/angular';
import { map } from 'rxjs';
import * as THREE from 'three';
import { setupCanvas, setupCanvasModules } from '../../setup-canvas';

@Component({
    selector: 'ngt-default-spot-light',
    template: `
        <ngt-soba-spot-light
            [penumbra]="0.5"
            [position]="[-3, 2, 0]"
            [intensity]="0.5"
            [angle]="0.5"
            color="#0EEC82"
            [castShadow]="true"
            [depthBuffer]="depthBuffer"
        ></ngt-soba-spot-light>

        <ngt-soba-spot-light
            [penumbra]="0.5"
            [position]="[3, 2, 0]"
            [intensity]="0.5"
            [angle]="0.5"
            color="#FF005B"
            [castShadow]="true"
            [depthBuffer]="depthBuffer"
        ></ngt-soba-spot-light>

        <ngt-mesh [position]="[0, 0.5, 0]" [castShadow]="true">
            <ngt-box-geometry></ngt-box-geometry>
            <ngt-mesh-phong-material></ngt-mesh-phong-material>
        </ngt-mesh>

        <ngt-mesh [receiveShadow]="true" [rotation]="[-90 | radian, 0, 0]">
            <ngt-plane-geometry [args]="[100, 100]"></ngt-plane-geometry>
            <ngt-mesh-phong-material></ngt-mesh-phong-material>
        </ngt-mesh>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [NGT_SOBA_DEPTH_BUFFER_PROVIDER],
})
class DefaultSpotLight extends NgtStore<{
    depthBuffer: THREE.DepthTexture;
}> {
    constructor(sobaDepthBuffer: NgtSobaDepthBuffer) {
        super();
        this.set(
            sobaDepthBuffer.use().pipe(map((depthBuffer) => ({ depthBuffer })))
        );
    }

    get depthBuffer() {
        return this.get((s) => s.depthBuffer);
    }
}

@NgModule({
    declarations: [DefaultSpotLight],
    exports: [DefaultSpotLight],
    imports: [
        NgtSobaSpotLightModule,
        NgtMeshPhongMaterialModule,
        NgtMeshModule,
        NgtPlaneGeometryModule,
        NgtBoxGeometryModule,
        CommonModule,
        NgtRadianPipeModule,
    ],
})
class DefaultSpotLightModule {}

export default {
    title: 'Soba/Staging/Spot Light',
    decorators: [
        componentWrapperDecorator(setupCanvas({ lights: false })),
        moduleMetadata({
            imports: [...setupCanvasModules, DefaultSpotLightModule],
        }),
    ],
} as Meta;

export const Default: Story = (args) => ({
    props: args,
    template: `
    <ngt-default-spot-light></ngt-default-spot-light>
  `,
});
