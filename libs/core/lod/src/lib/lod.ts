import { NgtObject, provideObjectFactory } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-lod',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideObjectFactory<THREE.LOD>(NgtLod)],
})
export class NgtLod extends NgtObject<THREE.LOD> {
    protected override objectInitFn(): THREE.LOD {
        return new THREE.LOD();
    }

    override ngOnInit() {
        this.init();
        super.ngOnInit();
    }
}

@NgModule({
    declarations: [NgtLod],
    exports: [NgtLod],
})
export class NgtLodModule {}

// import {
//     createParentObjectProvider,
//     NGT_OBJECT_CONTROLLER_PROVIDER,
//     NGT_OBJECT_WATCHED_CONTROLLER,
//     NgtObjectController,
//     NgtObjectControllerModule,
// } from '@angular-three/core';
// import {
//     Directive,
//     EventEmitter,
//     Inject,
//     NgModule,
//     OnInit,
//     Output,
// } from '@angular/core';
// import * as THREE from 'three';
//
// @Directive({
//     selector: 'ngt-lod',
//     exportAs: 'ngtLod',
//     providers: [
//         NGT_OBJECT_CONTROLLER_PROVIDER,
//         createParentObjectProvider(NgtLod, (lod) => lod.lod),
//     ],
// })
// export class NgtLod implements OnInit {
//     @Output() ready = new EventEmitter<THREE.LOD>();
//
//     private _lod?: THREE.LOD;
//
//     get lod() {
//         return this._lod as THREE.LOD;
//     }
//
//     constructor(
//         @Inject(NGT_OBJECT_WATCHED_CONTROLLER)
//         private objectController: NgtObjectController
//     ) {
//         objectController.initFn = () => (this._lod = new THREE.LOD());
//         objectController.readyFn = () => this.ready.emit(this.lod);
//     }
//
//     ngOnInit() {
//         this.objectController.init();
//     }
// }
//
// @NgModule({
//     declarations: [NgtLod],
//     exports: [NgtLod, NgtObjectControllerModule],
// })
// export class NgtLodModule {}
