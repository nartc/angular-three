import { injectNgtStore, NgtRxStore } from '@angular-three/core';
import { Directive, OnInit } from '@angular/core';

@Directive({
  selector: 'ngts-bake-shadows',
  standalone: true,
})
export class NgtsBakeShadows extends NgtRxStore implements OnInit {
  readonly #store = injectNgtStore();

  ngOnInit() {
    this.effect(this.#store.select('gl', 'shadowMap'), () => {
      this.#store.get('gl').shadowMap.autoUpdate = false;
      this.#store.get('gl').shadowMap.needsUpdate = true;

      return () => {
        this.#store.get('gl').shadowMap.autoUpdate = false;
        this.#store.get('gl').shadowMap.needsUpdate = true;
      };
    });
  }
}
