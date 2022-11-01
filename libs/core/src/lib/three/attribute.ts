import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import {
  NgtInstance,
  NgtInstanceState,
  provideNgtInstance,
} from '../abstracts/instance';
import { AnyConstructor, NgtInstanceNode } from '../types';
import { createNgtProvider } from '../utils/inject';

@Directive()
export abstract class NgtCommonAttribute<
  TAttribute extends
    | THREE.BufferAttribute
    | THREE.InterleavedBufferAttribute = THREE.BufferAttribute
> extends NgtInstance<TAttribute, NgtInstanceState<TAttribute>> {
  abstract get attributeType(): AnyConstructor<TAttribute>;

  @Input() set args(v: ConstructorParameters<AnyConstructor<TAttribute>>) {
    this.instanceArgs = v;
  }

  protected override initFn(
    prepareInstance: (
      instance: TAttribute,
      uuid?: string
    ) => NgtInstanceNode<TAttribute>
  ): (() => void) | void | undefined {
    const instanceArgs = this.get((s) => s.instanceArgs);
    prepareInstance(new this.attributeType(...instanceArgs));
  }
}

export const provideNgtCommonAttribute = createNgtProvider(
  NgtCommonAttribute,
  provideNgtInstance
);
