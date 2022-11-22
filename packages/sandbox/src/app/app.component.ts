import { Component } from '@angular/core';
import { NgtArgs, NgtCanvas, NgtRenderState } from 'angular-three';
import { NgtColorAttribute } from 'angular-three/attributes';
import { NgtBoxGeometry } from 'angular-three/geometries';
import { NgtBoxHelper, NgtGridHelper } from 'angular-three/helpers';
import { NgtMeshBasicMaterial, NgtMeshStandardMaterial } from 'angular-three/materials';
import { NgtGroup, NgtMesh } from 'angular-three/objects';
import { NgtAmbientLight, NgtPointLight } from 'angular-three/lights';

@Component({
    selector: 'angular-three-root',
    standalone: true,
    template: `
        <ngt-canvas [camera]="{ position: [2, 2, 2] }">
            <ng-template>
                <ngt-color *args="['lightblue']" attach="background"></ngt-color>

                <ngt-ambient-light></ngt-ambient-light>
                <ngt-point-light [intensity]="2" [position]="[2, 2, 2]"></ngt-point-light>

                <ngt-group [beforeRender]="onGroupBeforeRender">
                    <ngt-mesh #cubeOne [beforeRender]="onBeforeRender" [position]="[1.5, 0, 0]">
                        <ngt-box-helper *args="[cubeOne, 'red']"></ngt-box-helper>
                        <ngt-box-geometry></ngt-box-geometry>
                        <ngt-mesh-standard-material color="hotpink"></ngt-mesh-standard-material>
                    </ngt-mesh>

                    <ngt-mesh #cubeTwo [beforeRender]="onBeforeRender" [position]="[-1.5, 0, 0]">
                        <ngt-box-helper *args="[cubeTwo, 'orange']"></ngt-box-helper>
                        <ngt-box-geometry></ngt-box-geometry>
                        <ngt-mesh-standard-material color="hotpink"></ngt-mesh-standard-material>
                    </ngt-mesh>
                </ngt-group>
                <ngt-grid-helper *args="[20, 20]"></ngt-grid-helper>
            </ng-template>
        </ngt-canvas>
    `,
    imports: [
        NgtCanvas,
        NgtMesh,
        NgtMeshBasicMaterial,
        NgtBoxGeometry,
        NgtColorAttribute,
        NgtArgs,
        NgtBoxHelper,
        NgtGridHelper,
        NgtMeshStandardMaterial,
        NgtAmbientLight,
        NgtPointLight,
        NgtGroup,
    ],
})
export class AppComponent {
    onBeforeRender(_: NgtRenderState, cube: THREE.Mesh) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    }

    onGroupBeforeRender(_: NgtRenderState, group: THREE.Group) {
        group.rotation.z += 0.01;
    }
}
