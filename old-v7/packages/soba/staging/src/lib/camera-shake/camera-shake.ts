import {
  coerceBoolean,
  coerceNumber,
  NgtBooleanInput,
  NgtComponentStore,
  NgtNumberInput,
  NgtStore,
  tapEffect,
} from '@angular-three/core';
import { Directive, inject, Input, NgZone, OnInit } from '@angular/core';
import { SimplexNoise } from 'three-stdlib';

@Directive({
  selector: 'ngt-soba-camera-shake',
  standalone: true,
})
export class NgtSobaCameraShake extends NgtComponentStore implements OnInit {
  @Input() set intensity(intensity: NgtNumberInput) {
    this.set({ intensity: coerceNumber(intensity) });
  }

  @Input() set decayRate(decayRate: NgtNumberInput) {
    this.set({ decayRate: coerceNumber(decayRate) });
  }

  @Input() set maxYaw(maxYaw: NgtNumberInput) {
    this.set({ maxYaw: coerceNumber(maxYaw) });
  }

  @Input() set maxPitch(maxPitch: NgtNumberInput) {
    this.set({ maxPitch: coerceNumber(maxPitch) });
  }

  @Input() set maxRoll(maxRoll: NgtNumberInput) {
    this.set({ maxRoll: coerceNumber(maxRoll) });
  }

  @Input() set yawFrequency(yawFrequency: NgtNumberInput) {
    this.set({ yawFrequency: coerceNumber(yawFrequency) });
  }

  @Input() set pitchFrequency(pitchFrequency: NgtNumberInput) {
    this.set({ pitchFrequency: coerceNumber(pitchFrequency) });
  }

  @Input() set rollFrequency(rollFrequency: NgtNumberInput) {
    this.set({ rollFrequency: coerceNumber(rollFrequency) });
  }

  @Input() set decay(decay: NgtBooleanInput) {
    this.set({ decay: coerceBoolean(decay) });
  }

  private readonly zone = inject(NgZone);
  private readonly store = inject(NgtStore);

  private readonly yawNoise = new SimplexNoise();
  private readonly pitchNoise = new SimplexNoise();
  private readonly rollNoise = new SimplexNoise();

  private readonly configureChangeEvent = this.effect(
    tapEffect(() => {
      const { controls, camera } = this.store.getState();
      if (controls) {
        const callback = () => void this.set({ initialRotation: camera.rotation.clone() });

        controls.addEventListener('change', callback);
        callback();

        return () => void controls.removeEventListener('change', callback);
      }
    })
  );

  private readonly setBeforeRender = this.effect<void>(
    tapEffect(() =>
      this.store.registerBeforeRender({
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
          } = this.getState();
          const camera = this.store.getState((s) => s.camera);

          const shake = Math.pow(intensity, 2);
          const yaw = maxYaw * shake * this.yawNoise.noise(clock.elapsedTime * yawFrequency, 1);
          const pitch = maxPitch * shake * this.pitchNoise.noise(clock.elapsedTime * pitchFrequency, 1);
          const roll = maxRoll * shake * this.rollNoise.noise(clock.elapsedTime * rollFrequency, 1);

          camera.rotation.set(initialRotation.x + pitch, initialRotation.y + yaw, initialRotation.z + roll);

          if (decay && intensity > 0) {
            this.set({ intensity: decayRate * delta });
            this.constrainIntensity();
          }
        },
      })
    )
  );

  override initialize() {
    super.initialize();
    this.set({
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
      this.store.onReady(() => {
        this.set({
          initialRotation: this.store.getState((s) => s.camera).rotation.clone(),
        });

        this.configureChangeEvent(
          this.select(
            this.store.select((s) => s.camera),
            this.store.select((s) => s.controls),
            this.defaultProjector
          )
        );
        this.setBeforeRender();
      });
    });
  }

  getIntensity() {
    return this.getState((s) => s['intensity']);
  }

  setIntensity(intensity: number) {
    this.set({ intensity });
    this.constrainIntensity();
  }

  private constrainIntensity() {
    const intensity = this.getState((s) => s['intensity']);
    if (intensity < 0 || intensity > 1) {
      this.set({ intensity: intensity < 0 ? 0 : 1 });
    }
  }
}
