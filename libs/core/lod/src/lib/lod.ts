import { NgtObject, provideObjectRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-lod',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideObjectRef(NgtLod)],
})
export class NgtLod extends NgtObject<THREE.LOD> {
    protected override objectInitFn(): THREE.LOD {
        return new THREE.LOD();
    }
}

@NgModule({
    declarations: [NgtLod],
    exports: [NgtLod],
})
export class NgtLodModule {}
