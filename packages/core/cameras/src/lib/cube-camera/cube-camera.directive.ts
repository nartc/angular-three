import {
  NGT_OBJECT_CONTROLLER_PROVIDER,
  NGT_OBJECT_WATCHED_CONTROLLER,
  NgtObjectController,
} from '@angular-three/core';
import {
  Directive,
  EventEmitter,
  Inject,
  Input,
  NgModule,
  OnInit,
  Output,
} from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-cube-camera',
  exportAs: 'ngtCubeCamera',
  providers: [NGT_OBJECT_CONTROLLER_PROVIDER],
})
export class NgtCubeCamera implements OnInit {
  @Output() ready = new EventEmitter<THREE.CubeCamera>();

  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.CubeCamera>;

  private _cubeCamera?: THREE.CubeCamera;
  get cubeCamera() {
    return this._cubeCamera;
  }

  @Input() args!: ConstructorParameters<typeof THREE.CubeCamera>;

  constructor(
    @Inject(NGT_OBJECT_WATCHED_CONTROLLER)
    private objectController: NgtObjectController
  ) {
    objectController.initFn = () =>
      (this._cubeCamera = new THREE.CubeCamera(...this.args));
    objectController.readyFn = () => this.ready.emit(this.cubeCamera);
  }

  ngOnInit() {
    this.objectController.init();
  }
}

@NgModule({
  declarations: [NgtCubeCamera],
  exports: [NgtCubeCamera],
})
export class NgtCubeCameraModule {}
