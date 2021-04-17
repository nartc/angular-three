import { InstancesStore } from '@angular-three/core';
import { ThreeAttribute } from '@angular-three/core/attributes';
import {
  ContentChildren,
  Directive,
  Input,
  OnDestroy,
  QueryList,
  SkipSelf,
} from '@angular/core';
import type { BufferGeometry } from 'three';

@Directive()
export abstract class ThreeBufferGeometry<
  TGeometry extends BufferGeometry = BufferGeometry,
  TGeometryConstructor extends typeof BufferGeometry = typeof BufferGeometry
> implements OnDestroy {
  @Input() ngtId?: string;

  @ContentChildren(ThreeAttribute) attributes!: QueryList<ThreeAttribute>;

  constructor(@SkipSelf() protected readonly instancesStore: InstancesStore) {}

  abstract geometryType: TGeometryConstructor;

  private _extraArgs?: unknown[] = [];
  protected set extraArgs(v: unknown[]) {
    this._extraArgs = v;
  }

  private _bufferGeometry?: TGeometry;
  get bufferGeometry(): TGeometry {
    if (!this._bufferGeometry) {
      const args = this._extraArgs;
      this._bufferGeometry = new ((this.geometryType as unknown) as new (
        ...args: ConstructorParameters<TGeometryConstructor>
      ) => TGeometry)(...(args as ConstructorParameters<TGeometryConstructor>));

      this.addAttributes();

      this.instancesStore.saveBufferGeometry({
        id: this.ngtId,
        bufferGeometry: this._bufferGeometry,
      });
    }
    return this._bufferGeometry;
  }

  ngOnDestroy() {
    this.attributes.forEach(({ attach, attribute }) => {
      if (attribute && attach) {
        this._bufferGeometry?.deleteAttribute(attach);
      }
    });
  }

  private addAttributes() {
    this.attributes.forEach(({ attach, attribute }) => {
      if (attribute && attach) {
        this._bufferGeometry?.setAttribute(attach, attribute);
      }
    });
  }
}
