// GENERATED
import {
    AnyConstructor,
    NgtCommonLine,
    provideCommonLineFactory,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-line-segments',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonLineFactory<THREE.LineSegments>(NgtLineSegments)],
})
export class NgtLineSegments extends NgtCommonLine<THREE.LineSegments> {
    override get lineType(): AnyConstructor<THREE.LineSegments> {
        return THREE.LineSegments;
    }
}

@NgModule({
    declarations: [NgtLineSegments],
    exports: [NgtLineSegments],
})
export class NgtLineSegmentsModule {}
