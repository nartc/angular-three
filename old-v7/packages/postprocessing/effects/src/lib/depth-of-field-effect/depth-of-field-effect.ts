import {
  coerceNumber,
  make,
  NgtAnyConstructor,
  NgtNumberInput,
  NgtObservableInput,
  NgtVector3,
} from '@angular-three/core';
import { NgtCommonEffect, provideCommonEffectRef, provideNgtCommonEffect } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import { DepthOfFieldEffect } from 'postprocessing';
import { filter, isObservable, map, tap } from 'rxjs';
import * as THREE from 'three';
import { Texture } from 'three';

@Directive({
  selector: 'ngt-depth-of-field-effect',
  standalone: true,
  providers: [provideCommonEffectRef(NgtDepthOfFieldEffect), provideNgtCommonEffect(NgtDepthOfFieldEffect)],
})
export class NgtDepthOfFieldEffect extends NgtCommonEffect<DepthOfFieldEffect> {
  override get effectType(): NgtAnyConstructor<DepthOfFieldEffect> {
    return DepthOfFieldEffect;
  }

  @Input() set worldFocusDistance(worldFocusDistance: NgtObservableInput<NgtNumberInput>) {
    this.set({
      worldFocusDistance: isObservable(worldFocusDistance)
        ? worldFocusDistance.pipe(map(coerceNumber))
        : coerceNumber(worldFocusDistance),
    });
  }

  @Input() set worldFocusRange(worldFocusRange: NgtObservableInput<NgtNumberInput>) {
    this.set({
      worldFocusRange: isObservable(worldFocusRange)
        ? worldFocusRange.pipe(map(coerceNumber))
        : coerceNumber(worldFocusRange),
    });
  }

  @Input() set focusDistance(focusDistance: NgtObservableInput<NgtNumberInput>) {
    this.set({
      focusDistance: isObservable(focusDistance) ? focusDistance.pipe(map(coerceNumber)) : coerceNumber(focusDistance),
    });
  }

  @Input() set focalLength(focalLength: NgtObservableInput<NgtNumberInput>) {
    this.set({
      focalLength: isObservable(focalLength) ? focalLength.pipe(map(coerceNumber)) : coerceNumber(focalLength),
    });
  }

  @Input() set focusRange(focusRange: NgtObservableInput<NgtNumberInput>) {
    this.set({ focusRange: isObservable(focusRange) ? focusRange.pipe(map(coerceNumber)) : coerceNumber(focusRange) });
  }

  @Input() set bokehScale(bokehScale: NgtObservableInput<NgtNumberInput>) {
    this.set({ bokehScale: isObservable(bokehScale) ? bokehScale.pipe(map(coerceNumber)) : coerceNumber(bokehScale) });
  }

  @Input() set resolutionScale(resolutionScale: NgtObservableInput<NgtNumberInput>) {
    this.set({
      resolutionScale: isObservable(resolutionScale)
        ? resolutionScale.pipe(map(coerceNumber))
        : coerceNumber(resolutionScale),
    });
  }

  @Input() set resolutionX(resolutionX: NgtObservableInput<NgtNumberInput>) {
    this.set({
      resolutionX: isObservable(resolutionX) ? resolutionX.pipe(map(coerceNumber)) : coerceNumber(resolutionX),
    });
  }

  @Input() set resolutionY(resolutionY: NgtObservableInput<NgtNumberInput>) {
    this.set({
      resolutionY: isObservable(resolutionY) ? resolutionY.pipe(map(coerceNumber)) : coerceNumber(resolutionY),
    });
  }

  @Input() set width(width: NgtObservableInput<NgtNumberInput>) {
    this.set({ width: isObservable(width) ? width.pipe(map(coerceNumber)) : coerceNumber(width) });
  }

  @Input() set height(height: NgtObservableInput<NgtNumberInput>) {
    this.set({ height: isObservable(height) ? height.pipe(map(coerceNumber)) : coerceNumber(height) });
  }

  @Input() set target(target: NgtObservableInput<NgtVector3>) {
    this.set({
      target: isObservable(target) ? target.pipe(map((v) => make(THREE.Vector3, v))) : make(THREE.Vector3, target),
    });
  }

  @Input() set depthTexture(depthTexture: { texture: Texture; packing: number }) {
    this.set({ depthTexture });
  }

  @Input() set blur(blur: NgtObservableInput<NgtNumberInput>) {
    this.set({ blur: isObservable(blur) ? blur.pipe(map(coerceNumber)) : coerceNumber(blur) });
  }

  private readonly setTarget = this.effect(
    tap(() => {
      const { target, depthTexture } = this.getState();
      const invalidate = this.store.getState((s) => s.invalidate);

      if (target) {
        this.instanceValue.target =
          target instanceof THREE.Vector3
            ? new THREE.Vector3().set(target.x, target.y, target.z)
            : new THREE.Vector3(...target);
      }

      if (depthTexture) {
        this.instanceValue.setDepthTexture(depthTexture.texture, depthTexture.packing);
      }

      invalidate();
    })
  );

  override postInit() {
    super.postInit();
    this.setTarget(
      this.select(
        this.select((s) => s['target']),
        this.select((s) => s['depthTexture']),
        this.instanceRef.pipe(filter((v) => !!v)),
        this.defaultProjector,
        { debounce: true }
      )
    );
  }

  override initEffectArgs(): unknown[] {
    const [props] = super.initEffectArgs();
    const camera = this.effectComposer.getState((s) => s['camera']);
    return [camera, props];
  }

  override get extraEffectArgs(): Array<{ name: string; fromComposer?: boolean }> {
    return [...super.extraEffectArgs, { name: 'camera', fromComposer: true }];
  }

  override get effectPropFields(): string[] {
    return [
      ...super.effectPropFields,
      'worldFocusDistance',
      'worldFocusRange',
      'focusDistance',
      'focalLength',
      'focusRange',
      'bokehScale',
      'resolutionScale',
      'resolutionX',
      'resolutionY',
      'width',
      'height',
      'blur',
    ];
  }
}
