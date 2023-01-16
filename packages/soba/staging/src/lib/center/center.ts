import { extend, injectNgtRef, NgtRxStore } from '@angular-three/core';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { combineLatest } from 'rxjs';
import { Box3, Group, Sphere, Vector3 } from 'three';

extend({ Group });

@Component({
    selector: 'ngts-center',
    standalone: true,
    template: `
        <ngt-group ngtCompound [ref]="groupRef">
            <ngt-group [ref]="outerRef">
                <ngt-group [ref]="innerRef">
                    <ng-content />
                </ngt-group>
            </ngt-group>
        </ngt-group>
    `,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsCenter extends NgtRxStore implements OnInit {
    @Input() groupRef = injectNgtRef<Group>();
    readonly outerRef = injectNgtRef<Group>();
    readonly innerRef = injectNgtRef<Group>();

    @Input() set top(top: boolean) {
        this.set({ top: top === undefined ? this.get('top') : top });
    }

    @Input() set right(right: boolean) {
        this.set({ right: right === undefined ? this.get('right') : right });
    }

    @Input() set bottom(bottom: boolean) {
        this.set({ bottom: bottom === undefined ? this.get('bottom') : bottom });
    }

    @Input() set left(left: boolean) {
        this.set({ left: left === undefined ? this.get('left') : left });
    }

    @Input() set front(front: boolean) {
        this.set({ front: front === undefined ? this.get('front') : front });
    }

    @Input() set back(back: boolean) {
        this.set({ back: back === undefined ? this.get('back') : back });
    }

    @Input() set disableX(disableX: boolean) {
        this.set({ disableX: disableX === undefined ? this.get('disableX') : disableX });
    }

    @Input() set disableY(disableY: boolean) {
        this.set({ disableY: disableY === undefined ? this.get('disableY') : disableY });
    }

    @Input() set disableZ(disableZ: boolean) {
        this.set({ disableZ: disableZ === undefined ? this.get('disableZ') : disableZ });
    }

    @Input() set disabled(disabled: boolean) {
        this.set({ disabled });
    }

    @Input() set precise(precise: boolean) {
        this.set({ precise: precise === undefined ? this.get('precise') : precise });
    }

    @Output() centered = new EventEmitter<{
        /** The next parent above <Center> */
        parent: THREE.Object3D;
        /** The outmost container group of the <Center> component */
        container: THREE.Object3D;
        width: number;
        height: number;
        depth: number;
        boundingBox: THREE.Box3;
        boundingSphere: THREE.Sphere;
        center: THREE.Vector3;
        verticalAlignment: number;
        horizontalAlignment: number;
        depthAlignment: number;
    }>();

    override initialize(): void {
        super.initialize();
        this.set({ precise: true });
    }

    ngOnInit(): void {
        this.#setPosition();
    }

    #setPosition() {
        this.hold(combineLatest([this.innerRef.$, this.innerRef.children$()]), ([innerGroup]) => {
            const { precise, top, left, front, disabled, disableX, disableY, disableZ, back, bottom, right } =
                this.get();
            this.outerRef.nativeElement.matrixWorld.identity();
            const box3 = new Box3().setFromObject(innerGroup, precise);
            const center = new Vector3();
            const sphere = new Sphere();
            const width = box3.max.x - box3.min.x;
            const height = box3.max.y - box3.min.y;
            const depth = box3.max.z - box3.min.z;

            box3.getCenter(center);
            box3.getBoundingSphere(sphere);
            const vAlign = top ? height / 2 : bottom ? -height / 2 : 0;
            const hAlign = left ? -width / 2 : right ? width / 2 : 0;
            const dAlign = front ? depth / 2 : back ? -depth / 2 : 0;
            this.outerRef.nativeElement.position.set(
                disabled || disableX ? 0 : -center.x + hAlign,
                disabled || disableY ? 0 : -center.y + vAlign,
                disabled || disableZ ? 0 : -center.z + dAlign
            );

            if (this.centered.observed) {
                this.centered.emit({
                    parent: this.groupRef.nativeElement.parent!,
                    container: this.groupRef.nativeElement,
                    width,
                    height,
                    depth,
                    boundingBox: box3,
                    boundingSphere: sphere,
                    center: center,
                    verticalAlignment: vAlign,
                    horizontalAlignment: hAlign,
                    depthAlignment: dAlign,
                });
            }
        });
    }
}
