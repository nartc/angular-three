// GENERATED
import {
    AnyConstructor,
    NgtCommonLine,
    provideCommonLineFactory,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-line',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonLineFactory<THREE.Line>(NgtLine)],
})
export class NgtLine extends NgtCommonLine<THREE.Line> {
    override get lineType(): AnyConstructor<THREE.Line> {
        return THREE.Line;
    }
}

@NgModule({
    declarations: [NgtLine],
    exports: [NgtLine],
})
export class NgtLineModule {}
