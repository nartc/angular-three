// GENERATED - AngularThree v7.0.0
import {
  NgtAnyConstructor,
  NgtUnknownRecord,
  NgtObservableInput,
  coerceNumber,
  NgtNumberInput,
} from '@angular-three/core';
import { NgtCommonEffect, provideCommonEffectRef, provideNgtCommonEffect } from '@angular-three/postprocessing';
import { isObservable, map } from 'rxjs';
import { Directive, Input } from '@angular/core';
import { ShockWaveEffect } from 'postprocessing';

@Directive({
  selector: 'ngt-shock-wave-effect',
  standalone: true,
  providers: [provideNgtCommonEffect(NgtShockWaveEffect), provideCommonEffectRef(NgtShockWaveEffect)],
})
export class NgtShockWaveEffect extends NgtCommonEffect<ShockWaveEffect> {
  override get effectType(): NgtAnyConstructor<ShockWaveEffect> {
    return ShockWaveEffect;
  }

  @Input() set position(position: NgtObservableInput<THREE.Vector3>) {
    this.set({ position });
  }

  @Input() set speed(speed: NgtObservableInput<NgtNumberInput>) {
    this.set({ speed: isObservable(speed) ? speed.pipe(map(coerceNumber)) : coerceNumber(speed) });
  }

  @Input() set maxRadius(maxRadius: NgtObservableInput<NgtNumberInput>) {
    this.set({ maxRadius: isObservable(maxRadius) ? maxRadius.pipe(map(coerceNumber)) : coerceNumber(maxRadius) });
  }

  @Input() set waveSize(waveSize: NgtObservableInput<NgtNumberInput>) {
    this.set({ waveSize: isObservable(waveSize) ? waveSize.pipe(map(coerceNumber)) : coerceNumber(waveSize) });
  }

  @Input() set amplitude(amplitude: NgtObservableInput<NgtNumberInput>) {
    this.set({ amplitude: isObservable(amplitude) ? amplitude.pipe(map(coerceNumber)) : coerceNumber(amplitude) });
  }

  override initEffectArgs() {
    const [props] = super.initEffectArgs();
    const extraArgs = [];
    for (const extra of this.extraEffectArgs) {
      const value = extra.fromComposer
        ? this.effectComposer.getState((s) => s[extra.name])
        : this.getState((s) => s[extra.name]);
      extraArgs.push(value);
      delete (props as NgtUnknownRecord)[extra.name];
    }

    return [...extraArgs, props];
  }
  override get extraEffectArgs() {
    return [...super.extraEffectArgs, { name: 'camera', fromComposer: true }, { name: 'position' }];
  }

  override get effectPropFields(): string[] {
    return [...super.effectPropFields, 'position', 'speed', 'maxRadius', 'waveSize', 'amplitude'];
  }
}
