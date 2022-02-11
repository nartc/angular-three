import {
    createExtenderProvider,
    NgtCanvasStore,
    NgtExtender,
    NgtRender,
    NgtStore,
} from '@angular-three/core';
import { NgtBufferAttributeModule } from '@angular-three/core/attributes';
import { NgtBufferGeometryModule } from '@angular-three/core/geometries';
import { NgtPointsModule } from '@angular-three/core/points';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule,
    NgZone,
} from '@angular/core';
import { tap } from 'rxjs';
import * as THREE from 'three';
import {
    NgtSobaStarFieldMaterialModule,
    StarFieldMaterial,
} from './star-material';

const genStar = (r: number) => {
    return new THREE.Vector3().setFromSpherical(
        new THREE.Spherical(
            r,
            Math.acos(1 - Math.random() * 2),
            Math.random() * 2 * Math.PI
        )
    );
};

export interface NgtSobaStarsState {
    radius: number;
    depth: number;
    count: number;
    factor: number;
    saturation: number;
    fade: boolean;
    positions: Float32Array;
    colors: Float32Array;
    sizes: Float32Array;
    material: StarFieldMaterial;
}

@Component({
    selector: 'ngt-soba-stars',
    template: `
        <ngt-points
            (ready)="object = $event"
            (animateReady)="onAnimate($event.state)"
        >
            <ngt-buffer-geometry>
                <ngt-buffer-attribute
                    attach="position"
                    [args]="[positions, 3]"
                ></ngt-buffer-attribute>
                <ngt-buffer-attribute
                    attach="color"
                    [args]="[colors, 3]"
                ></ngt-buffer-attribute>
                <ngt-buffer-attribute
                    attach="size"
                    [args]="[sizes, 1]"
                ></ngt-buffer-attribute>
            </ngt-buffer-geometry>
            <ngt-soba-star-field-material
                (ready)="store.set({ material: $event })"
                [parameters]="{
                    vertexColors: true,
                    transparent: true,
                    blending: blending,
                    uniforms: { fade: { value: fade } }
                }"
            ></ngt-soba-star-field-material>
        </ngt-points>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [createExtenderProvider(NgtSobaStars), NgtStore],
})
export class NgtSobaStars extends NgtExtender<THREE.Points> {
    readonly blending = THREE.AdditiveBlending;

    @Input() set radius(radius: number) {
        this.store.set({ radius });
    }

    @Input() set depth(depth: number) {
        this.store.set({ depth });
    }

    @Input() set count(count: number) {
        this.store.set({ count });
    }

    @Input() set factor(factor: number) {
        this.store.set({ factor });
    }

    @Input() set saturation(saturation: number) {
        this.store.set({ saturation });
    }

    @Input() set fade(fade: boolean) {
        this.store.set({ fade });
    }

    get fade() {
        return this.store.get((s) => s.fade);
    }

    constructor(
        public store: NgtStore<NgtSobaStarsState>,
        private canvasStore: NgtCanvasStore,
        private zone: NgZone
    ) {
        super();
        this.store.set({
            radius: 100,
            depth: 50,
            count: 5000,
            saturation: 0,
            factor: 4,
            fade: false,
        });
    }

    get positions() {
        return this.store.get((s) => s.positions);
    }

    get colors() {
        return this.store.get((s) => s.colors);
    }

    get sizes() {
        return this.store.get((s) => s.sizes);
    }

    private starsParams$ = this.store.select(
        this.store.select((s) => s.radius),
        this.store.select((s) => s.depth),
        this.store.select((s) => s.count),
        this.store.select((s) => s.factor),
        this.store.select((s) => s.saturation),
        (radius, depth, count, factor, saturation) => ({
            radius,
            depth,
            count,
            factor,
            saturation,
        })
    );

    private readonly setStars = this.store.effect<
        Pick<
            NgtSobaStarsState,
            'radius' | 'depth' | 'count' | 'factor' | 'saturation'
        >
    >(
        tap(({ factor, radius, saturation, count, depth }) => {
            const positions: number[] = [];
            const colors: number[] = [];
            const sizes = Array.from(
                { length: count },
                () => (0.5 + 0.5 * Math.random()) * factor
            );
            const color = new THREE.Color();
            let r = radius + depth;
            const increment = depth / count;
            for (let i = 0; i < count; i++) {
                r -= increment * Math.random();
                positions.push(...genStar(r).toArray());
                color.setHSL(i / count, saturation, 0.9);
                colors.push(color.r, color.g, color.b);
            }

            this.store.set({
                positions: new Float32Array(positions),
                colors: new Float32Array(colors),
                sizes: new Float32Array(sizes),
            });
        })
    );

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.store.onCanvasReady(this.canvasStore.ready$, () => {
                this.setStars(this.starsParams$);
            });
        });
    }

    onAnimate(state: NgtRender) {
        const material = this.store.get((s) => s.material);
        if (material) {
            material.uniforms['time'].value = state.clock.getElapsedTime();
            this.animateReady.emit({ entity: this.object, state });
        }
    }
}

@NgModule({
    declarations: [NgtSobaStars],
    exports: [NgtSobaStars],
    imports: [
        NgtPointsModule,
        NgtBufferGeometryModule,
        NgtBufferAttributeModule,
        NgtSobaStarFieldMaterialModule,
        CommonModule,
    ],
})
export class NgtSobaStarsModule {}
