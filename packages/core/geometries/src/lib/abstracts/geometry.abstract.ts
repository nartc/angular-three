import { AnyConstructor, InstancesStore } from '@angular-three/core';
import { Directive, Input, OnDestroy, SkipSelf } from '@angular/core';
import type { BufferGeometry } from 'three';

@Directive()
export abstract class ThreeBufferGeometry<
  TGeometry extends BufferGeometry = BufferGeometry
> implements OnDestroy {
  @Input() ngtId?: string;

  constructor(@SkipSelf() protected readonly instancesStore: InstancesStore) {}

  abstract geometryType: AnyConstructor<TGeometry>;

  private _extraArgs: unknown[] = [];
  protected set extraArgs(v: unknown[]) {
    this._extraArgs = v;
  }

  private _bufferGeometry?: TGeometry;
  get bufferGeometry(): TGeometry {
    if (!this._bufferGeometry) {
      this._bufferGeometry = new this.geometryType(...this._extraArgs);

      this.instancesStore.saveBufferGeometry({
        id: this.ngtId,
        bufferGeometry: this._bufferGeometry,
      });
    }
    return this._bufferGeometry;
  }

  ngOnDestroy() {
    if (this.bufferGeometry) {
      this.instancesStore.removeBufferGeometry(
        this.ngtId || this.bufferGeometry.uuid
      );
    }
  }
}
