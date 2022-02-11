import { NgtCanvasStore, NgtStore } from '@angular-three/core';
import { Directive, Input, NgModule, NgZone, OnInit } from '@angular/core';
import * as THREE from 'three';

interface NgtSobaPreloadState {
    all: boolean;
    scene?: THREE.Object3D;
    camera?: THREE.Camera;
}

@Directive({
    selector: 'ngt-soba-preload',
    exportAs: 'ngtSobaPreload',
})
export class NgtSobaPreload
    extends NgtStore<NgtSobaPreloadState>
    implements OnInit
{
    @Input() set all(v: boolean) {
        this.set({ all: v });
    }

    @Input() set scene(v: THREE.Object3D) {
        this.set({ scene: v });
    }

    @Input() set camera(v: THREE.Camera) {
        this.set({ camera: v });
    }

    private get precompileParams() {
        const { all, scene, camera } = this.get();
        const {
            camera: canvasCamera,
            scene: canvasScene,
            renderer,
        } = this.canvasStore.get();
        return {
            all,
            scene: scene || canvasScene,
            camera: camera || canvasCamera,
            renderer,
        };
    }

    constructor(private zone: NgZone, private canvasStore: NgtCanvasStore) {
        super();
        this.set({
            all: false,
            scene: undefined,
            camera: undefined,
        });
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.canvasStore.ready$, () => {
                const { all, scene, camera, renderer } = this.precompileParams;
                const invisible: THREE.Object3D[] = [];

                if (all) {
                    scene!.traverse((object) => {
                        if (!object.visible) {
                            invisible.push(object);
                            object.visible = true;
                        }
                    });
                }

                // Now compile
                renderer!.compile(scene!, camera!);
                // And for good measure, hit it with a cube camera
                const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128);
                const cubeCamera = new THREE.CubeCamera(
                    0.01,
                    100000,
                    cubeRenderTarget
                );
                cubeCamera.update(renderer!, scene as THREE.Scene);
                cubeRenderTarget.dispose();
                // Flips these objects back
                invisible.forEach((object) => (object.visible = false));
            });
        });
    }
}

@NgModule({
    declarations: [NgtSobaPreload],
    exports: [NgtSobaPreload],
})
export class NgtSobaPreloadModule {}
