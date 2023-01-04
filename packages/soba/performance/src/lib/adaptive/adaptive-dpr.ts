import { injectNgtStore, NgtRxStore } from '@angular-three/core';
import { Directive, inject, Input, OnInit } from '@angular/core';
import { RxActionFactory } from '@rx-angular/state/actions';

@Directive({
  selector: 'ngts-adaptive-dpr',
  standalone: true,
  providers: [RxActionFactory],
})
export class NgtsAdaptiveDpr extends NgtRxStore implements OnInit {
  readonly #store = injectNgtStore();
  readonly #actions = inject(RxActionFactory<{ restorePixel: void }>).create();

  @Input() pixelated = false;

  ngOnInit(): void {
    this.effect(this.#actions.restorePixel$, () => {
      const domElement = this.#store.get('gl', 'domElement');
      return () => {
        const active = this.#store.get('internal', 'active');
        const setDpr = this.#store.get('setDpr');
        const initialDpr = this.#store.get('viewport', 'initialDpr');
        if (active) setDpr(initialDpr);
        if (this.pixelated && domElement) domElement.style.imageRendering = 'auto';
      };
    });

    this.#actions.restorePixel();

    this.hold(this.#store.select('performance', 'current'), (performanceCurrent) => {
      const { gl, viewport, setDpr } = this.#store.get();
      setDpr(performanceCurrent * viewport.initialDpr);
      if (this.pixelated && gl.domElement)
        gl.domElement.style.imageRendering = performanceCurrent === 1 ? 'auto' : 'pixelated';
    });
  }
}
