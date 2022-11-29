import { checkNeedsUpdate, injectArgs, NgtInstance, NgtStore, provideInstanceRef, proxify } from '@angular-three/core';
import { Component, inject } from '@angular/core';
import { tap } from 'rxjs';
import * as THREE from 'three';
import { NGT_INSTANCE_INPUTS } from '../common';

@Component({
    selector: 'ngt-soba-gradient-texture',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS }],
    providers: [provideInstanceRef(SobaGradientTexture)],
})
export class SobaGradientTexture extends THREE.Texture {
    constructor() {
        const store = inject(NgtStore);
        const [stops, colors, size = 1024] = injectArgs()() as [stops: number[], colors: string[], size?: number];
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.width = 16;
        canvas.height = size;
        const gradient = context.createLinearGradient(0, 0, 0, size);
        let i = stops.length;
        while (i--) {
            gradient.addColorStop(stops[i], colors[i]);
        }
        context.fillStyle = gradient;
        context.fillRect(0, 0, 16, size);
        super(canvas);
        return proxify(this, {
            attach: 'map',
            created: (instance, _, ngtInstance) => {
                checkNeedsUpdate(instance);

                ngtInstance.effect(
                    tap(() => {
                        instance.encoding = store.read((s) => s.gl.outputEncoding);
                        checkNeedsUpdate(instance);
                    })
                )(store.select((s) => s.gl.outputEncoding, { debounce: true }));
            },
        });
    }
}
