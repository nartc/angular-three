import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance, NgtInstanceState, provideNgtInstance } from '../abstracts/instance';
import type { NgtAnyConstructor, NgtPrepareInstanceFn } from '../types';
import { createNgtProvider } from '../utils/inject';

@Directive()
export abstract class NgtCommonAttribute<
  TAttribute extends THREE.BufferAttribute | THREE.InterleavedBufferAttribute = THREE.BufferAttribute
> extends NgtInstance<TAttribute, NgtInstanceState<TAttribute>> {
  abstract get attributeType(): NgtAnyConstructor<TAttribute>;

  @Input() set args(v: ConstructorParameters<NgtAnyConstructor<TAttribute>>) {
    this.instanceArgs = v;
  }

  override initFn(prepareInstance: NgtPrepareInstanceFn<TAttribute>): (() => void) | void | undefined {
    prepareInstance(new this.attributeType(...this.initInstanceArgs(this.instanceArgs)));
  }
}

export const provideNgtCommonAttribute = createNgtProvider(NgtCommonAttribute, provideNgtInstance);
