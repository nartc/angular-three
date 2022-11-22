import { Component } from '@angular/core';
import { NgtArgs, NgtCanvas, NgtRenderState } from 'angular-three';
import { NgtColorAttribute } from 'angular-three/attributes';
import { NgtBoxGeometry } from 'angular-three/geometries';
import { NgtBoxHelper, NgtGridHelper } from 'angular-three/helpers';
import { NgtMeshBasicMaterial, NgtMeshStandardMaterial } from 'angular-three/materials';
import { NgtMesh } from 'angular-three/objects';
import { NgtAmbientLight } from 'angular-three/lights';

@Component({
    selector: 'angular-three-root',
    standalone: true,
    template: `
        <ngt-canvas [camera]="{ position: [5, 5, 5] }">
            <ng-template>
                <ngt-color *args="['lightblue']" attach="background"></ngt-color>

                <ngt-ambient-light></ngt-ambient-light>

                <ngt-mesh #cube [beforeRender]="onBeforeRender">
                    <ngt-box-helper *args="[cube, 'red']"></ngt-box-helper>
                    <ngt-box-geometry></ngt-box-geometry>
                    <ngt-mesh-standard-material color="hotpink"></ngt-mesh-standard-material>
                </ngt-mesh>
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
    ],
})
export class AppComponent {
    onBeforeRender(_: NgtRenderState, cube: THREE.Mesh) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    }
}
