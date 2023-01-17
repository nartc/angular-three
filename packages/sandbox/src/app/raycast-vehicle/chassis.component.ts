import { extend, injectNgtRef, NgtPush } from '@angular-three/core';
import { injectNgtsGLTFLoader } from '@angular-three/soba/loaders';
import { NgIf } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Group, Material, Mesh } from 'three';
import { GLTF } from 'three-stdlib';

injectNgtsGLTFLoader.preload('assets/Beetle.glb');

const beetleMaterials = [
    'Black paint',
    'Black plastic',
    'Chrom',
    'Glass',
    'Headlight',
    'Interior (dark)',
    'Interior (light)',
    'License Plate',
    'Orange plastic',
    'Paint',
    'Reflector',
    'Reverse lights',
    'Rubber',
    'Steel',
    'Tail lights',
    'Underbody',
] as const;
type BeetleMaterial = (typeof beetleMaterials)[number];

const beetleNodes = [
    'chassis_1',
    'chassis_2',
    'chassis_3',
    'chassis_4',
    'chassis_5',
    'chassis_6',
    'chassis_7',
    'chassis_8',
    'chassis_9',
    'chassis_10',
    'chassis_11',
    'chassis_12',
    'chassis_13',
    'chassis_14',
    'chassis_15',
    'chassis_16',
] as const;
type BeetleNode = (typeof beetleNodes)[number];

type BeetleGLTF = GLTF & {
    materials: Record<BeetleMaterial, Material>;
    nodes: Record<BeetleNode, Mesh>;
};

extend({ Mesh, Group });

@Component({
    selector: 'sandbox-chassis',
    standalone: true,
    template: `
        <ngt-mesh *ngIf="beetle$ | ngtPush : null as beetle" [ref]="ref">
            <ngt-group [position]="[0, -0.6, 0]">
                <ngt-mesh
                    castShadow
                    [material]="beetle.materials['Black paint']"
                    [geometry]="beetle.nodes.chassis_1.geometry"
                />
                <ngt-mesh
                    castShadow
                    [material]="beetle.materials.Rubber"
                    [geometry]="beetle.nodes.chassis_2.geometry"
                />
                <ngt-mesh castShadow [material]="beetle.materials.Paint" [geometry]="beetle.nodes.chassis_3.geometry" />
                <ngt-mesh
                    castShadow
                    [material]="beetle.materials.Underbody"
                    [geometry]="beetle.nodes.chassis_4.geometry"
                />
                <ngt-mesh castShadow [material]="beetle.materials.Chrom" [geometry]="beetle.nodes.chassis_5.geometry" />
                <ngt-mesh
                    castShadow
                    [material]="beetle.materials['Interior (dark)']"
                    [geometry]="beetle.nodes.chassis_6.geometry"
                />
                <ngt-mesh
                    castShadow
                    [material]="beetle.materials['Interior (light)']"
                    [geometry]="beetle.nodes.chassis_7.geometry"
                />
                <ngt-mesh
                    castShadow
                    [material]="beetle.materials.Reflector"
                    [geometry]="beetle.nodes.chassis_8.geometry"
                />
                <ngt-mesh [material]="beetle.materials.Glass" [geometry]="beetle.nodes.chassis_9.geometry">
                    <ngt-value [rawValue]="false" attach="material.transparent" />
                    <ngt-value [rawValue]="'black'" attach="material.color" />
                </ngt-mesh>
                <ngt-mesh
                    castShadow
                    [material]="beetle.materials.Steel"
                    [geometry]="beetle.nodes.chassis_10.geometry"
                />
                <ngt-mesh
                    castShadow
                    [material]="beetle.materials['Black plastic']"
                    [geometry]="beetle.nodes.chassis_11.geometry"
                />
                <ngt-mesh [material]="beetle.materials.Headlight" [geometry]="beetle.nodes.chassis_12.geometry" />
                <ngt-mesh
                    castShadow
                    [material]="beetle.materials['Reverse lights']"
                    [geometry]="beetle.nodes.chassis_13.geometry"
                />
                <ngt-mesh
                    castShadow
                    [material]="beetle.materials['Orange plastic']"
                    [geometry]="beetle.nodes.chassis_14.geometry"
                />
                <ngt-mesh
                    castShadow
                    [material]="beetle.materials['Tail lights']"
                    [geometry]="beetle.nodes.chassis_15.geometry"
                />
                <ngt-mesh
                    castShadow
                    [material]="beetle.materials['License Plate']"
                    [geometry]="beetle.nodes.chassis_16.geometry"
                />
            </ngt-group>
        </ngt-mesh>
    `,
    imports: [NgtPush, NgIf],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Chassis {
    readonly beetle$ = injectNgtsGLTFLoader('assets/Beetle.glb') as Observable<BeetleGLTF>;
    @Input() ref = injectNgtRef<Mesh>();
    @Output() bettle = this.beetle$;
}
