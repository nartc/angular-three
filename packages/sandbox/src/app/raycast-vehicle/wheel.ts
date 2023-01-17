import { injectCompoundBody } from '@angular-three/cannon/services';
import { extend, NgtPush } from '@angular-three/core';
import { injectNgtsGLTFLoader } from '@angular-three/soba/loaders';
import { NgIf } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Group, Material, Mesh } from 'three';
import { GLTF } from 'three-stdlib';

injectNgtsGLTFLoader.preload('assets/wheel.glb');

type WheelGLTF = GLTF & {
    materials: Record<'Chrom' | 'Rubber' | 'Steel', Material>;
    nodes: Record<'wheel_1' | 'wheel_2' | 'wheel_3', Mesh>;
};

extend({ Group, Mesh });

@Component({
    selector: 'sandbox-wheel',
    standalone: true,
    template: `
        <ngt-group *ngIf="wheel$ | ngtPush : null as wheel" [ref]="compound.ref">
            <ngt-group [rotation]="[0, 0, leftSide ? Math.PI / 2 : -Math.PI / 2]">
                <ngt-mesh [material]="wheel.materials.Rubber" [geometry]="wheel.nodes.wheel_1.geometry" />
                <ngt-mesh [material]="wheel.materials.Steel" [geometry]="wheel.nodes.wheel_2.geometry" />
                <ngt-mesh [material]="wheel.materials.Chrom" [geometry]="wheel.nodes.wheel_3.geometry" />
            </ngt-group>
        </ngt-group>
    `,
    imports: [NgIf, NgtPush],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Wheel {
    readonly wheel$ = injectNgtsGLTFLoader('assets/wheel.glb') as Observable<WheelGLTF>;

    @Input() radius = 0.7;
    @Input() leftSide = false;

    readonly Math = Math;
    readonly compound = injectCompoundBody<Group>(
        () => ({
            collisionFilterGroup: 0,
            mass: 1,
            material: 'wheel',
            shapes: [{ args: [this.radius, this.radius, 0.5, 16], rotation: [0, 0, -Math.PI / 2], type: 'Cylinder' }],
            type: 'Kinematic',
        }),
        { waitFor: this.wheel$ }
    );

    @Output() ref = this.compound.ref.$;
}
