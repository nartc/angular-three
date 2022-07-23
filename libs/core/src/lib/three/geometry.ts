import { Directive, inject, Input } from '@angular/core';
import * as THREE from 'three';
import type { NgtInstanceState } from '../abstracts/instance';
import { NgtInstance } from '../abstracts/instance';
import { Ref } from '../ref';
import { tapEffect } from '../stores/component-store';
import { NGT_OBJECT_HOST_REF, NGT_OBJECT_REF } from '../tokens';
import type { AnyConstructor, AnyFunction } from '../types';

@Directive()
export abstract class NgtCommonGeometry<
  TGeometry extends THREE.BufferGeometry = THREE.BufferGeometry
> extends NgtInstance<TGeometry, NgtInstanceState<TGeometry>> {
  abstract get geometryType(): AnyConstructor<TGeometry>;

  @Input() set args(v: ConstructorParameters<AnyConstructor<TGeometry>>) {
    this.instanceArgs = v;
  }

  protected override parentRef = inject(NGT_OBJECT_REF, { optional: true, skipSelf: true }) as AnyFunction<Ref>;
  protected override parentHostRef = inject(NGT_OBJECT_HOST_REF, {
    optional: true,
    skipSelf: true,
  }) as AnyFunction<Ref>;

  protected override preInit() {
    this.set((state) => ({
      attach: state.attach.length ? state.attach : ['geometry'],
    }));
  }

  override ngOnInit() {
    super.ngOnInit();
    this.zone.runOutsideAngular(() => {
      this.store.onReady(() => {
        this.init(this.ctorParams$);
        this.postInit();
      });
    });
  }

  private readonly init = this.effect(
    tapEffect(() => {
      const instanceArgs = this.get((s) => s.instanceArgs);
      const geometryArgs = this.adjustCtorParams(instanceArgs);
      const geometry = this.prepareInstance(new this.geometryType(...geometryArgs));

      return () => {
        geometry.dispose();
      };
    })
  );
}
