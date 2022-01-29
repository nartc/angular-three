import {
  NGT_OBJECT_CONTROLLER_PROVIDER,
  NGT_OBJECT_WATCHED_CONTROLLER,
  NgtObject3dController,
  NgtObject3dControllerModule,
} from '@angular-three/core';
import {
  Directive,
  EventEmitter,
  Inject,
  NgModule,
  NgZone,
  OnInit,
  Output,
} from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-group',
  exportAs: 'ngtGroup',
  providers: [NGT_OBJECT_CONTROLLER_PROVIDER],
})
export class NgtGroup implements OnInit {
  @Output() ready = new EventEmitter<THREE.Group>();

  #group?: THREE.Group;
  get group() {
    return this.#group!;
  }

  constructor(
    @Inject(NGT_OBJECT_WATCHED_CONTROLLER)
    private objectController: NgtObject3dController,
    private ngZone: NgZone
  ) {
    objectController.initFn = () => {
      this.#group = new THREE.Group();
      return this.#group;
    };
    objectController.readyFn = () => {
      this.ready.emit(this.group);
    };
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.objectController.init();
    });
  }
}

@NgModule({
  declarations: [NgtGroup],
  exports: [NgtGroup, NgtObject3dControllerModule],
})
export class NgtGroupModule {}