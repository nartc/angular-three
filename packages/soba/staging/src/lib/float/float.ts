import {
    NgtCompound,
    NgtObjectCompound,
    NgtObservableInput,
    NgtRef,
    provideInstanceRef,
    tapEffect,
} from '@angular-three/core';
import { NgtGroup } from '@angular-three/core/objects';
import { Component, Input, OnInit } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-soba-float',
    standalone: true,
    template: `
        <ngt-group [objectCompound]="this">
            <ngt-group [ref]="readKey('groupRef')">
                <ng-content></ng-content>
            </ngt-group>
        </ngt-group>
    `,
    imports: [NgtGroup, NgtObjectCompound],
    providers: [
        provideInstanceRef(SobaFloat, {
            compound: true,
            factory: (float) => [float.instanceRef, float.read((s) => s['groupRef'])],
        }),
    ],
})
export class SobaFloat extends NgtCompound<NgtGroup> implements OnInit {
    @Input() set speed(speed: NgtObservableInput<number>) {
        this.write({ speed });
    }

    @Input() set rotationIntensity(rotationIntensity: NgtObservableInput<number>) {
        this.write({ rotationIntensity });
    }

    @Input() set floatIntensity(floatIntensity: NgtObservableInput<number>) {
        this.write({ floatIntensity });
    }

    @Input() set floatingRange(floatingRange: NgtObservableInput<[number?, number?]>) {
        this.write({ floatingRange });
    }

    private readonly offset = Math.random() * 10000;

    private readonly setBeforeRender = this.effect<void>(
        tapEffect(() =>
            this.store
                .read((s) => s.internal)
                .subscribe((state) => {
                    const { groupRef, speed, rotationIntensity, floatIntensity, floatingRange } = this.read();
                    if (groupRef.value) {
                        const t = this.offset + state.clock.getElapsedTime();
                        groupRef.value.rotation.x = (Math.cos((t / 4) * speed) / 8) * rotationIntensity;
                        groupRef.value.rotation.y = (Math.sin((t / 4) * speed) / 8) * rotationIntensity;
                        groupRef.value.rotation.z = (Math.sin((t / 4) * speed) / 20) * rotationIntensity;
                        let yPosition = Math.sin((t / 4) * speed) / 10;
                        yPosition = THREE.MathUtils.mapLinear(
                            yPosition,
                            -0.1,
                            0.1,
                            floatingRange?.[0] ?? -0.1,
                            floatingRange?.[1] ?? 0.1
                        );
                        groupRef.value.position.y = yPosition * floatIntensity;
                    }
                })
        )
    );

    override initialize() {
        super.initialize();
        this.write({
            groupRef: new NgtRef(),
            speed: 1,
            rotationIntensity: 1,
            floatIntensity: 1,
            floatingRange: [-0.1, 0.1],
        });
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.setBeforeRender();
            console.log(this.store.read((s) => s.scene));
        });
    }
}
