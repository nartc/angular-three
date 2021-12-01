import {
  NGT_OBJECT_CONTROLLER_PROVIDER,
  NGT_OBJECT_WATCHED_CONTROLLER,
  NgtObject3dController,
} from '@angular-three/core';
import {
  AfterContentInit,
  Directive,
  Inject,
  NgModule,
  NgZone,
} from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-group',
  exportAs: 'ngtGroup',
  providers: [NGT_OBJECT_CONTROLLER_PROVIDER],
})
export class NgtGroup implements AfterContentInit {
  #group?: THREE.Group;
  get group() {
    return this.#group;
  }

  constructor(
    @Inject(NGT_OBJECT_WATCHED_CONTROLLER)
    private objectController: NgtObject3dController,
    private ngZone: NgZone
  ) {
    objectController.initFn = () => {
      return this.ngZone.runOutsideAngular(() => {
        this.#group = new THREE.Group();
        return this.#group;
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
  declarations: [NgtGroup],
  exports: [NgtGroup],
})
export class NgtGroupModule {}
