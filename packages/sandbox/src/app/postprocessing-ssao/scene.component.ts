import { extend, injectNgtDestroy, NgtArgs, NgtPush, prepare } from '@angular-three/core';
import { NgtpEffectComposer } from '@angular-three/postprocessing';
import { NgtpSSAO } from '@angular-three/postprocessing/effects';
import { NgtsOrbitControls } from '@angular-three/soba/controls';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { BoxGeometry, DirectionalLight, Mesh, MeshLambertMaterial, PlaneGeometry, SphereGeometry } from 'three';
import { BlendFunctionService } from './blend-function.service';

extend({ Mesh, BoxGeometry, MeshLambertMaterial, PlaneGeometry, SphereGeometry, DirectionalLight });

@Component({
    selector: 'sandbox-wall',
    standalone: true,
    template: `
        <ngt-mesh [position]="[0, 6, -3]" [geometry]="geometry" [material]="material" castShadow receiveShadow />
        <ngt-mesh
            [position]="[-8, 6, 5]"
            [rotation]="[0, -Math.PI / 2, 0]"
            [geometry]="geometry"
            [material]="material"
            castShadow
            receiveShadow
        />
    `,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Wall {
    readonly geometry = prepare(new BoxGeometry(16, 12, 1));
    readonly material = prepare(new MeshLambertMaterial({ color: 'pink' }));
    readonly Math = Math;
}

@Component({
    selector: 'sandbox-small-box',
    standalone: true,
    template: `
        <ngt-mesh [position]="[6, 1, -1.5]" castShadow receiveShadow>
            <ngt-box-geometry *args="[2, 2, 2]" />
            <ngt-mesh-lambert-material color="green" />
        </ngt-mesh>
    `,
    imports: [NgtArgs],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SmallBox {}

@Component({
    selector: 'sandbox-box',
    standalone: true,
    template: `
        <ngt-mesh [position]="[0, 2.5, 0]" castShadow receiveShadow>
            <ngt-box-geometry *args="[5, 5, 5]" />
            <ngt-mesh-lambert-material color="red" />
        </ngt-mesh>
    `,

    imports: [NgtArgs],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Box {}

@Component({
    selector: 'sandbox-ground',
    standalone: true,
    template: `
        <ngt-mesh [rotation]="[-Math.PI / 2, 0, 0]" receiveShadow>
            <ngt-plane-geometry *args="[1000, 1000]" />
            <ngt-mesh-lambert-material color="#ddddff" />
        </ngt-mesh>
    `,

    imports: [NgtArgs],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Ground {
    readonly Math = Math;
}

@Component({
    selector: 'sandbox-ball',
    standalone: true,
    template: `
        <ngt-mesh [position]="[1, 6, -1]" castShadow receiveShadow>
            <ngt-sphere-geometry *args="[1, 128, 128]" />
            <ngt-mesh-lambert-material color="yellow" />
        </ngt-mesh>
    `,

    imports: [NgtArgs],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Ball {}

@Component({
    selector: 'sandbox-postprocessing-ssao-scene',
    standalone: true,
    template: `
        <ngt-directional-light castShadow [position]="[2.5, 5, 5]" />

        <sandbox-small-box />
        <sandbox-box />
        <sandbox-ball />
        <sandbox-wall />
        <sandbox-ground />

        <ngtp-effect-composer>
            <ngtp-ssao [blendFunction]="blendFunction" [radius]="5" [intensity]="30" [samples]="31" />
        </ngtp-effect-composer>

        <ngts-orbit-controls />
    `,
    imports: [SmallBox, Box, Wall, Ground, Ball, NgtpEffectComposer, NgtpSSAO, NgtsOrbitControls, NgtPush],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Scene implements OnInit {
    readonly service = inject(BlendFunctionService);
    readonly ngtDestroy = injectNgtDestroy();

    get blendFunction() {
        return this.service.blendFunctionRef.nativeElement;
    }

    ngOnInit() {
        const [destroy$, cdr] = this.ngtDestroy;
        this.service.blendFunctionRef.$.pipe(takeUntil(destroy$)).subscribe(() => {
            cdr.detectChanges();
        });
    }
}
