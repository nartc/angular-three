import {
  calculateDpr,
  coerceBoolean,
  NgtBooleanInput,
  NgtComponentStore,
  NgtObservableInput,
  NgtStore,
  tapEffect,
} from '@angular-three/core';
import { Directive, inject, Input, NgZone, OnInit } from '@angular/core';
import { isObservable, map, tap } from 'rxjs';

@Directive({
  selector: 'ngt-soba-adaptive-dpr',
  standalone: true,
})
export class NgtSobaAdaptiveDpr extends NgtComponentStore implements OnInit {
  private readonly zone = inject(NgZone);
  private readonly store = inject(NgtStore);

  @Input() set pixelated(pixelated: NgtObservableInput<NgtBooleanInput>) {
    this.set({ pixelated: isObservable(pixelated) ? pixelated.pipe(map(coerceBoolean)) : coerceBoolean(pixelated) });
  }

  private readonly updateDpr = this.effect(
    tap(() => {
      const current = this.store.getState((s) => s.performance.current);
      const initialDpr = this.store.getState((s) => s.viewport.initialDpr);
      this.store.set((state) => ({
        viewport: { ...state.viewport, dpr: calculateDpr(current! * initialDpr) },
      }));

      const gl = this.store.getState((s) => s.gl);
      const pixelated = this.getState((s) => s['pixelated']);

      if (pixelated && gl.domElement) {
        gl.domElement.style.imageRendering = current === 1 ? 'auto' : 'pixelated';
      }
    })
  );

  private readonly reset = this.effect<void>(
    tapEffect(() => {
      const gl = this.store.getState((s) => s.gl);
      const active = this.store.getState((s) => s.internal.active);
      const pixelated = this.getState((s) => s['pixelated']);

      return () => {
        if (active) {
          this.store.set((state) => ({
            viewport: { ...state.viewport, dpr: calculateDpr(state.viewport.initialDpr) },
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
      this.store.onReady(() => {
        this.reset();
        this.updateDpr(this.store.select((s) => s.performance, { debounce: true }));
      });
    });
  }
}
