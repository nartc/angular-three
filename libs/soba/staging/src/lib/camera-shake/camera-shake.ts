import {
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  NgtComponentStore,
  NgtStore,
  NumberInput,
  tapEffect,
} from '@angular-three/core';
import { Directive, inject, Input, NgZone, OnInit } from '@angular/core';
import { SimplexNoise } from 'three-stdlib';

@Directive({
  selector: 'ngt-soba-camera-shake',
  standalone: true,
})
export class NgtSobaCameraShake extends NgtComponentStore implements OnInit {
  @Input() set intensity(intensity: NumberInput) {
    this.set({ intensity: coerceNumberProperty(intensity) });
  }

  @Input() set decayRate(decayRate: NumberInput) {
    this.set({ decayRate: coerceNumberProperty(decayRate) });
  }

  @Input() set maxYaw(maxYaw: NumberInput) {
    this.set({ maxYaw: coerceNumberProperty(maxYaw) });
  }

  @Input() set maxPitch(maxPitch: NumberInput) {
    this.set({ maxPitch: coerceNumberProperty(maxPitch) });
  }

  @Input() set maxRoll(maxRoll: NumberInput) {
    this.set({ maxRoll: coerceNumberProperty(maxRoll) });
  }

  @Input() set yawFrequency(yawFrequency: NumberInput) {
    this.set({ yawFrequency: coerceNumberProperty(yawFrequency) });
  }

  @Input() set pitchFrequency(pitchFrequency: NumberInput) {
    this.set({ pitchFrequency: coerceNumberProperty(pitchFrequency) });
  }

  @Input() set rollFrequency(rollFrequency: NumberInput) {
    this.set({ rollFrequency: coerceNumberProperty(rollFrequency) });
  }

  @Input() set decay(decay: BooleanInput) {
    this.set({ decay: coerceBooleanProperty(decay) });
  }

  readonly #zone = inject(NgZone);
  readonly #store = inject(NgtStore);

  readonly #yawNoise = new SimplexNoise();
  readonly #pitchNoise = new SimplexNoise();
  readonly #rollNoise = new SimplexNoise();

  readonly #configureChangeEvent = this.effect(
    tapEffect(() => {
      const { controls, camera } = this.#store.get();
      if (controls) {
        const callback = () =>
          void this.set({ initialRotation: camera.rotation.clone() });

        controls.addEventListener('change', callback);
        callback();

        return () => void controls.removeEventListener('change', callback);
      }
      return;
    })
  );

  readonly #setBeforeRender = this.effect<void>(
    tapEffect(() =>
      this.#store.registerBeforeRender({
        callback: ({ clock, delta }) => {
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
          } = this.get();
          const camera = this.#store.get((s) => s.camera);

          const shake = Math.pow(intensity, 2);
          const yaw =
            maxYaw *
            shake *
            this.#yawNoise.noise(clock.elapsedTime * yawFrequency, 1);
          const pitch =
            maxPitch *
            shake *
            this.#pitchNoise.noise(clock.elapsedTime * pitchFrequency, 1);
          const roll =
            maxRoll *
            shake *
            this.#rollNoise.noise(clock.elapsedTime * rollFrequency, 1);

          camera.rotation.set(
            initialRotation.x + pitch,
            initialRotation.y + yaw,
            initialRotation.z + roll
          );

          if (decay && intensity > 0) {
            this.set({ intensity: decayRate * delta });
            this.#constrainIntensity();
          }
        },
      })
    )
  );

  ngOnInit() {
    this.#zone.runOutsideAngular(() => {
      this.#store.onReady(() => {
        const camera = this.#store.get((s) => s.camera);
        this.set((s) => ({
          intensity: s['intensity'] ?? 1,
          initialRotation: camera.rotation.clone(),
          decayRate: s['decayRate'] ?? 0.65,
          maxYaw: s['maxYaw'] ?? 0.1,
          maxPitch: s['maxPitch'] ?? 0.1,
          maxRoll: s['maxRoll'] ?? 0.1,
          yawFrequency: s['yawFrequency'] ?? 0.1,
          pitchFrequency: s['pitchFrequency'] ?? 0.1,
          rollFrequency: s['rollFrequency'] ?? 0.1,
          decay: s['decay'] ?? false,
        }));

        this.#configureChangeEvent(
          this.select(
            this.#store.select((s) => s.camera),
            this.#store.select((s) => s.controls)
          )
        );
        this.#setBeforeRender();
      });
    });
  }

  getIntensity() {
    return this.get((s) => s['intensity']);
  }

  setIntensity(intensity: number) {
    this.set({ intensity });
    this.#constrainIntensity();
  }

  #constrainIntensity() {
    const intensity = this.get((s) => s['intensity']);
    if (intensity < 0 || intensity > 1) {
      this.set({ intensity: intensity < 0 ? 0 : 1 });
    }
  }
}
