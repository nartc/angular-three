import { Injectable, NgZone } from '@angular/core';
import { NgtCanvasStore } from '../stores/canvas';

@Injectable()
export class NgtPerformance {
    private timeoutId: ReturnType<typeof setTimeout> | undefined = undefined;

    constructor(private canvasStore: NgtCanvasStore, private zone: NgZone) {}

    regress() {
        this.zone.runOutsideAngular(() => {
            const { current, min, debounce } = this.canvasStore.get(
                (s) => s.performance
            );

            // clear timeout
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
                this.timeoutId = undefined;
            }

            // set lower bound
            if (current !== min)
                this.canvasStore.set((state) => ({
                    ...state,
                    performance: { ...state.performance, current: min },
                }));

            // go back to upper bound
            this.timeoutId = setTimeout(() => {
                // performanceState.current = performanceSnapshot.max;
                this.canvasStore.set((state) => ({
                    ...state,
                    performance: {
                        ...state.performance,
                        current: state.performance.max,
                    },
                }));
            }, debounce);
        });
    }
}
