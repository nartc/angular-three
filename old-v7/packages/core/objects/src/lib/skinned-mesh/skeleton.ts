import {
  coerceNumber,
  injectSkinnedMeshHostRef,
  make,
  NgtAnyFunction,
  NgtInstance,
  NgtMatrix4,
  NgtNumberInput,
  NgtObservableInput,
  NgtPrepareInstanceFn,
  NgtRef,
  provideInstanceRef,
  provideNgtInstance,
} from '@angular-three/core';
import { Component, inject, Input } from '@angular/core';
import { isObservable, map } from 'rxjs';
import * as THREE from 'three';
import { NgtSkinnedMesh } from './skinned-mesh';

@Component({
  selector: 'ngt-skeleton',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtInstance(NgtSkeleton), provideInstanceRef(NgtSkeleton)],
})
export class NgtSkeleton extends NgtInstance<THREE.Skeleton> {
  @Input() set args(args: ConstructorParameters<typeof THREE.Skeleton>) {
    this.instanceArgs = args;
  }

  @Input() set bones(bones: NgtObservableInput<THREE.Bone[]>) {
    this.set({ bones });
  }

  @Input() set boneInverses(boneInverses: NgtObservableInput<NgtMatrix4[]>) {
    this.set({
      boneInverses: isObservable(boneInverses)
        ? boneInverses.pipe(map((inverses) => inverses.map((datum) => make(THREE.Matrix4, datum))))
        : (boneInverses as NgtMatrix4[]).map((datum) => make(THREE.Matrix4, datum)),
    });
  }

  @Input() set boneMatrices(boneMatrices: NgtObservableInput<Float32Array>) {
    this.set({ boneMatrices });
  }

  @Input() set boneTexture(boneTexture: NgtObservableInput<null | THREE.DataTexture>) {
    this.set({ boneTexture });
  }

  @Input() set boneTextureSize(boneTextureSize: NgtObservableInput<NgtNumberInput>) {
    this.set({
      boneTextureSize: isObservable(boneTextureSize)
        ? boneTextureSize.pipe(map(coerceNumber))
        : coerceNumber(boneTextureSize),
    });
  }

  @Input() set frame(frame: NgtObservableInput<NgtNumberInput>) {
    this.set({
      frame: isObservable(frame) ? frame.pipe(map(coerceNumber)) : coerceNumber(frame),
    });
  }

  private readonly skinnedMesh = inject(NgtSkinnedMesh, { optional: true });
  override parentRef = (() => this.skinnedMesh?.instanceRef) as NgtAnyFunction<NgtRef>;
  override parentHostRef = injectSkinnedMeshHostRef({
    optional: true,
    skipSelf: true,
  });

  override initialize() {
    super.initialize();
    this.set({
      attach: ['skeleton'],
      bones: [],
      boneInverses: [],
      boneMatrices: null as unknown as Float32Array,
      boneTexture: null,
      boneTextureSize: 0,
      frame: -1,
    });
  }

  override initFn(prepareInstance: NgtPrepareInstanceFn<THREE.Skeleton>): (() => void) | void | undefined {
    const { bones, boneInverses } = this.getState();

    const skeletonArgs = [...this.instanceArgs];

    if (skeletonArgs.length === 0) {
      if (bones.length) {
        skeletonArgs[0] = bones;
      }

      if (boneInverses.length) {
        skeletonArgs[1] = boneInverses;
      }
    }

    const skeleton = prepareInstance(
      new THREE.Skeleton(...(skeletonArgs as ConstructorParameters<typeof THREE.Skeleton>))
    );

    if (!this.skinnedMesh?.instanceValue.skeleton) {
      this.skinnedMesh?.bind(skeleton);
    }

    return () => {
      skeleton.dispose();
    };
  }

  override get optionsFields() {
    return [...super.optionsFields, 'bones', 'boneTexture', 'boneTextureSize', 'boneMatrices', 'boneInverses', 'frame'];
  }
}
