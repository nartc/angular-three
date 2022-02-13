import { Injectable, NgZone } from '@angular/core';
import { NgtAnimationFrameStore } from '../stores/animation-frame';
import { NgtCanvasStore } from '../stores/canvas';
import type {
    NgtAnimationFrameState,
    NgtCanvasState,
    NgtRender,
} from '../types';

@Injectable()
export class NgtLoop {
    private running = false;
    private repeat?: number;
    private frames = 0;

    constructor(
        private canvasStore: NgtCanvasStore,
        private animationFrameStore: NgtAnimationFrameStore,
        private zone: NgZone
    ) {}

    render(
        timestamp: number,
        canvasState: NgtCanvasState,
        animationFrameState: NgtAnimationFrameState
    ): number {
        return this.zone.runOutsideAngular(() => {
            const {
                clock,
                frameloop,
                camera,
                scene,
                renderer,
                mouse,
                size,
                viewport,
            } = canvasState;
            const { subscribers, hasPriority } = animationFrameState;

            if (renderer) {
                let delta = clock.getDelta();
                // In frameloop='never' mode, clock times are updated using the provided timestamp
                if (frameloop === 'never' && typeof timestamp === 'number') {
                    delta = timestamp - clock.elapsedTime;
                    clock.oldTime = clock.elapsedTime;
                    clock.elapsedTime = timestamp;
                }

                const renderState = {
                    clock,
                    camera,
                    scene,
                    renderer,
                    mouse,
                    size,
                    viewport,
                    delta,
                };

                for (const subscriber of subscribers) {
                    const object =
                        typeof subscriber.obj === 'function'
                            ? subscriber.obj()
                            : subscriber.obj;
                    subscriber.callback(renderState as NgtRender, object);
                }

                if (!hasPriority) {
                    renderer.render(scene!, camera!);
                }
            }

            this.frames = Math.max(0, this.frames - 1);
            return canvasState.frameloop === 'always' ? 1 : this.frames;
        });
    }

    loop = (timestamp: number): number | undefined =>
        this.zone.runOutsideAngular(() => {
            this.running = true;
            this.repeat = 0;

            const canvasState = this.canvasStore.get();
            if (
                canvasState.ready &&
                (canvasState.frameloop === 'always' || this.frames > 0)
            ) {
                this.repeat += this.render(
                    timestamp,
                    canvasState,
                    this.animationFrameStore.get()
                );
            }

            if (this.repeat > 0) return requestAnimationFrame(this.loop);

            this.running = false;
            return;
        });

    invalidate(canvasState: NgtCanvasState = this.canvasStore.get()) {
        if (canvasState.vr) {
            canvasState.renderer?.setAnimationLoop((timestamp: number) => {
                this.render(
                    timestamp,
                    this.canvasStore.get(),
                    this.animationFrameStore.get()
                );
            });
            return;
        }

        if (!canvasState.ready || canvasState.frameloop === 'never') return;

        // Increase frames, do not go higher than 60
        this.frames = Math.min(60, this.frames + 1);
        // If the render-loop isn't active, start it
        if (!this.running) {
            this.running = true;
            requestAnimationFrame(this.loop);
        }
    }
}
