import { AnyConstructor, coerceNumberProperty, NgtVector3, NumberInput } from '@angular-three/core';
import { NgtCommonEffect, provideCommonEffectRef, provideNgtCommonEffect } from '@angular-three/postprocessing';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { DepthOfFieldEffect } from 'postprocessing';
import { tap } from 'rxjs';
import * as THREE from 'three';

@Component({
  selector: 'ngt-depth-of-field-effect',
  standalone: true,
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtCommonEffect(NgtDepthOfFieldEffect), provideCommonEffectRef(NgtDepthOfFieldEffect)],
})
export class NgtDepthOfFieldEffect extends NgtCommonEffect<DepthOfFieldEffect> {
  override get effectType(): AnyConstructor<DepthOfFieldEffect> {
    return DepthOfFieldEffect;
  }

  @Input() set worldFocusDistance(worldFocusDistance: NumberInput) {
    this.set({ worldFocusDistance: coerceNumberProperty(worldFocusDistance) });
  }

  @Input() set worldFocusRange(worldFocusRange: NumberInput) {
    this.set({ worldFocusRange: coerceNumberProperty(worldFocusRange) });
  }

  @Input() set focusDistance(focusDistance: NumberInput) {
    this.set({ focusDistance: coerceNumberProperty(focusDistance) });
  }

  @Input() set focalLength(focalLength: NumberInput) {
    this.set({ focalLength: coerceNumberProperty(focalLength) });
  }

  @Input() set focusRange(focusRange: NumberInput) {
    this.set({ focusRange: coerceNumberProperty(focusRange) });
  }

  @Input() set bokehScale(bokehScale: NumberInput) {
    this.set({ bokehScale: coerceNumberProperty(bokehScale) });
  }

  @Input() set width(width: NumberInput) {
    this.set({ width: coerceNumberProperty(width) });
  }

  @Input() set height(height: NumberInput) {
    this.set({ height: coerceNumberProperty(height) });
  }

  @Input() set target(target: NgtVector3) {
    this.set({ target });
  }

  @Input() set depthTexture(depthTexture: { texture: THREE.Texture; packing: number }) {
    this.set({ depthTexture });
  }

  @Input() set blur(blur: NumberInput) {
    this.set({ blur: coerceNumberProperty(blur) });
  }

  private readonly targetParams$ = this.select(
    this.instance$,
    this.select((s) => s['target']),
    this.select((s) => s['depthTexture'])
  );

  protected override adjustCtorParams(instanceArgs: unknown[]): unknown[] {
    const camera = this.effectComposer.get((s) => s.camera);
    return [camera, instanceArgs[0]];
  }

  protected override get effectOptionsFields(): Record<string, boolean> {
    return {
      ...super.effectOptionsFields,
      worldFocusDistance: true,
      worldFocusRange: true,
      focusDistance: true,
      focalLength: true,
      focusRange: true,
      bokehScale: true,
      width: true,
      height: true,
    };
  }

  protected override get ctorParams$() {
    return this.select(this.effectComposer.select((s) => s.camera));
  }

  protected override get skipConfigureBlendMode(): boolean {
    return true;
  }

  protected override postInit() {
    this.setTarget(this.targetParams$);
  }

  private readonly setTarget = this.effect(
    tap(() => {
      const invalidate = this.store.get((s) => s.invalidate);
      const effect = this.get((s) => s.instance);
      const target = this.get((s) => s['target']);
      const depthTexture = this.get((s) => s['depthTexture']);
      if (effect.value) {
        if (target) {
          effect.value.target =
            target instanceof THREE.Vector3
              ? new THREE.Vector3().set(target.x, target.y, target.z)
              : new THREE.Vector3(target[0], target[1], target[2]);
        }

        if (depthTexture) {
          effect.value.setDepthTexture(depthTexture.texture, depthTexture.packing);
        }
      }

      invalidate();
    })
  );
}

@NgModule({
  imports: [NgtDepthOfFieldEffect],
  exports: [NgtDepthOfFieldEffect],
})
export class NgtDepthOfFieldEffectModule {}
