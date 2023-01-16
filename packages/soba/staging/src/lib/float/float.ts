import { extend, injectNgtRef, NgtBeforeRender, NgtRxStore } from '@angular-three/core';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Group, MathUtils } from 'three';

extend({ Group });

@Component({
    selector: 'ngts-float',
    standalone: true,
    template: `
        <ngt-group ngtCompound>
            <ngt-group [ref]="groupRef" (beforeRender)="onBeforeRender($any($event))">
                <ng-content />
            </ngt-group>
        </ngt-group>
    `,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsFloat extends NgtRxStore {
    readonly #offset = Math.random() * 10000;

    @Input() groupRef = injectNgtRef<Group>();

    @Input() set speed(speed: number) {
        this.set({ speed });
    }

    @Input() set rotationIntensity(rotationIntensity: number) {
        this.set({ rotationIntensity });
    }

    @Input() set floatIntensity(floatIntensity: number) {
        this.set({ floatIntensity });
    }

    @Input() set floatingRange(floatingRange: [number?, number?]) {
        this.set({ floatingRange });
    }

    override initialize() {
        super.initialize();
        this.set({
            speed: 1,
            rotationIntensity: 1,
            floatIntensity: 1,
            floatingRange: [-0.1, 0.1],
        });
    }

    onBeforeRender({ state, object }: NgtBeforeRender<Group>) {
        const { speed, rotationIntensity, floatIntensity, floatingRange } = this.get();
        const t = this.#offset + state.clock.getElapsedTime();
        object.rotation.x = (Math.cos((t / 4) * speed) / 8) * rotationIntensity;
        object.rotation.y = (Math.sin((t / 4) * speed) / 8) * rotationIntensity;
        object.rotation.z = (Math.sin((t / 4) * speed) / 20) * rotationIntensity;
        let yPosition = Math.sin((t / 4) * speed) / 10;
        yPosition = MathUtils.mapLinear(yPosition, -0.1, 0.1, floatingRange[0] ?? -0.1, floatingRange[1] ?? 0.1);
        object.position.y = yPosition * floatIntensity;
    }
}
