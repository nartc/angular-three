import {
  BooleanInput,
  coerceBooleanProperty,
  makeDpr,
  NgtComponentStore,
  NgtStore,
  tapEffect,
} from '@angular-three/core';
import { Directive, Input, NgModule, NgZone, OnInit } from '@angular/core';
import { tap } from 'rxjs';

@Directive({
  selector: 'ngt-soba-adaptive-dpr',
  standalone: true,
})
export class NgtSobaAdaptiveDpr extends NgtComponentStore<{ pixelated: boolean }> implements OnInit {
  @Input() set pixelated(pixelated: BooleanInput) {
    this.set({ pixelated: coerceBooleanProperty(pixelated) });
  }

  constructor(private zone: NgZone, private store: NgtStore) {
    super();
  }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.store.onReady(() => {
        this.reset();
        this.updateDpr(this.store.select((s) => s.performance.current));
      });
    });
  }

  private readonly updateDpr = this.effect(
    tap(() => {
      const current = this.store.get((s) => s.performance.current);
      const initialDpr = this.store.get((s) => s.viewport.initialDpr);
      this.store.set((state) => ({
        viewport: { ...state.viewport, dpr: makeDpr(current! * initialDpr) },
      }));

      const gl = this.store.get((s) => s.gl);
      const pixelated = this.get((s) => s.pixelated);

      if (pixelated && gl.domElement) {
        gl.domElement.style.imageRendering = current === 1 ? 'auto' : 'pixelated';
      }
    })
  );

  private readonly reset = this.effect<void>(
    tapEffect(() => {
      const gl = this.store.get((s) => s.gl);
      const active = this.store.get((s) => s.internal.active);
      const pixelated = this.get((s) => s.pixelated);

      return () => {
        if (active) {
          this.store.set((state) => ({
            viewport: { ...state.viewport, dpr: makeDpr(state.viewport.initialDpr) },
          }));
        }
        if (pixelated && gl.domElement) {
          gl.domElement.style.imageRendering = 'auto';
        }
      };
    })
  );
}

@NgModule({
  imports: [NgtSobaAdaptiveDpr],
  exports: [NgtSobaAdaptiveDpr],
})
export class NgtSobaAdapativeDprModule {}
