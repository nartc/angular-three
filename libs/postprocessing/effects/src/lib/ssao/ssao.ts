import { AnyConstructor, UnknownRecord } from '@angular-three/core';
import { NgtCommonEffect, provideCommonEffectRef } from '@angular-three/postprocessing';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { SSAOEffect } from 'postprocessing';

@Component({
  selector: 'ngt-ssao',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonEffectRef(NgtSSAO)],
})
export class NgtSSAO extends NgtCommonEffect<SSAOEffect> {
  static ngAcceptInputType_options: ConstructorParameters<AnyConstructor<SSAOEffect>>[2] | undefined;

  override get effectType(): AnyConstructor<SSAOEffect> {
    return SSAOEffect;
  }

  protected override get skipSetEffectOptions(): boolean {
    return true;
  }

  protected override adjustCtorParams(instanceArgs: unknown[]): unknown[] {
    const { camera, normalPass, depthDownSamplingPass, resolutionScale } = this.effectComposer.get();
    if (normalPass === null && depthDownSamplingPass === null) {
      throw new Error(`SSAO can only be used when normalPass is enabled`);
    }

    const options = instanceArgs[0] as UnknownRecord;
    return [
      camera,
      normalPass && !depthDownSamplingPass ? normalPass.texture : null,
      {
        blendFunction: this.get((s) => s.blendFunction),
        samples: 30,
        rings: 4,
        distanceThreshold: 1.0,
        distanceFalloff: 0.0,
        rangeThreshold: 0.5,
        rangeFalloff: 0.1,
        luminanceInfluence: 0.9,
        radius: 20,
        scale: 0.5,
        bias: 0.5,
        intensity: 1.0,
        color: null,
        normalDepthBuffer: depthDownSamplingPass ? depthDownSamplingPass.texture : null,
        resolutionScale: resolutionScale ?? 1,
        depthAwareUpsampling: true,
        ...options,
      },
    ];
  }

  protected override get ctorParams$() {
    return this.select(
      this.effectComposer.select((s) => s.camera),
      this.effectComposer.select((s) => s.normalPass),
      this.instanceArgs$
    );
  }
}

@NgModule({
  declarations: [NgtSSAO],
  exports: [NgtSSAO],
})
export class NgtSSAOModule {}
