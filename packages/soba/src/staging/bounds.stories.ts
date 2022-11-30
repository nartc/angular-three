import {
  NgtAnyRecord,
  NgtArgs,
  NgtCompound,
  NgtObjectCompound,
  NgtPiPipe,
  NgtRadianPipe,
  NgtThreeEvent,
  provideInstanceRef
} from '@angular-three/core';
import { NgtColorAttribute, NgtValueAttribute } from '@angular-three/core/attributes';
import { NgtHemisphereLight, NgtSpotLight } from '@angular-three/core/lights';
import { NgtGroup, NgtMesh } from '@angular-three/core/objects';
import { NgtPrimitive } from '@angular-three/core/primitives';
import { SobaOrbitControls } from '@angular-three/soba/controls';
import { SobaGLTFLoader } from '@angular-three/soba/loaders';
import { SobaBounds, SobaBoundsApi, SobaContactShadows } from '@angular-three/soba/staging';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { map, switchMap } from 'rxjs';
import * as THREE from 'three';
import { NGT_INSTANCE_INPUTS, NGT_INSTANCE_OUTPUTS, NGT_OBJECT3D_INPUTS } from '../common';
import { setupCanvas, setupCanvasImports } from '../setup-canvas';

@Component({
    selector: 'model',
    standalone: true,
    template: `
        <ng-container *ngIf="model$ | async as model">
            <ngt-mesh [objectCompound]="this" [dispose]="null" [material]="model.material" [geometry]="model.geometry">
                <ngt-value [attach]="['material', 'emissive']" value="red"></ngt-value>
                <ngt-value [attach]="['material', 'roughness']" [value]="1"></ngt-value>
            </ngt-mesh>
        </ng-container>
    `,
    providers: [provideInstanceRef(Model, { compound: true })],
    imports: [NgtMesh, NgtObjectCompound, NgtValueAttribute, NgtPrimitive, NgIf, AsyncPipe],
    inputs: [...getInputs(), ...NGT_INSTANCE_INPUTS, ...NGT_OBJECT3D_INPUTS],
    outputs: NGT_INSTANCE_OUTPUTS,
})
class Model extends NgtCompound<NgtMesh> {
    private readonly gltfLoader = inject(SobaGLTFLoader);

    readonly model$ = this.select((s) => s.name).pipe(
        switchMap((name) =>
            this.gltfLoader.load('soba/bounds-assets.glb').pipe(map(({ nodes }) => nodes[name] as THREE.Mesh))
        )
    );

    override get useOnHost(): (keyof NgtMesh | string)[] {
        return [...super.useOnHost, 'dispose', 'material', 'geometry'];
    }
}

@Component({
    selector: 'storybook-default-bounds',
    standalone: true,
    template: `
        <ngt-color attach="background" *args="['#f08080']"></ngt-color>

        <ngt-spot-light [position]="[-100, -100, -100]" [intensity]="0.2" [angle]="0.3" [penumbra]="1"></ngt-spot-light>

        <ngt-hemisphere-light
            color="white"
            groundColor="#ff0f00"
            [position]="[-7, 25, 13]"
            [intensity]="1"
        ></ngt-hemisphere-light>

        <ngt-soba-bounds #bounds>
            <ngt-group (click)="onGroupClick($event, bounds.api)" (pointermissed)="onPointerMissed($event, bounds.api)">
                <model name="Curly" [position]="[1, -11, -20]" [rotation]="[2, 0, -0]"></model>
                <model name="DNA" [position]="[20, 0, -17]" [rotation]="[1, 1, -2]"></model>
                <model name="Headphones" [position]="[20, 2, 4]" [rotation]="[1, 0, -1]"></model>
                <model name="Notebook" [position]="[-21, -15, -13]" [rotation]="[2, 0, 1]"></model>
                <model name="Rocket003" [position]="[18, 15, -25]" [rotation]="[1, 1, 0]"></model>
                <model name="Roundcube001" [position]="[-25, -4, 5]" [rotation]="[1, 0, 0]" [scale]="0.5"></model>
                <model name="Table" [position]="[1, -4, -28]" [rotation]="[1, 0, -1]" [scale]="0.5"></model>
                <model name="VR_Headset" [position]="[7, -15, 28]" [rotation]="[1, 0, -1]" [scale]="5"></model>
                <model name="Zeppelin" [position]="[-20, 10, 10]" [rotation]="[3, -1, 3]" [scale]="0.005"></model>
            </ngt-group>
        </ngt-soba-bounds>

        <ngt-soba-contact-shadows
            [position]="[0, -35, 0]"
            [opacity]="1"
            [width]="200"
            [height]="200"
            [blur]="1"
            [far]="50"
        ></ngt-soba-contact-shadows>

        <ngt-soba-orbit-controls
            [makeDefault]="true"
            [minPolarAngle]="0"
            [maxPolarAngle]="1.75 | pi"
        ></ngt-soba-orbit-controls>
    `,
    imports: [
        NgtColorAttribute,
        NgtSpotLight,
        NgtHemisphereLight,
        SobaBounds,
        NgtGroup,
        Model,
        SobaOrbitControls,
        NgtPiPipe,
        SobaContactShadows,
        NgtValueAttribute,
        NgtRadianPipe,
        NgtArgs
    ],
})
class DefaultBounds {
    onGroupClick(event: NgtThreeEvent<MouseEvent>, api: SobaBoundsApi) {
        event.stopPropagation();
        event.delta <= 2 && api.refresh(event.object).fit();
    }

    onPointerMissed(event: NgtThreeEvent<PointerEvent>, api: SobaBoundsApi) {
        (event as unknown as NgtAnyRecord)['button'] === 0 && api.refresh().fit();
    }
}

export default {
    title: 'Staging/Bounds',
    decorators: [
        componentWrapperDecorator(
            setupCanvas({ camera: { fov: 50, position: [0, -10, 100] }, controls: false, lights: false })
        ),
        moduleMetadata({ imports: [setupCanvasImports, DefaultBounds] }),
    ],
} as Meta;

export const Default: Story = () => ({
    template: `
<storybook-default-bounds></storybook-default-bounds>
    `,
});

function getInputs() {
    return ['geometry', 'material', 'morphTargetInfluences', 'morphTargetDictionary', 'raycast'];
}
