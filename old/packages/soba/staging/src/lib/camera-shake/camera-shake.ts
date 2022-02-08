import {
  NgtAnimationFrameStore,
  NgtCanvasStore,
  NgtStore,
  zonelessRequestAnimationFrame,
} from '@angular-three/core';
import { Directive, Input, NgModule, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import * as THREE from 'three';
import { SimplexNoise } from 'three-stdlib';

type ControlsProto = {
  update(): void;
  target: THREE.Vector3;
  addEventListener: (event: string, callback: (event: unknown) => void) => void;
  removeEventListener: (
    event: string,
    callback: (event: unknown) => void
  ) => void;
};

export interface NgtSobaCameraShakeState {
  intensity: number;
  intensityRef: number;
  decay: boolean;
  decayRate: number;
  maxYaw: number;
  maxPitch: number;
  maxRoll: number;
  yawFrequency: number;
  pitchFrequency: number;
  rollFrequency: number;
  // TODO: in a new major this should be the only means of consuming controls, the
  // controls prop can then be removed!
  controls: ControlsProto | null;
}

@Directive({
  selector: 'ngt-soba-camera-shake',
  exportAs: 'ngtSobaCameraShake',
})
export class NgtSobaCameraShake
  extends NgtStore<NgtSobaCameraShakeState>
  implements OnInit
{
  @Input() set intensity(intensity: number) {
    this.set({ intensity });
  }

  @Input() set decay(decay: boolean) {
    this.set({ decay });
  }

  @Input() set decayRate(decayRate: number) {
    this.set({ decayRate });
  }

  @Input() set maxYaw(maxYaw: number) {
    this.set({ maxYaw });
  }

  @Input() set maxPitch(maxPitch: number) {
    this.set({ maxPitch });
  }

  @Input() set maxRoll(maxRoll: number) {
    this.set({ maxRoll });
  }

  @Input() set yawFrequency(yawFrequency: number) {
    this.set({ yawFrequency });
  }

  @Input() set pitchFrequency(pitchFrequency: number) {
    this.set({ pitchFrequency });
  }

  @Input() set rollFrequency(rollFrequency: number) {
    this.set({ rollFrequency });
  }

  @Input() set controls(controls: ControlsProto) {
    this.set({ controls });
  }

  private yawNoise = new SimplexNoise();
  private pitchNoise = new SimplexNoise();
  private rollNoise = new SimplexNoise();

  private initialRotation!: THREE.Euler;

  constructor(
    private canvasStore: NgtCanvasStore,
    private animationFrameStore: NgtAnimationFrameStore
  ) {
    super();
    this.set({
      intensity: 1,
      decay: false,
      decayRate: 0.65,
      maxYaw: 0.1,
      maxPitch: 0.1,
      maxRoll: 0.1,
      yawFrequency: 0.1,
      pitchFrequency: 0.1,
      rollFrequency: 0.1,
      controls: null,
    });
    this.connect('intensityRef', this.select('intensity'), (_, intensity) => {
      return NgtSobaCameraShake.constraintIntensity(intensity);
    });
  }

  ngOnInit() {
    zonelessRequestAnimationFrame(() => {
      this.effect(
        combineLatest([
          this.select('controls'),
          this.canvasStore.select(
            'controls'
          ) as unknown as Observable<ControlsProto>,
        ]),
        ([controls, defaultControls]) => {
          const currentControls = defaultControls || controls;
          const callback = () => {
            this.initialRotation = this.canvasStore
              .get('camera')
              .rotation.clone();
          };
          if (currentControls) {
            currentControls.addEventListener('change', callback);
          }

          return () => {
            if (currentControls) {
              currentControls.removeEventListener('change', callback);
            }
          };
        }
      );

      this.effect(this.canvasStore.ready$, () => {
        const camera = this.canvasStore.get('camera');
        this.initialRotation = camera.rotation.clone();
        const animationUuid = this.animationFrameStore.register({
          callback: ({ clock, delta }) => {
            const {
              intensityRef,
              maxYaw,
              maxPitch,
              maxRoll,
              yawFrequency,
              pitchFrequency,
              rollFrequency,
              decay,
              decayRate,
            } = this.get();
            const shake = Math.pow(intensityRef, 2);
            const yaw =
              maxYaw *
              shake *
              this.yawNoise.noise(clock.elapsedTime * yawFrequency, 1);
            const pitch =
              maxPitch *
              shake *
              this.pitchNoise.noise(clock.elapsedTime * pitchFrequency, 1);
            const roll =
              maxRoll *
              shake *
              this.rollNoise.noise(clock.elapsedTime * rollFrequency, 1);

            camera.rotation.set(
              this.initialRotation.x + pitch,
              this.initialRotation.y + yaw,
              this.initialRotation.z + roll
            );

            if (decay && intensityRef > 0) {
              this.set({ intensity: intensityRef - decayRate * delta });
            }
          },
        });

        return () => {
          this.animationFrameStore.actions.unregister(animationUuid);
        };
      });
    });
  }

  getIntensity() {
    return this.get('intensityRef');
  }

  setIntensity(intensity: number) {
    this.set({ intensity });
  }

  private static constraintIntensity(intensity: number) {
    if (intensity < 0 || intensity > 1) {
      return intensity < 0 ? 0 : 1;
    }
    return intensity;
  }
}

@NgModule({
  declarations: [NgtSobaCameraShake],
  exports: [NgtSobaCameraShake],
})
export class NgtSobaCameraShakeModule {}
