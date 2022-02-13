import {
    NgtCanvasStore,
    NgtMaterial,
    NgtStore,
    Tail,
    tapEffect,
} from '@angular-three/core';
import { DOCUMENT } from '@angular/common';
import {
    Directive,
    Host,
    Inject,
    Input,
    NgModule,
    NgZone,
    OnInit,
    Optional,
    Output,
} from '@angular/core';
import { map } from 'rxjs';
import * as THREE from 'three';

interface NgtSobaGradientTextureState {
    stops: Array<number>;
    colors: Array<string>;
    args: Tail<ConstructorParameters<typeof THREE.Texture>>;
    texture: THREE.Texture;
    size: number;
}

@Directive({
    selector: 'ngt-soba-gradient-texture[stops][colors]',
    exportAs: 'ngtSobaGradientTexture',
})
export class NgtSobaGradientTexture
    extends NgtStore<NgtSobaGradientTextureState>
    implements OnInit
{
    @Input() set stops(stops: Array<number>) {
        this.set({ stops });
    }

    @Input() set colors(colors: Array<string>) {
        this.set({ colors });
    }

    @Input() set size(size: number) {
        this.set({ size });
    }

    @Input() set args(args: Tail<ConstructorParameters<typeof THREE.Texture>>) {
        this.set({ args });
    }

    @Output() ready = this.select((s) => s.texture);

    get texture() {
        return this.get((s) => s.texture);
    }

    constructor(
        private zone: NgZone,
        private canvasStore: NgtCanvasStore,
        @Inject(DOCUMENT) private document: Document,
        @Optional() @Host() private ngtMaterial: NgtMaterial
    ) {
        super();

        this.set({ size: 2048, args: [] });
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.canvasStore.ready$, () => {
                this.set(
                    this.select(
                        this.select((s) => s.stops),
                        this.select((s) => s.args),
                        (stops, args) => ({ stops, args })
                    ).pipe(
                        map(({ stops, args }) => {
                            const { colors, size } = this.get();
                            const canvas = document.createElement('canvas');
                            const context = canvas.getContext('2d')!;
                            canvas.width = 16;
                            canvas.height = size;
                            const gradient = context.createLinearGradient(
                                0,
                                0,
                                0,
                                size
                            );
                            let i = stops.length;
                            while (i--) {
                                gradient.addColorStop(stops[i], colors[i]);
                            }
                            context.fillStyle = gradient;
                            context.fillRect(0, 0, 16, size);
                            const texture = new THREE.Texture(canvas, ...args);
                            texture.needsUpdate = true;
                            return { texture };
                        })
                    )
                );

                this.effect<THREE.Texture>(
                    tapEffect((texture) => {
                        if (this.ngtMaterial) {
                            Object.assign(this.ngtMaterial.material, {
                                map: texture,
                            });
                        }
                        return () => {
                            texture.dispose();
                        };
                    })
                )(this.select((s) => s.texture));
            });
        });
    }
}

@NgModule({
    declarations: [NgtSobaGradientTexture],
    exports: [NgtSobaGradientTexture],
})
export class NgtSobaGradientTextureModule {}
