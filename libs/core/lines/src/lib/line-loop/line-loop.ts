// GENERATED
import {
    AnyConstructor,
    NgtCommonLine,
    provideCommonLineFactory,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-line-loop',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonLineFactory<THREE.LineLoop>(NgtLineLoop)],
})
export class NgtLineLoop extends NgtCommonLine<THREE.LineLoop> {
    override get lineType(): AnyConstructor<THREE.LineLoop> {
        return THREE.LineLoop;
    }
}

@NgModule({
    declarations: [NgtLineLoop],
    exports: [NgtLineLoop],
})
export class NgtLineLoopModule {}
