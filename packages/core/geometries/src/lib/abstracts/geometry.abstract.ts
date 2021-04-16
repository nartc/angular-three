import { InstancesStore } from '@angular-three/core';
import { Directive, Input, SkipSelf } from '@angular/core';
import type { BufferGeometry } from 'three';

@Directive()
export abstract class ThreeBufferGeometry<
  TGeometry extends BufferGeometry = BufferGeometry,
  TGeometryConstructor extends typeof BufferGeometry = typeof BufferGeometry
> {
  @Input() set args(v: ConstructorParameters<TGeometryConstructor>) {
    this._args = v;
  }

  private _args?: ConstructorParameters<TGeometryConstructor>;
  get args(): ConstructorParameters<TGeometryConstructor> {
    return this._args || ([] as ConstructorParameters<TGeometryConstructor>);
  }

  @Input() ngtId?: string;

  constructor(@SkipSelf() protected readonly instancesStore: InstancesStore) {}

  abstract geometryType: TGeometryConstructor;

  private _bufferGeometry?: TGeometry;
  get bufferGeometry(): TGeometry {
    if (!this._bufferGeometry) {
      this._bufferGeometry = new ((this.geometryType as unknown) as new (
        ...args: ConstructorParameters<TGeometryConstructor>
      ) => TGeometry)(...this.args);
      this.instancesStore.saveBufferGeometry({
        id: this.ngtId,
        bufferGeometry: this._bufferGeometry,
      });
    }
    return this._bufferGeometry;
  }
}
