import {
  OBJECT_3D_CONTROLLER_PROVIDER,
  ThreeObject3d,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { CubeCamera } from 'three';

@Directive({
  selector: 'ngt-cube-camera',
  exportAs: 'ngtCubeCamera',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: CubeCameraDirective,
    },
    OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class CubeCameraDirective extends ThreeObject3d<CubeCamera> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof CubeCamera>
    | undefined;

  @Input() args!: ConstructorParameters<typeof CubeCamera>;

  private _camera!: CubeCamera;

  ngOnInit() {
    this.init();
  }

  protected initObject() {
    this._camera = new CubeCamera(...this.args);
  }

  get object3d(): CubeCamera {
    return this._camera;
  }
}
