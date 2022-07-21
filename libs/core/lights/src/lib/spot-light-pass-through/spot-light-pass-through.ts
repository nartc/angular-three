import { startWithUndefined } from '@angular-three/core';
import { Directive, Input, NgModule, Optional, Self } from '@angular/core';
import { merge, takeUntil } from 'rxjs';
import { NgtSpotLight } from '../spot-light/spot-light';

@Directive({
  selector: '[ngtSpotLightPassThrough]',
  standalone: true,
})
export class NgtSpotLightPassThrough {
  @Input() set ngtSpotLightPassThrough(wrapper: unknown) {
    this.assertWrapper(wrapper);

    merge(
      this.host.select((s) => s['distance']).pipe(startWithUndefined()),
      wrapper.select((s) => s['distance']).pipe(startWithUndefined())
    )
      .pipe(takeUntil(wrapper.destroy$))
      .subscribe((distance) => {
        this.host.distance = distance;
      });

    merge(
      this.host.select((s) => s['angle']).pipe(startWithUndefined()),
      wrapper.select((s) => s['angle']).pipe(startWithUndefined())
    )
      .pipe(takeUntil(wrapper.destroy$))
      .subscribe((angle) => {
        this.host.angle = angle;
      });

    merge(
      this.host.select((s) => s['penumbra']).pipe(startWithUndefined()),
      wrapper.select((s) => s['penumbra']).pipe(startWithUndefined())
    )
      .pipe(takeUntil(wrapper.destroy$))
      .subscribe((penumbra) => {
        this.host.penumbra = penumbra;
      });

    merge(
      this.host.select((s) => s['decay']).pipe(startWithUndefined()),
      wrapper.select((s) => s['decay']).pipe(startWithUndefined())
    )
      .pipe(takeUntil(wrapper.destroy$))
      .subscribe((decay) => {
        this.host.decay = decay;
      });

    merge(
      this.host.select((s) => s['target']).pipe(startWithUndefined()),
      wrapper.select((s) => s['target']).pipe(startWithUndefined())
    )
      .pipe(takeUntil(wrapper.destroy$))
      .subscribe((target) => {
        this.host.target = target;
      });

    merge(
      this.host.select((s) => s['power']).pipe(startWithUndefined()),
      wrapper.select((s) => s['power']).pipe(startWithUndefined())
    )
      .pipe(takeUntil(wrapper.destroy$))
      .subscribe((power) => {
        this.host.power = power;
      });
  }

  constructor(@Self() @Optional() private host: NgtSpotLight) {
    if (!host) return;
  }

  private assertWrapper(wrapper: unknown): asserts wrapper is NgtSpotLight {
    if (!wrapper || !(wrapper instanceof NgtSpotLight)) {
      throw new Error('ngtSpotLightPassThrough wrapper is not a NgtSpotLight');
    }
  }
}

@NgModule({
  imports: [NgtSpotLightPassThrough],
  exports: [NgtSpotLightPassThrough],
})
export class NgtSpotLightPassThroughModule {}
