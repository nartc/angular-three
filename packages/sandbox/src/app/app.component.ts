import { Component } from '@angular/core';
import { NgtArgs, NgtCanvas } from 'angular-three';
import { NgtMesh } from 'angular-three/objects';
import { NgtMeshBasicMaterial } from 'angular-three/materials';
import { NgtBoxGeometry } from 'angular-three/geometries';
import { NgtColorAttribute } from 'angular-three/attributes';

@Component({
    selector: 'angular-three-root',
    standalone: true,
    template: `
        <ngt-canvas>
            <ng-template>
                <ngt-color *args="['lightblue']" attach="background"></ngt-color>
                <ngt-mesh>
                    <ngt-box-geometry></ngt-box-geometry>
                    <ngt-mesh-basic-material color="hotpink"></ngt-mesh-basic-material>
                </ngt-mesh>
            </ng-template>
        </ngt-canvas>
    `,
    imports: [NgtCanvas, NgtMesh, NgtMeshBasicMaterial, NgtBoxGeometry, NgtColorAttribute, NgtArgs],
})
export class AppComponent {}
