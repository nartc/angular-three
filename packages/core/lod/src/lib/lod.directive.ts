import {
  NGT_OBJECT_CONTROLLER_PROVIDER,
  NGT_OBJECT_WATCHED_CONTROLLER,
  NgtObject3dController,
  NgtObject3dControllerModule,
} from '@angular-three/core';
import { Directive, Inject, NgModule, NgZone, OnInit } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-lod',
  exportAs: 'ngtLod',
  providers: [NGT_OBJECT_CONTROLLER_PROVIDER],
})
export class NgtLod implements OnInit {
  #lod?: THREE.LOD;

  get lod() {
    return this.#lod as THREE.LOD;
  }

  constructor(
    @Inject(NGT_OBJECT_WATCHED_CONTROLLER)
    private objectController: NgtObject3dController,
    private ngZone: NgZone
  ) {
    objectController.initFn = () => {
      this.#lod = new THREE.LOD();
      return this.#lod;
    };
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.objectController.init();
    });
  }
}

@NgModule({
  declarations: [NgtLod],
  exports: [NgtLod, NgtObject3dControllerModule],
})
export class NgtLodModule {}
