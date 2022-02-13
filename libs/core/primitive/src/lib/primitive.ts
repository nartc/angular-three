import {
    createParentObjectProvider,
    NGT_OBJECT_CONTROLLER_PROVIDER,
    NGT_OBJECT_WATCHED_CONTROLLER,
    NgtObjectController,
    NgtObjectControllerModule,
} from '@angular-three/core';
import {
    Directive,
    EventEmitter,
    Inject,
    Input,
    NgModule,
    OnChanges,
    Output,
} from '@angular/core';
import * as THREE from 'three';

@Directive({
    selector: 'ngt-primitive[object]',
    exportAs: 'ngtPrimitive',
    providers: [
        NGT_OBJECT_CONTROLLER_PROVIDER,
        createParentObjectProvider(
            NgtPrimitive,
            (primitive) => primitive.object
        ),
    ],
})
export class NgtPrimitive<TObject extends THREE.Object3D = THREE.Object3D>
    implements OnChanges
{
    @Output() ready = new EventEmitter<TObject>();

    private _object!: TObject;

    @Input() set object(value: TObject) {
        this._object = value;
        this.objectController.initFn = () => value;
        this.objectController.readyFn = () => this.ready.emit(this.object);
    }

    get object() {
        return this._object;
    }

    constructor(
        @Inject(NGT_OBJECT_WATCHED_CONTROLLER)
        private objectController: NgtObjectController
    ) {}

    ngOnChanges() {
        this.objectController.init();
    }
}

@NgModule({
    declarations: [NgtPrimitive],
    exports: [NgtPrimitive, NgtObjectControllerModule],
})
export class NgtPrimitiveModule {}
