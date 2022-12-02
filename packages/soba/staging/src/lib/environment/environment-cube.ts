import { tapEffect } from '@angular-three/core';
import { Directive, inject, OnInit } from '@angular/core';
import { filter } from 'rxjs';
import * as THREE from 'three';
import { SobaEnvironmentInputs } from './environment-inputs';
import { SobaEnvironmentResolver } from './environment-resolver';
import { setEnvProps } from './utils';

@Directive({
    selector: 'ngt-soba-environment-cube',
    standalone: true,
    providers: [SobaEnvironmentResolver],
})
export class SobaEnvironmentCube extends SobaEnvironmentInputs implements OnInit {
    private readonly environmentResolver = inject(SobaEnvironmentResolver);

    private readonly setEnvironment = this.effect<THREE.CubeTexture | THREE.Texture>(
        tapEffect((texture) => {
            const { background, scene, blur } = this.read();
            const defaultScene = this.store.read((s) => s.scene);
            return setEnvProps(background, scene, defaultScene, texture, blur);
        })
    );

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            const texture$ = this.environmentResolver.use(this.getEnvironmentResolverParams$.bind(this));
            this.setEnvironment(
                this.select(
                    texture$.pipe(filter((texture) => !!texture)),
                    this.select((s) => s['background']),
                    this.select((s) => s['blur']),
                    this.select((s) => s['scene']),
                    this.store.select((s) => s.scene),
                    (texture) => texture
                )
            );
        });
    }
}
