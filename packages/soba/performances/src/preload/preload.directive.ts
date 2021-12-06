import {
  EnhancedComponentStore,
  NgtStore,
  tapEffect,
} from '@angular-three/core';
import {
  AfterContentInit,
  Directive,
  Input,
  NgModule,
  NgZone,
} from '@angular/core';
import { tap, withLatestFrom } from 'rxjs';
import * as THREE from 'three';

interface NgtSobaPreloadState {
  all: boolean;
  scene?: THREE.Object3D;
  camera?: THREE.Camera;
}

@Directive({
  selector: 'ngt-soba-preload',
  exportAs: 'ngtSobaPreload',
})
export class NgtSobaPreload
  extends EnhancedComponentStore<NgtSobaPreloadState>
  implements AfterContentInit
{
  @Input() set all(v: boolean) {
    this.updaters.setAll(v);
  }

  @Input() set scene(v: THREE.Object3D) {
    this.updaters.setScene(v);
  }

  @Input() set camera(v: THREE.Camera) {
    this.updaters.setCamera(v);
  }

  #precompileParameters$ = this.select(
    this.selectors.all$,
    this.selectors.scene$,
    this.selectors.camera$,
    this.store.selectors.camera$,
    this.store.selectors.scene$,
    this.store.selectors.renderer$,
    (all, scene, camera, canvasCamera, canvasScene, renderer) => ({
      all,
      scene: scene || canvasScene,
      camera: camera || canvasCamera,
      renderer,
    }),
    { debounce: true }
  );

  constructor(private store: NgtStore, private ngZone: NgZone) {
    super({
      all: false,
      scene: undefined,
      camera: undefined,
    });
  }

  ngAfterContentInit() {
    this.init();
  }

  readonly init = this.effect(($) =>
    $.pipe(
      tap(() => {
        this.#precompile(this.store.selectors.ready$);
      })
    )
  );

  #precompile = this.effect<boolean>((ready$) =>
    ready$.pipe(
      withLatestFrom(this.#precompileParameters$),
      tapEffect(([ready, { camera, scene, renderer, all }]) => {
        this.ngZone.runOutsideAngular(() => {
          if (ready) {
            const invisible: THREE.Object3D[] = [];

            if (all) {
              scene!.traverse((object) => {
                if (!object.visible) {
                  invisible.push(object);
                  object.visible = true;
                }
              });
            }

            // Now compile
            renderer!.compile(scene!, camera!);
            // And for good measure, hit it with a cube camera
            const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128);
            const cubeCamera = new THREE.CubeCamera(
              0.01,
              100000,
              cubeRenderTarget
            );
            cubeCamera.update(renderer!, scene as THREE.Scene);
            cubeRenderTarget.dispose();
            // Flips these objects back
            invisible.forEach((object) => (object.visible = false));
            // eslint-disable-next-line react-hooks/exhaustive-deps
          }
        });
      })
    )
  );
}

@NgModule({
  declarations: [NgtSobaPreload],
  exports: [NgtSobaPreload],
})
export class NgtSobaPreloadModule {}
