import { extend, injectNgtRef, injectNgtStore, NgtBeforeRender, NgtPush, NgtRxStore } from '@angular-three/core';
import { NgtsBillboard } from '@angular-three/soba/abstractions';
import { injectNgtsTextureLoader } from '@angular-three/soba/loaders';
import { NgFor, NgIf } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ColorRepresentation, Group, Mesh, MeshStandardMaterial, PlaneGeometry, Texture } from 'three';

const CLOUD_URL = 'https://rawcdn.githack.com/pmndrs/drei-assets/9225a9f1fbd449d9411125c2f419b843d0308c9f/cloud.png';

extend({
    Group,
    Mesh,
    PlaneGeometry,
    MeshStandardMaterial,
});

@Component({
    selector: 'ngts-cloud',
    standalone: true,
    template: `
        <ngt-group ngtCompound [ref]="groupRef">
            <ngt-group
                [position]="[0, 0, (get('segments') / 2) * get('depth')]"
                (beforeRender)="onBeforeRender($any($event))"
            >
                <ngts-billboard
                    *ngFor="let cloud of clouds$ | ngtPush : []; let i = index"
                    [position]="[cloud.x, cloud.y, -i * get('depth')]"
                >
                    <ngt-mesh [scale]="cloud.scale" [rotation]="[0, 0, 0]">
                        <ngt-plane-geometry />
                        <!-- we use ngIf here for texture because by the time ngt-value is initialized -->
                        <!-- [map] has not been resolved yet. we ngIf it so that texture is available before -->
                        <ngt-mesh-standard-material
                            *ngIf="cloudTexture$ | ngtPush : null as cloudTexture"
                            transparent
                            [map]="cloudTexture"
                            [depthTest]="get('depthTest')"
                            [opacity]="(cloud.scale / 6) * cloud.density * get('opacity')"
                            [color]="get('color')"
                        >
                            <ngt-value [rawValue]="encoding" attach="map.encoding" />
                        </ngt-mesh-standard-material>
                    </ngt-mesh>
                </ngts-billboard>
            </ngt-group>
        </ngt-group>
    `,
    imports: [NgFor, NgtPush, NgtsBillboard, NgIf],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsCloud extends NgtRxStore {
    readonly #store = injectNgtStore();
    readonly encoding = this.#store.get('gl', 'outputEncoding');

    @Input() groupRef = injectNgtRef<Group>();

    @Input() set opacity(opacity: number) {
        this.set({ opacity });
    }

    @Input() set speed(speed: number) {
        this.set({ speed });
    }

    @Input() set width(width: number) {
        this.set({ width });
    }

    @Input() set depth(depth: number) {
        this.set({ depth });
    }

    @Input() set segments(segments: number) {
        this.set({ segments });
    }

    @Input() set texture(texture: string) {
        this.set({ texture });
    }

    @Input() set color(color: ColorRepresentation) {
        this.set({ color });
    }

    @Input() set depthTest(depthTest: boolean) {
        this.set({ depthTest });
    }

    readonly clouds$ = this.select('clouds');
    readonly cloudTexture$ = injectNgtsTextureLoader(this.select('texture')) as Observable<Texture>;

    override initialize() {
        super.initialize();
        this.set({
            opacity: 0.5,
            speed: 0.4,
            width: 10,
            depth: 1.5,
            segments: 20,
            texture: CLOUD_URL,
            color: '#ffffff',
            depthTest: true,
        });
        this.connect(
            'clouds',
            this.select(['width', 'segments', 'speed'], ({ width, segments, speed }) => {
                return [...new Array(segments)].map((_, index) => ({
                    x: width / 2 - Math.random() * width,
                    y: width / 2 - Math.random() * width,
                    scale: 0.4 + Math.sin(((index + 1) / segments) * Math.PI) * ((0.2 + Math.random()) * 10),
                    density: Math.max(0.2, Math.random()),
                    rotation: Math.max(0.002, 0.005 * Math.random()) * speed,
                }));
            })
        );
    }

    onBeforeRender({ state, object }: NgtBeforeRender<Group>) {
        const clouds = this.get('clouds');
        object.children.forEach((cloud, index) => {
            cloud.children[0].rotation.z += clouds[index].rotation;
            cloud.children[0].scale.setScalar(
                clouds[index].scale + (((1 + Math.sin(state.clock.getElapsedTime() / 10)) / 2) * index) / 10
            );
        });
    }
}
