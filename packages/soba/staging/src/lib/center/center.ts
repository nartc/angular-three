import {
    defaultProjector,
    filterFalsy,
    NgtCompound,
    NgtObjectCompound,
    NgtObservableInput,
    NgtRef,
    provideInstanceRef
} from '@angular-three/core';
import { NgtGroup } from '@angular-three/core/objects';
import { Component, Input } from '@angular/core';
import { tap } from 'rxjs';
import * as THREE from 'three';
import { NGT_INSTANCE_INPUTS, NGT_INSTANCE_OUTPUTS, NGT_OBJECT3D_INPUTS } from '../common';

@Component({
    selector: 'ngt-soba-center',
    standalone: true,
    template: `
        <ngt-group [objectCompound]="this">
            <ngt-group [ref]="outerGroup">
                <ngt-group [ref]="innerGroup">
                    <ng-content></ng-content>
                </ngt-group>
            </ngt-group>
        </ngt-group>
    `,

    imports: [NgtGroup, NgtObjectCompound],
    providers: [
        provideInstanceRef(SobaCenter, {
            compound: true,
            factory: (center) => [center.instanceRef, center.outerGroup, center.innerGroup],
        }),
    ],
    inputs: [...NGT_INSTANCE_INPUTS, ...NGT_OBJECT3D_INPUTS],
    outputs: NGT_INSTANCE_OUTPUTS,
})
export class SobaCenter extends NgtCompound<NgtGroup> {
    @Input() set top(top: NgtObservableInput<boolean>) {
        this.write({ top });
    }

    @Input() set right(right: NgtObservableInput<boolean>) {
        this.write({ right });
    }

    @Input() set bottom(bottom: NgtObservableInput<boolean>) {
        this.write({ bottom });
    }

    @Input() set left(left: NgtObservableInput<boolean>) {
        this.write({ left });
    }

    @Input() set front(front: NgtObservableInput<boolean>) {
        this.write({ front });
    }

    @Input() set back(back: NgtObservableInput<boolean>) {
        this.write({ back });
    }

    /** Disable x-axis centering */
    @Input() set disableX(disableX: NgtObservableInput<boolean>) {
        this.write({ disableX });
    }

    /** Disable y-axis centering */
    @Input() set disableY(disableY: NgtObservableInput<boolean>) {
        this.write({ disableY });
    }

    /** Disable z-axis centering */
    @Input() set disableZ(disableZ: NgtObservableInput<boolean>) {
        this.write({ disableZ });
    }

    /** See https://threejs.org/docs/index.html?q=box3#api/en/math/Box3.setFromObject */
    @Input() set precise(precise: NgtObservableInput<boolean>) {
        this.write({ precise });
    }

    private readonly setPosition = this.effect(
        tap(() => {
            const { precise, bottom, left, right, front, back, disableX, disableY, disableZ } = this.read();
            this.outerGroup.value.matrixWorld.identity();

            const box3 = new THREE.Box3().setFromObject(this.innerGroup.value, precise);
            const center = new THREE.Vector3();
            const sphere = new THREE.Sphere();
            const width = box3.max.x - box3.min.x;
            const height = box3.max.y - box3.min.y;
            const depth = box3.max.z - box3.min.z;
            box3.getCenter(center);
            box3.getBoundingSphere(sphere);
            const vAlign = top ? height / 2 : bottom ? -height / 2 : 0;
            const hAlign = left ? -width / 2 : right ? width / 2 : 0;
            const dAlign = front ? depth / 2 : back ? -depth / 2 : 0;

            this.outerGroup.value.position.set(
                disableX ? 0 : -center.x + hAlign,
                disableY ? 0 : -center.y + vAlign,
                disableZ ? 0 : -center.z + dAlign
            );
        })
    );

    get innerGroup(): NgtRef<THREE.Group> {
        return this.read((s) => s['innerGroup']);
    }

    get outerGroup(): NgtRef<THREE.Group> {
        return this.read((s) => s['outerGroup']);
    }

    override initialize(): void {
        super.initialize();
        this.write({
            innerGroup: new NgtRef(),
            outerGroup: new NgtRef(),
            precise: true,
        });
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.setPosition(
                this.select(
                    this.innerGroup.objectRefs$(),
                    this.innerGroup.pipe(filterFalsy()),
                    this.outerGroup.pipe(filterFalsy()),
                    defaultProjector,
                    { debounce: true }
                )
            );
        });
    }
}
