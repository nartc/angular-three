import { NgtcPhysics } from '@angular-three/cannon';
import { injectHeightfield, injectSphere } from '@angular-three/cannon/services';
import { extend, injectNgtRef, NgtArgs, NgtRxStore } from '@angular-three/core';
import { NgtsOrbitControls } from '@angular-three/soba/controls';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { Triplet } from '@pmndrs/cannon-worker-api';

// @ts-ignore
import niceColors from 'nice-color-palettes';
import { combineLatest } from 'rxjs';
import {
    AmbientLight,
    BufferGeometry,
    Color,
    DirectionalLight,
    Float32BufferAttribute,
    InstancedBufferAttribute,
    InstancedMesh,
    Mesh,
    MeshPhongMaterial,
    SphereGeometry,
} from 'three';

type GenerateHeightmapArgs = {
    height: number;
    number: number;
    scale: number;
    width: number;
};

/* Generates a 2D array using Worley noise. */
function generateHeightmap({ width, height, number, scale }: GenerateHeightmapArgs) {
    const data = [];

    const seedPoints = [];
    for (let i = 0; i < number; i++) {
        seedPoints.push([Math.random(), Math.random()]);
    }

    let max = 0;
    for (let i = 0; i < width; i++) {
        const row = [];
        for (let j = 0; j < height; j++) {
            let min = Infinity;
            seedPoints.forEach((p) => {
                const distance2 = (p[0] - i / width) ** 2 + (p[1] - j / height) ** 2;
                if (distance2 < min) {
                    min = distance2;
                }
            });
            const d = Math.sqrt(min);
            if (d > max) {
                max = d;
            }
            row.push(d);
        }
        data.push(row);
    }

    /* Normalize and scale. */
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            data[i][j] *= scale / max;
        }
    }
    return data;
}

extend({
    Mesh,
    BufferGeometry,
    MeshPhongMaterial,
    InstancedMesh,
    SphereGeometry,
    InstancedBufferAttribute,
    Color,
    AmbientLight,
    DirectionalLight,
});

@Component({
    selector: 'spheres[columns][rows][spread]',
    standalone: true,
    template: `
        <ngt-instanced-mesh *args="[undefined, undefined, number]" [ref]="sphereBody.ref" castShadow receiveShadow>
            <ngt-sphere-geometry *args="[0.2, 16, 16]">
                <ngt-instanced-buffer-attribute attach="attributes.color" *args="[colors, 3]" />
            </ngt-sphere-geometry>
            <ngt-mesh-phong-material vertexColors />
        </ngt-instanced-mesh>
    `,
    imports: [NgtArgs],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Spheres implements OnInit {
    @Input() columns = 0;
    @Input() rows = 0;
    @Input() spread = 0;

    readonly sphereBody = injectSphere<InstancedMesh>((index) => ({
        args: [0.2],
        mass: 1,
        position: [
            ((index % this.columns) - (this.columns - 1) / 2) * this.spread,
            2.0,
            (Math.floor(index / this.columns) - (this.rows - 1) / 2) * this.spread,
        ],
    }));

    colors!: Float32Array;

    get number() {
        return this.columns * this.rows;
    }

    ngOnInit() {
        this.colors = new Float32Array(this.number * 3);
        const color = new Color();
        for (let i = 0; i < this.number; i++) {
            color
                .set(niceColors[17][Math.floor(Math.random() * 5)])
                .convertSRGBToLinear()
                .toArray(this.colors, i * 3);
        }
    }
}

@Component({
    selector: 'height-map-geometry[elementSize][heights]',
    standalone: true,
    template: `<ngt-buffer-geometry [ref]="ref" />`,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HeightMapGeometry extends NgtRxStore<{ heights: number[][]; elementSize: number }> implements OnInit {
    readonly ref = injectNgtRef<BufferGeometry>();

    @Input() set elementSize(elementSize: number) {
        this.set({ elementSize });
    }

    @Input() set heights(heights: number[][]) {
        this.set({ heights });
    }

    ngOnInit(): void {
        this.#configureHeights();
    }

    #configureHeights() {
        this.hold(combineLatest([this.select('heights'), this.ref.$]), ([heights, geometry]) => {
            const elementSize = this.get('elementSize');

            const dx = elementSize;
            const dy = elementSize;

            /* Create the vertex data from the heights. */
            const vertices = heights.flatMap((row, i) => row.flatMap((z, j) => [i * dx, j * dy, z]));

            /* Create the faces. */
            const indices = [];
            for (let i = 0; i < heights.length - 1; i++) {
                for (let j = 0; j < heights[i].length - 1; j++) {
                    const stride = heights[i].length;
                    const index = i * stride + j;
                    indices.push(index + 1, index + stride, index + stride + 1);
                    indices.push(index + stride, index + 1, index);
                }
            }

            geometry.setIndex(indices);
            geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
            geometry.computeVertexNormals();
            geometry.computeBoundingBox();
            geometry.computeBoundingSphere();
        });
    }
}

@Component({
    selector: 'height-field',
    standalone: true,
    template: `
        <ngt-mesh [ref]="heightFieldBody.ref" castShadow receiveShadow>
            <ngt-mesh-phong-material [color]="color" />
            <height-map-geometry [elementSize]="elementSize" [heights]="heights" />
        </ngt-mesh>
    `,
    imports: [HeightMapGeometry],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HeightField {
    @Input() elementSize = 0;
    @Input() heights: number[][] = [];
    @Input() position: Triplet = [0, 0, 0];
    @Input() rotation: Triplet = [0, 0, 0];

    readonly color = niceColors[17][4];

    readonly heightFieldBody = injectHeightfield<THREE.Mesh>(() => ({
        args: [this.heights, { elementSize: this.elementSize }],
        position: this.position,
        rotation: this.rotation,
    }));
}

@Component({
    selector: 'sandbox-height-field-scene',
    standalone: true,
    template: `
        <ngt-color *args="['#171720']" attach="background" />

        <ngts-orbit-controls [dampingFactor]="0.2" [minPolarAngle]="Math.PI / 3" [maxPolarAngle]="Math.PI / 3" />

        <ngtc-physics>
            <ngt-ambient-light intensity="0.5" />
            <ngt-directional-light [position]="[0, 3, 0]" castShadow />
            <height-field
                [elementSize]="scale / 128"
                [heights]="heights"
                [position]="[-scale / 2, 0, scale / 2]"
                [rotation]="[Math.PI / -2, 0, 0]"
            />
            <spheres [rows]="3" [columns]="3" [spread]="4" />
        </ngtc-physics>
    `,
    imports: [NgtsOrbitControls, NgtcPhysics, HeightField, Spheres, NgtArgs],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Scene {
    readonly Math = Math;
    readonly scale = 10;
    readonly heights = generateHeightmap({
        height: 128,
        number: 10,
        scale: 1,
        width: 128,
    });
}
