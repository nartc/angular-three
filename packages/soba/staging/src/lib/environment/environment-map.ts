import { defaultProjector, tapEffect } from '@angular-three/core';
import { Directive, OnInit } from '@angular/core';
import { SobaEnvironmentInputs } from './environment-inputs';
import { setEnvProps } from './utils';

@Directive({
    selector: 'ngt-soba-environment-map',
    standalone: true,
})
export class SobaEnvironmentMap extends SobaEnvironmentInputs implements OnInit {
    private readonly setEnvironment = this.effect(
        tapEffect(() => {
            const { map, background, scene, blur } = this.read();
            const defaultScene = this.store.read((s) => s.scene);
            if (map) {
                return setEnvProps(background, scene, defaultScene, map, blur);
            }
        })
    );

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.setEnvironment(
                this.select(
                    this.store.select((s) => s.scene),
                    this.select((s) => s['background']),
                    this.select((s) => s['map']),
                    this.select((s) => s['blur']),
                    this.select((s) => s['scene']),
                    defaultProjector
                )
            );
        });
    }
}
