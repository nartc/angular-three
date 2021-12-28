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
  Input,
  NgModule,
  NgZone,
  Output,
} from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-primitive[object]',
  exportAs: 'ngtPrimitive',
  providers: [NGT_OBJECT_CONTROLLER_PROVIDER],
})
export class NgtPrimitive<TObject extends THREE.Object3D = THREE.Object3D> {
  @Output() ready = new EventEmitter<TObject>();

  #object!: TObject;

  @Input() set object(value: TObject) {
    this.#object = value;
    this.objectController.initFn = () => value;
    this.objectController.readyFn = () => {
      this.ready.emit(this.object);
    };
  }

  get object() {
    return this.#object;
  }

  constructor(
    @Inject(NGT_OBJECT_WATCHED_CONTROLLER)
    private objectController: NgtObject3dController,
    private ngZone: NgZone
  ) {}

  ngOnChanges() {
    this.ngZone.runOutsideAngular(() => {
      this.objectController.init();
    });
  }
}

@NgModule({
  declarations: [NgtPrimitive],
  exports: [NgtPrimitive, NgtObject3dControllerModule],
})
export class NgtPrimitiveModule {}
