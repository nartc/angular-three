import {
  NGT_OBJECT_CONTROLLER_PROVIDER,
  NGT_OBJECT_WATCHED_CONTROLLER,
  NgtObjectController,
  NgtObjectControllerModule,
} from '@angular-three/core';
import {
  Directive,
  EventEmitter,
  Inject,
  NgModule,
  OnInit,
  Output,
} from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-lod',
  exportAs: 'ngtLod',
  providers: [NGT_OBJECT_CONTROLLER_PROVIDER],
})
export class NgtLod implements OnInit {
  @Output() ready = new EventEmitter<THREE.LOD>();

  private _lod?: THREE.LOD;

  get lod() {
    return this._lod as THREE.LOD;
  }

  constructor(
    @Inject(NGT_OBJECT_WATCHED_CONTROLLER)
    private objectController: NgtObjectController
  ) {
    objectController.initFn = () => (this._lod = new THREE.LOD());
    objectController.readyFn = () => this.ready.emit(this.lod);
  }

  ngOnInit() {
    this.objectController.init();
  }
}

@NgModule({
  declarations: [NgtLod],
  exports: [NgtLod, NgtObjectControllerModule],
})
export class NgtLodModule {}
