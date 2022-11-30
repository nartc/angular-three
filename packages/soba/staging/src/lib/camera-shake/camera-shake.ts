import { defaultProjector, NgtComponentStore, NgtObservableInput, NgtStore, tapEffect } from '@angular-three/core';
import { Directive, inject, Input, NgZone, OnInit } from '@angular/core';
import { SimplexNoise } from 'three-stdlib';

@Directive({
    selector: 'ngt-soba-camera-shake',
    standalone: true,
})
export class SobaCameraShake extends NgtComponentStore implements OnInit {
    @Input() set intensity(intensity: NgtObservableInput<number>) {
        this.write({ intensity });
    }

    @Input() set decayRate(decayRate: NgtObservableInput<number>) {
        this.write({ decayRate });
    }

    @Input() set maxYaw(maxYaw: NgtObservableInput<number>) {
        this.write({ maxYaw });
    }

    @Input() set maxPitch(maxPitch: NgtObservableInput<number>) {
        this.write({ maxPitch });
    }

    @Input() set maxRoll(maxRoll: NgtObservableInput<number>) {
        this.write({ maxRoll });
    }

    @Input() set yawFrequency(yawFrequency: NgtObservableInput<number>) {
        this.write({ yawFrequency });
    }

    @Input() set pitchFrequency(pitchFrequency: NgtObservableInput<number>) {
        this.write({ pitchFrequency });
    }

    @Input() set rollFrequency(rollFrequency: NgtObservableInput<number>) {
        this.write({ rollFrequency });
    }

    @Input() set decay(decay: NgtObservableInput<boolean>) {
        this.write({ decay });
    }

    private readonly zone = inject(NgZone);
    private readonly store = inject(NgtStore);

    private readonly yawNoise = new SimplexNoise();
    private readonly pitchNoise = new SimplexNoise();
    private readonly rollNoise = new SimplexNoise();

    private readonly configureChangeEvent = this.effect(
        tapEffect(() => {
            const { controls, camera } = this.store.read();
            if (controls) {
                const callback = () => void this.write({ initialRotation: camera.rotation.clone() });

                controls.addEventListener('change', callback);
                callback();

                return () => void controls.removeEventListener('change', callback);
            }
        })
    );

    private readonly setBeforeRender = this.effect<void>(
        tapEffect(() => {
            const internal = this.store.read((s) => s.internal);
            return internal.subscribe(({ clock, delta }) => {
                const {
                    intensity,
                    maxYaw,
                    maxPitch,
                    maxRoll,
                    yawFrequency,
                    pitchFrequency,
                    rollFrequency,
                    initialRotation,
                    decay,
                    decayRate,
                } = this.read();
                const camera = this.store.read((s) => s.camera);

                const shake = Math.pow(intensity, 2);
                const yaw = maxYaw * shake * this.yawNoise.noise(clock.elapsedTime * yawFrequency, 1);
                const pitch = maxPitch * shake * this.pitchNoise.noise(clock.elapsedTime * pitchFrequency, 1);
                const roll = maxRoll * shake * this.rollNoise.noise(clock.elapsedTime * rollFrequency, 1);

                camera.rotation.set(initialRotation.x + pitch, initialRotation.y + yaw, initialRotation.z + roll);

                if (decay && intensity > 0) {
                    this.write({ intensity: decayRate * delta });
                    this.constrainIntensity();
                }
            });
        })
    );

    override initialize() {
        super.initialize();
        this.write({
            intensity: 1,
            decayRate: 0.65,
            maxYaw: 0.1,
            maxPitch: 0.1,
            maxRoll: 0.1,
            yawFrequency: 0.1,
            pitchFrequency: 0.1,
            rollFrequency: 0.1,
            decay: false,
        });
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.write({ initialRotation: this.store.read((s) => s.camera).rotation.clone() });
            this.configureChangeEvent(
                this.select(
                    this.store.select((s) => s.camera),
                    this.store.select((s) => s.controls),
                    defaultProjector,
                    { debounce: true }
                )
            );
            this.setBeforeRender();
        });
    }

    getIntensity() {
        return this.read((s) => s['intensity']);
    }

    setIntensity(intensity: number) {
        this.write({ intensity });
        this.constrainIntensity();
    }

    private constrainIntensity() {
        const intensity = this.read((s) => s['intensity']);
        if (intensity < 0 || intensity > 1) {
            this.write({ intensity: intensity < 0 ? 0 : 1 });
        }
    }
}
