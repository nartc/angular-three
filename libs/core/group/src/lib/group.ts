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
    selector: 'ngt-group',
    exportAs: 'ngtGroup',
    providers: [NGT_OBJECT_CONTROLLER_PROVIDER],
})
export class NgtGroup implements OnInit {
    @Output() ready = new EventEmitter<THREE.Group>();

    private _group?: THREE.Group;
    get group() {
        return this._group!;
    }

    constructor(
        @Inject(NGT_OBJECT_WATCHED_CONTROLLER)
        private objectController: NgtObjectController
    ) {
        objectController.initFn = () => (this._group = new THREE.Group());
        objectController.readyFn = () => this.ready.emit(this.group);
    }

    ngOnInit() {
        this.objectController.init();
    }
}

@NgModule({
    declarations: [NgtGroup],
    exports: [NgtGroup, NgtObjectControllerModule],
})
export class NgtGroupModule {}
