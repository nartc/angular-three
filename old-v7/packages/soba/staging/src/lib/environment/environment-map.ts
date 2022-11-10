import { tapEffect } from '@angular-three/core';
import { Directive } from '@angular/core';
import { NgtSobaEnvironmentInputs, provideNgtSobaEnvironmentInputs } from './environment-inputs';
import { setEnvProps } from './utils';

@Directive({
  selector: 'ngt-soba-environment-map',
  standalone: true,
  providers: [provideNgtSobaEnvironmentInputs(NgtSobaEnvironmentMap)],
})
export class NgtSobaEnvironmentMap extends NgtSobaEnvironmentInputs {
  private readonly setEnvironment = this.effect(
    tapEffect(() => {
      const { map, background, scene, blur } = this.getState();
      const defaultScene = this.store.getState((s) => s.scene);
      if (map) {
        return setEnvProps(background, scene, defaultScene, map, blur);
      }
    })
  );

  override postStoreReady() {
    super.postStoreReady();
    this.setEnvironment(
      this.select(
        this.store.select((s) => s.scene),
        this.select((s) => s['background']),
        this.select((s) => s['map']),
        this.select((s) => s['blur']),
        this.select((s) => s['scene']),
        this.defaultProjector
      )
    );
  }
}
