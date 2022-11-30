import {
    coerceBoolean,
    getInstanceLocalState,
    NgtBooleanInput,
    NgtObjectPassThrough,
    NgtRef,
    provideNgtObject,
    provideObjectHostRef,
    provideObjectRef,
} from '@angular-three/core';
import { NgtGroup } from '@angular-three/core/objects';
import { Component, Input } from '@angular/core';
import { animationFrameScheduler, filter, observeOn, switchMap, tap } from 'rxjs';
import * as THREE from 'three';

@Component({
    selector: 'ngt-soba-center',
    standalone: true,
    template: `
        <ngt-group shouldPassThroughRef [ngtObjectPassThrough]="this" skipWrapper>
            <ngt-group [ref]="outerGroup">
                <ngt-group [ref]="innerGroup">
                    <ng-content></ng-content>
                </ngt-group>
            </ngt-group>
        </ngt-group>
    `,

    imports: [NgtGroup, NgtObjectPassThrough],
    providers: [
        provideNgtObject(NgtSobaCenter),
        provideObjectRef(NgtSobaCenter, (center) => center.innerGroup),
        provideObjectHostRef(NgtSobaCenter),
    ],
})
export class NgtSobaCenter extends NgtGroup {
    override isWrapper = true;

    @Input() set alignTop(alignTop: NgtBooleanInput) {
        this.set({ alignTop: coerceBoolean(alignTop) });
    }

    private readonly setPosition = this.effect(
        tap(() => {
            const alignTop = this.getState((s) => s['alignTop']);
            this.outerGroup.value.matrixWorld.identity();
            this.outerGroup.value.position.set(0, 0, 0);
            this.outerGroup.value.updateWorldMatrix(true, true);
            const box3 = new THREE.Box3().setFromObject(this.innerGroup.value);
            const center = new THREE.Vector3();
            const sphere = new THREE.Sphere();
            const height = box3.max.y - box3.min.y;
            box3.getCenter(center);
            box3.getBoundingSphere(sphere);

            this.outerGroup.value.position.set(-center.x, -center.y + (alignTop ? height / 2 : 0), -center.z);
        })
    );

    get innerGroup(): NgtRef<THREE.Group> {
        return this.getState((s) => s['innerGroup']);
    }

    get outerGroup(): NgtRef<THREE.Group> {
        return this.getState((s) => s['outerGroup']);
    }

    override initialize(): void {
        super.initialize();
        this.set({
            innerGroup: new NgtRef(),
            outerGroup: new NgtRef(),
            alignTop: false,
        });
    }

    override postInit(): void {
        super.postInit();
        const innerGroup$ = this.innerGroup.pipe(filter((innerGroup) => innerGroup != null));

        this.setPosition(
            this.select(
                innerGroup$,
                innerGroup$.pipe(
                    switchMap((innerGroup) => getInstanceLocalState(innerGroup)!.objectsRefs),
                    filter((objects) => objects.length > 0),
                    observeOn(animationFrameScheduler)
                ),
                this.outerGroup.pipe(filter((outerGroup) => outerGroup != null)),
                this.select((s) => s['alignTop']),
                this.defaultProjector,
                { debounce: true }
            )
        );
    }
}
