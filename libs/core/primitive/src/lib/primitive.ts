import {
    NgtObject,
    NgtObjectInputsState,
    NgtPreObjectInit,
    provideObjectRef,
    tapEffect,
} from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule,
} from '@angular/core';
import { filter } from 'rxjs';
import * as THREE from 'three';

export interface NgtPrimitiveState extends NgtObjectInputsState {
    object: THREE.Object3D;
}

@Component({
    selector: 'ngt-primitive[object]',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideObjectRef(NgtPrimitive)],
})
export class NgtPrimitive extends NgtObject<THREE.Object3D, NgtPrimitiveState> {
    @Input() set object(object: THREE.Object3D) {
        this.set({ object });
    }

    get object() {
        return this.get((s) => s.object);
    }

    private readonly object$ = this.select((s) => s.object).pipe(
        filter((object) => object != null)
    );

    protected override objectInitFn(): THREE.Object3D {
        return this.object;
    }

    protected override get preObjectInit(): NgtPreObjectInit {
        return (initFn) => {
            this.effect<THREE.Object3D>(
                tapEffect(() => {
                    // TODO: determine whether we should run clean up logic if object is undefined/null
                    initFn();
                })
            )(this.object$);
        };
    }
}

@NgModule({
    declarations: [NgtPrimitive],
    exports: [NgtPrimitive],
})
export class NgtPrimitiveModule {}
