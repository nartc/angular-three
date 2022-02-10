import {
    NgtAnimationFrameStore,
    NgtCanvasState,
    NgtCanvasStore,
    NgtLoop,
    NgtStore,
    tapEffect,
} from '@angular-three/core';
import {
    Directive,
    EventEmitter,
    NgModule,
    NgZone,
    OnInit,
    Output,
} from '@angular/core';
import { tap } from 'rxjs';
import * as THREE from 'three';
import { FlyControls } from 'three-stdlib';

interface NgtSobaFlyControlsState {
    controls: FlyControls;
}

@Directive({
    selector: 'ngt-soba-fly-controls',
    exportAs: 'ngtSobaFlyControls',
})
export class NgtSobaFlyControls
    extends NgtStore<NgtSobaFlyControlsState>
    implements OnInit
{
    @Output() ready = this.select((s) => s.controls);
    @Output() change = new EventEmitter<THREE.Event>();

    constructor(
        private zone: NgZone,
        private canvasStore: NgtCanvasStore,
        private loop: NgtLoop,
        private animationFrameStore: NgtAnimationFrameStore
    ) {
        super();
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.canvasStore.ready$, () => {
                this.init(
                    this.select(
                        this.canvasStore.camera$,
                        this.canvasStore.renderer$,
                        (camera, renderer) => ({ camera, renderer })
                    )
                );
                this.registerAnimation(this.select((s) => s.controls));
            });
        });
    }

    private readonly init = this.effect<
        Pick<NgtCanvasState, 'camera' | 'renderer'>
    >(
        tap(({ renderer, camera }) => {
            if (camera && renderer) {
                this.set({
                    controls: new FlyControls(camera, renderer.domElement),
                });
            }
        })
    );

    private readonly registerAnimation = this.effect<FlyControls>(
        tapEffect((controls) => {
            const animationUuid = this.animationFrameStore.register({
                callback: ({ delta }) => {
                    controls.update(delta);
                },
            });

            const callback = (e: THREE.Event) => {
                this.loop.invalidate();
                if (this.change.observed) {
                    this.change.emit(e);
                }
            };

            controls.addEventListener('change', callback);

            return () => {
                controls.removeEventListener('change', callback);
                this.animationFrameStore.unregister(animationUuid);
            };
        })
    );

    get controls() {
        return this.get((s) => s.controls) as FlyControls;
    }
}

@NgModule({
    declarations: [NgtSobaFlyControls],
    exports: [NgtSobaFlyControls],
})
export class NgtSobaFlyControlsModule {}
