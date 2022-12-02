import {
    createBeforeRenderCallback,
    defaultProjector,
    NgtArgs,
    NgtInstance,
    NgtPortal,
    NgtRef,
    prepare,
    provideInstanceRef,
    tapEffect,
} from '@angular-three/core';
import { NgtCubeCamera } from '@angular-three/core/cameras';
import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { filter, map } from 'rxjs';
import * as THREE from 'three';
import { SobaEnvironmentCube } from './environment-cube';
import { SobaEnvironmentInputs } from './environment-inputs';
import { SobaEnvironmentMap } from './environment-map';
import { setEnvProps } from './utils';

@Component({
    selector: 'ngt-soba-environment-portal',
    standalone: true,
    template: `
        <ngt-portal [container]="readKey('virtualScene')">
            <ng-content></ng-content>

            <ngt-cube-camera
                *args="cubeCameraArgs$"
                [ref]="readKey('cubeCamera')"
                [beforeRender]="onBeforeRender"
            ></ngt-cube-camera>

            <ngt-soba-environment-cube
                *ngIf="readKey('files') || readKey('preset'); else environmentMap"
                [background]="true"
                [files]="readKey('files')"
                [preset]="readKey('preset')"
                [path]="readKey('path')"
                [extensions]="readKey('extensions')"
            ></ngt-soba-environment-cube>

            <ng-template #environmentMap>
                <ngt-soba-environment-map
                    [background]="true"
                    [map]="readKey('map')"
                    [extensions]="readKey('extensions')"
                ></ngt-soba-environment-map>
            </ng-template>
        </ngt-portal>
    `,
    imports: [NgtPortal, NgtCubeCamera, NgIf, SobaEnvironmentCube, SobaEnvironmentMap, NgtArgs],
    hostDirectives: [{ directive: NgtInstance }],
    providers: [provideInstanceRef(SobaEnvironmentPortal, (portal) => portal.read((s) => s['virtualScene']))],
})
export class SobaEnvironmentPortal extends SobaEnvironmentInputs implements OnInit {
    private count = 1;

    readonly fbo$ = this.select((s) => s['fbo']);

    readonly cubeCameraArgs$ = this.select(
        this.select((s) => s['near']),
        this.select((s) => s['far']),
        this.fbo$,
        (near, far, fbo) => [near, far, fbo]
    );

    private readonly setEnvironment = this.effect(
        tapEffect(() => {
            const { gl, scene: defaultScene } = this.store.read();
            const { frames, cubeCamera, virtualScene, background, scene, fbo, blur } = this.read();
            if (frames === 1 && cubeCamera.value) cubeCamera.value.update(gl, virtualScene.value);

            return setEnvProps(background, scene, defaultScene, fbo.texture, blur);
        })
    );

    readonly onBeforeRender = createBeforeRenderCallback(() => {
        const { frames, cubeCamera, virtualScene } = this.read();
        const gl = this.store.read((s) => s.gl);
        if ((frames === Infinity || this.count < frames) && cubeCamera.value) {
            cubeCamera.value.update(gl, virtualScene.value);
            this.count++;
        }
    });

    override initialize() {
        super.initialize();
        this.write({
            virtualScene: new NgtRef(prepare(new THREE.Scene(), this.store.read)),
            cubeCamera: new NgtRef(),
            near: 1,
            far: 1000,
            resolution: 256,
            frames: 1,
            background: false,
        });
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.write(
                this.select(
                    this.select((s) => s['resolution']),
                    (resolution) => {
                        const fbo = new THREE.WebGLCubeRenderTarget(resolution!);
                        fbo.texture.type = THREE.HalfFloatType;
                        return { fbo };
                    }
                )
            );

            this.setEnvironment(
                this.select(
                    this.store.select((s) => s.gl),
                    this.store.select((s) => s.scene),
                    this.select((s) => s['scene']),
                    this.select((s) => s['virtualScene']),
                    this.fbo$.pipe(
                        filter((fbo) => !!fbo),
                        map((fbo) => fbo.texture)
                    ),
                    this.select((s) => s['background']),
                    this.select((s) => s['frames']),
                    defaultProjector
                )
            );
        });
    }
}
