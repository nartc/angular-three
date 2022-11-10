import { startWithUndefined, tapEffect } from '@angular-three/core';
import { Directive } from '@angular/core';
import { tap } from 'rxjs';
import {
  NgtSobaEnvironmentInputs,
  provideNgtSobaEnvironmentInputs,
} from './environment-inputs';
import { setEnvProps } from './utils';

@Directive({
  selector: 'ngt-soba-environment-map',
  standalone: true,
  providers: [provideNgtSobaEnvironmentInputs(NgtSobaEnvironmentMap)],
})
export class NgtSobaEnvironmentMap extends NgtSobaEnvironmentInputs {
  readonly #setEnvironment = this.effect(
    tapEffect(() => {
      const { map, background, scene, blur } = this.get();
      const defaultScene = this.store.get((s) => s.scene);
      if (map) {
        return setEnvProps(background, scene, defaultScene, map, blur);
      }
    })
  );

  override preInit() {
    super.preInit();
    this.#setEnvironment(
      this.select(
        this.store
          .select((s) => s.scene)
          .pipe(tap(console.log.bind(console, 'environment map set scene'))),
        this.select((s) => s['background']).pipe(
          tap(console.log.bind(console, 'environment map set background'))
        ),
        this.select((s) => s['map']).pipe(startWithUndefined()),
        this.select((s) => s['blur']).pipe(
          tap(console.log.bind(console, 'environment map set blur'))
        ),
        this.select((s) => s['scene'])
          .pipe(startWithUndefined())
          .pipe(
            tap(console.log.bind(console, 'environment map environment scene'))
          )
      )
    );
  }
}
