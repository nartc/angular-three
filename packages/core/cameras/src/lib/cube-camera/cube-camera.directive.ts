import {
  NGT_OBJECT_CONTROLLER_PROVIDER,
  NGT_OBJECT_WATCHED_CONTROLLER,
  NgtObject3dController,
} from '@angular-three/core';
import {
  AfterContentInit,
  Directive,
  Inject,
  Input,
  NgModule,
  NgZone,
} from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-cube-camera',
  exportAs: 'ngtCubeCamera',
  providers: [NGT_OBJECT_CONTROLLER_PROVIDER],
})
export class NgtCubeCamera implements AfterContentInit {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.CubeCamera>;

  #cubeCamera?: THREE.CubeCamera;
  get cubeCamera() {
    return this.#cubeCamera;
  }

  @Input() args!: ConstructorParameters<typeof THREE.CubeCamera>;

  constructor(
    @Inject(NGT_OBJECT_WATCHED_CONTROLLER)
    private objectController: NgtObject3dController,
    private ngZone: NgZone
  ) {
    objectController.initFn = () => {
      return this.ngZone.runOutsideAngular(() => {
        this.#cubeCamera = new THREE.CubeCamera(...this.args);
        return this.#cubeCamera;
      });
    };
  }

  ngAfterContentInit() {
    this.ngZone.runOutsideAngular(() => {
      this.objectController.init();
    });
  }
}

@NgModule({
  declarations: [NgtCubeCamera],
  exports: [NgtCubeCamera],
})
export class NgtCubeCameraModule {}
