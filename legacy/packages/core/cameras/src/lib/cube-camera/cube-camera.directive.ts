import {
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  NgtObject3d,
} from '@angular-three/core';
import { Directive, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-cube-camera',
  exportAs: 'ngtCubeCamera',
  providers: [
    {
      provide: NgtObject3d,
      useExisting: NgtCubeCamera,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtCubeCamera extends NgtObject3d<THREE.CubeCamera> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.CubeCamera>
    | undefined;

  @Input() args!: ConstructorParameters<typeof THREE.CubeCamera>;

  private _camera!: THREE.CubeCamera;

  ngOnInit() {
    this.init();
  }

  protected initObject() {
    this._camera = new THREE.CubeCamera(...this.args);
  }

  get object3d(): THREE.CubeCamera {
    return this._camera;
  }
}

@NgModule({
  declarations: [NgtCubeCamera],
  exports: [NgtCubeCamera],
})
export class CubeCameraModule {}
