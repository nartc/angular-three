import { tapEffect } from '@angular-three/core';
import { Directive, inject } from '@angular/core';
import { filter } from 'rxjs';
import * as THREE from 'three';
import { NgtSobaEnvironmentInputs, provideNgtSobaEnvironmentInputs } from './environment-inputs';
import { NgtSobaEnvironmentResolver } from './environment-resolver';
import { setEnvProps } from './utils';

@Directive({
  selector: 'ngt-soba-environment-cube',
  standalone: true,
  providers: [provideNgtSobaEnvironmentInputs(NgtSobaEnvironmentCube), NgtSobaEnvironmentResolver],
})
export class NgtSobaEnvironmentCube extends NgtSobaEnvironmentInputs {
  private readonly environmentResolver = inject(NgtSobaEnvironmentResolver);

  private readonly setEnvironment = this.effect<THREE.CubeTexture | THREE.Texture>(
    tapEffect((texture) => {
      const { background, scene, blur } = this.getState();
      const defaultScene = this.store.getState((s) => s.scene);
      return setEnvProps(background, scene, defaultScene, texture, blur);
    })
  );

  override postStoreReady() {
    super.postStoreReady();
    const texture$ = this.environmentResolver.use(this.getEnvironmentResolverParams$.bind(this));
    this.setEnvironment(
      this.select(
        texture$.pipe(filter((texture) => !!texture)),
        this.select((s) => s['background']),
        this.select((s) => s['blur']),
        this.select((s) => s['scene']),
        this.store.select((s) => s.scene),
        (texture) => texture
      )
    );
  }
}
