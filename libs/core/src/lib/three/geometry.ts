import { Directive, Inject, Input, NgZone, Optional, SkipSelf } from '@angular/core';
import * as THREE from 'three';
import type { NgtInstanceState } from '../abstracts/instance';
import { NgtInstance } from '../abstracts/instance';
import { Ref } from '../ref';
import { tapEffect } from '../stores/component-store';
import { NgtStore } from '../stores/store';
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

  constructor(
    zone: NgZone,
    store: NgtStore,
    @Optional()
    @SkipSelf()
    @Inject(NGT_OBJECT_REF)
    parentRef: AnyFunction<Ref<THREE.Object3D>>,
    @Optional()
    @SkipSelf()
    @Inject(NGT_OBJECT_HOST_REF)
    parentHostRef: AnyFunction<Ref<THREE.Object3D>>
  ) {
    super(zone, store, parentRef, parentHostRef);
  }

  protected override preInit() {
    this.set((state) => ({
      attach: state.attach.length ? state.attach : ['geometry'],
    }));
  }

  override ngOnInit() {
    super.ngOnInit();
    this.zone.runOutsideAngular(() => {
      this.onCanvasReady(this.store.ready$, () => {
        this.init(this.ctorParams$);
        this.postInit();
      });
    });
  }

  private readonly init = this.effect<{}>(
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
