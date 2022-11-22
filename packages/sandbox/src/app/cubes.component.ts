import { Component, Input } from '@angular/core';
import * as THREE from 'three';
import { NgtArgs, NgtCanvas, NgtRenderState, NgtVector3 } from 'angular-three';
import { NgtColorAttribute } from 'angular-three/attributes';
import { NgtAmbientLight, NgtPointLight } from 'angular-three/lights';
import { NgtMesh } from 'angular-three/objects';
import { NgtBoxGeometry } from 'angular-three/geometries';
import { NgtMeshStandardMaterial } from 'angular-three/materials';
import { NgForOf } from '@angular/common';
import { NgtStats } from 'angular-three/stats';

@Component({
    selector: 'cube',
    standalone: true,
    template: `
        <ngt-mesh
            (pointerover)="hovered = true"
            (pointerout)="hovered = false"
            (click)="active = !active"
            [beforeRender]="onBeforeRender"
            [scale]="active ? 1.5 : 1"
            [position]="position"
        >
            <ngt-box-geometry></ngt-box-geometry>
            <ngt-mesh-standard-material [color]="hovered ? 'tomato' : 'orange'"></ngt-mesh-standard-material>
        </ngt-mesh>
    `,
    imports: [NgtMesh, NgtBoxGeometry, NgtMeshStandardMaterial],
})
class Cube {
    @Input() position: NgtVector3 = [0, 0, 0];

    hovered = false;
    active = false;

    onBeforeRender(_: NgtRenderState, cube: THREE.Mesh) {
        cube.rotation.x = cube.rotation.y += 0.01;
    }
}

@Component({
    selector: 'cube-with-materials',
    standalone: true,
    template: `
        <ngt-mesh [beforeRender]="onBeforeRender">
            <ngt-box-geometry></ngt-box-geometry>
            <ngt-mesh-standard-material
                *ngFor="let color of colors; index as i"
                [attach]="['material', i]"
                [color]="color"
            ></ngt-mesh-standard-material>
        </ngt-mesh>
    `,
    imports: [NgtMesh, NgtBoxGeometry, NgtMeshStandardMaterial, NgForOf],
})
class CubeWithMaterials {
    readonly colors = ['red', 'green', 'blue', 'hotpink', 'orange', 'teal'] as const;

    onBeforeRender(_: NgtRenderState, cube: THREE.Mesh) {
        cube.rotation.x = cube.rotation.y += 0.01;
    }
}

@Component({
    selector: 'scene',
    standalone: true,
    template: `
        <ngt-ambient-light></ngt-ambient-light>
        <ngt-point-light [position]="10"></ngt-point-light>

        <cube [position]="[-1.5, 0, 0]"></cube>
        <cube [position]="[1.5, 0, 0]"></cube>

        <cube-with-materials></cube-with-materials>

        <!--        <ngt-soba-orbit-controls></ngt-soba-orbit-controls>-->
    `,
    imports: [Cube, CubeWithMaterials, NgtAmbientLight, NgtPointLight],
})
class Scene {}

@Component({
    selector: 'angular-three-cubes',
    standalone: true,
    template: `
        <ngt-canvas [camera]="{ position: [5, 5, 5] }">
            <ng-template>
                <ngt-color *args="['lightblue']" attach="background"></ngt-color>
                <scene></scene>
            </ng-template>
        </ngt-canvas>
        <ngt-stats></ngt-stats>
    `,

    imports: [Scene, NgtCanvas, NgtColorAttribute, NgtArgs, NgtStats],
})
export class Cubes {}
