import { makeDpr, NgtComponentStore, NgtObservableInput, NgtStore, tapEffect } from '@angular-three/core';
import { Directive, inject, Input, NgZone, OnInit } from '@angular/core';
import { tap } from 'rxjs';

@Directive({
    selector: 'ngt-soba-adaptive-dpr',
    standalone: true,
})
export class SobaAdaptiveDpr extends NgtComponentStore implements OnInit {
    private readonly zone = inject(NgZone);
    private readonly store = inject(NgtStore);

    @Input() set pixelated(pixelated: NgtObservableInput<boolean>) {
        this.write({ pixelated });
    }

    private readonly updateDpr = this.effect(
        tap(() => {
            const current = this.store.read((s) => s.performance.current);
            const initialDpr = this.store.read((s) => s.viewport.initialDpr);
            this.store.write((state) => ({
                viewport: { ...state.viewport, dpr: makeDpr(current! * initialDpr) },
            }));

            const gl = this.store.read((s) => s.gl);
            const pixelated = this.read((s) => s['pixelated']);

            if (pixelated && gl.domElement) {
                gl.domElement.style.imageRendering = current === 1 ? 'auto' : 'pixelated';
            }
        })
    );

    private readonly reset = this.effect<void>(
        tapEffect(() => {
            const gl = this.store.read((s) => s.gl);
            const active = this.store.read((s) => s.internal.active);
            const pixelated = this.read((s) => s['pixelated']);

            return () => {
                if (active) {
                    this.store.write((state) => ({
                        viewport: { ...state.viewport, dpr: makeDpr(state.viewport.initialDpr) },
                    }));
                }
                if (pixelated && gl.domElement) {
                    gl.domElement.style.imageRendering = 'auto';
                }
            };
        })
    );

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.reset();
            this.updateDpr(this.store.select((s) => s.performance, { debounce: true }));
        });
    }
}
