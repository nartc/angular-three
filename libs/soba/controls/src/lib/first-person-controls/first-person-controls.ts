import {
    NgtAnimationFrameStore,
    NgtCanvasState,
    NgtCanvasStore,
    NgtStore,
    tapEffect,
} from '@angular-three/core';
import { Directive, NgModule, NgZone, OnInit, Output } from '@angular/core';
import { tap } from 'rxjs';
import { FirstPersonControls } from 'three-stdlib';

interface NgtSobaFirstPersonControlsState {
    controls: FirstPersonControls;
}

@Directive({
    selector: 'ngt-soba-first-person-controls',
    exportAs: 'ngtSobaFirstPersonControls',
})
export class NgtSobaFirstPersonControls
    extends NgtStore<NgtSobaFirstPersonControlsState>
    implements OnInit
{
    @Output() ready = this.select((s) => s.controls);

    constructor(
        private zone: NgZone,
        private canvasStore: NgtCanvasStore,
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
        tap(({ camera, renderer }) => {
            if (camera && renderer) {
                this.set({
                    controls: new FirstPersonControls(
                        camera,
                        renderer.domElement
                    ),
                });
            }
        })
    );

    private readonly registerAnimation = this.effect<FirstPersonControls>(
        tapEffect((controls) => {
            const animationUuid = this.animationFrameStore.register({
                callback: ({ delta }) => {
                    controls.update(delta);
                },
            });

            return () => {
                this.animationFrameStore.unregister(animationUuid);
            };
        })
    );

    get controls() {
        return this.get((s) => s.controls) as FirstPersonControls;
    }
}

@NgModule({
    declarations: [NgtSobaFirstPersonControls],
    exports: [NgtSobaFirstPersonControls],
})
export class NgtSobaFirstPersonControlsModule {}
