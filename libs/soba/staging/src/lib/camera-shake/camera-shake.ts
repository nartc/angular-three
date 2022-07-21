import {
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  NgtInstance,
  NgtInstanceState,
  NumberInput,
  Ref,
  tapEffect,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { SimplexNoise } from 'three-stdlib';

export interface NgtSobaCameraShakeState extends NgtInstanceState<{}> {
  intensityRef: Ref<number>;
  initialRotation: Ref<THREE.Euler>;

  intensity: number;
  decayRate: number;
  maxYaw: number;
  maxPitch: number;
  maxRoll: number;
  yawFrequency: number;
  pitchFrequency: number;
  rollFrequency: number;
  decay: boolean;
}

@Component({
  selector: 'ngt-soba-camera-shake',
  standalone: true,
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgtSobaCameraShake extends NgtInstance<{}, NgtSobaCameraShakeState> {
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

  private readonly yawNoise = new SimplexNoise();
  private readonly pitchNoise = new SimplexNoise();
  private readonly rollNoise = new SimplexNoise();

  protected override preInit(): void {
    super.preInit();
    this.set((state) => {
      const intensity = state.intensity ?? 1;
      return {
        intensity,
        intensityRef: new Ref(intensity),
        initialRotation: new Ref(),
        decayRate: state.decayRate ?? 0.65,
        maxYaw: state.maxYaw ?? 0.1,
        maxPitch: state.maxPitch ?? 0.1,
        maxRoll: state.maxRoll ?? 0.1,
        yawFrequency: state.yawFrequency ?? 0.1,
        pitchFrequency: state.pitchFrequency ?? 0.1,
        rollFrequency: state.rollFrequency ?? 0.1,
        decay: state.decay ?? false,
      };
    });
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.zone.runOutsideAngular(() => {
      this.onCanvasReady(this.store.ready$, () => {
        const camera = this.store.get((s) => s.camera);
        this.get((s) => s.initialRotation).set(camera.rotation.clone());

        this.configureChangeEvent(
          this.select(
            this.store.select((s) => s.camera),
            this.store.select((s) => s.controls)
          )
        );

        this.setBeforeRender();
      });
    });
  }

  private readonly configureChangeEvent = this.effect<{}>(
    tapEffect(() => {
      const { controls, camera } = this.store.get();
      if (controls) {
        const initialRotation = this.get((s) => s.initialRotation);

        const callback = () => void initialRotation.set(camera.rotation.clone());
        controls.addEventListener('change', callback);
        callback();
        return () => void controls.removeEventListener('change', callback);
      }
      return;
    })
  );

  private readonly setBeforeRender = this.effect<void>(
    tapEffect(() =>
      this.store.registerBeforeRender({
        callback: ({ clock, delta }) => {
          const {
            intensityRef,
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
          const camera = this.store.get((s) => s.camera);

          const shake = Math.pow(intensityRef.value, 2);
          const yaw = maxYaw * shake * this.yawNoise.noise(clock.elapsedTime * yawFrequency, 1);
          const pitch = maxPitch * shake * this.pitchNoise.noise(clock.elapsedTime * pitchFrequency, 1);
          const roll = maxRoll * shake * this.rollNoise.noise(clock.elapsedTime * rollFrequency, 1);

          camera.rotation.set(
            initialRotation.value.x + pitch,
            initialRotation.value.y + yaw,
            initialRotation.value.z + roll
          );

          if (decay && intensityRef.value > 0) {
            intensityRef.set(decayRate * delta);
            this.constrainIntensity();
          }
        },
      })
    )
  );

  getIntensity() {
    return this.get((s) => s.intensityRef).value;
  }

  setIntensity(intensity: number) {
    const intensityRef = this.get((s) => s.intensityRef);
    intensityRef.set(intensity);
    this.constrainIntensity();
  }

  private constrainIntensity() {
    const intensityRef = this.get((s) => s.intensityRef);
    if (intensityRef.value < 0 || intensityRef.value > 1) {
      intensityRef.set(intensityRef.value < 0 ? 0 : 1);
    }
  }
}

@NgModule({
  imports: [NgtSobaCameraShake],
  exports: [NgtSobaCameraShake],
})
export class NgtSobaCameraShakeModule {}
