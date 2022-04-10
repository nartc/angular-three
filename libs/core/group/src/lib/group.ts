import { NgtObject, provideObjectFactory } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-group',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideObjectFactory<THREE.Group>(NgtGroup)],
})
export class NgtGroup extends NgtObject<THREE.Group> {
    protected override objectInitFn(): THREE.Group {
        return new THREE.Group();
    }
}

@NgModule({
    declarations: [NgtGroup],
    exports: [NgtGroup],
})
export class NgtGroupModule {}
