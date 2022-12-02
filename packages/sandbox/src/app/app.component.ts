import { createBeforeRenderCallback, NgtCanvas } from '@angular-three/core';
import { NgtBoxGeometry } from '@angular-three/core/geometries';
import { NgtMeshBasicMaterial, NgtMeshNormalMaterial } from '@angular-three/core/materials';
import { NgtMesh } from '@angular-three/core/objects';
import { SobaText3D } from '@angular-three/soba/abstractions';
import { SobaCenter, SobaFloat } from '@angular-three/soba/staging';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'cube',
    standalone: true,
    template: `
        <ngt-mesh
            [beforeRender]="beforeRender"
            [position]="position"
            (click)="active = !active"
            (pointerover)="hover = true"
            (pointerout)="hover = false"
            [scale]="active ? 1.5 : 1"
        >
            <ngt-box-geometry></ngt-box-geometry>
            <ngt-mesh-basic-material [color]="hover ? 'red' : 'yellow'"></ngt-mesh-basic-material>
        </ngt-mesh>
    `,
    imports: [NgtMesh, NgtBoxGeometry, NgtMeshBasicMaterial],
})
export class Cube {
    @Input() position: [number, number, number] = [0, 0, 0];

    hover = false;
    active = false;

    readonly beforeRender = createBeforeRenderCallback<THREE.Mesh>(({ object }) => {
        object.rotation.x += 0.01;
        object.rotation.y += 0.01;
    });
}

@Component({
    selector: 'angular-three-root',
    standalone: true,
    template: `
        <ngt-canvas [camera]="{ position: [0, 0, 20] }">
            <cube></cube>
        </ngt-canvas>
    `,
    imports: [NgtCanvas, Cube, SobaText3D, NgtMeshNormalMaterial, SobaCenter, SobaFloat],
})
export class AppComponent {
    readonly beforeRender = createBeforeRenderCallback<THREE.Group>(({ object }) => {
        object.rotation.x += 0.01;
    });
}
