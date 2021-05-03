import {
  Directive,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  SkipSelf,
} from '@angular/core';
import type { BufferGeometry } from 'three';
import { InstancesStore } from '../stores';
import type { AnyConstructor } from '../typings';

@Directive()
export abstract class ThreeBufferGeometry<
  TGeometry extends BufferGeometry = BufferGeometry
> implements OnInit, OnDestroy {
  @Input() ngtId?: string;

  constructor(
    @SkipSelf() protected readonly instancesStore: InstancesStore,
    private readonly ngZone: NgZone
  ) {}

  abstract geometryType: AnyConstructor<TGeometry>;

  private _extraArgs: unknown[] = [];
  protected set extraArgs(v: unknown[]) {
    this._extraArgs = v;
    this.ngZone.runOutsideAngular(() => {
      this.init();
    });
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      if (!this.bufferGeometry) {
        this.init();
      }
    });
  }

  private init() {
    this._bufferGeometry = new this.geometryType(...this._extraArgs);

    this.instancesStore.saveBufferGeometry({
      id: this.ngtId,
      bufferGeometry: this._bufferGeometry,
    });
  }

  private _bufferGeometry!: TGeometry;
  get bufferGeometry(): TGeometry {
    return this._bufferGeometry;
  }

  ngOnDestroy() {
    this.ngZone.runOutsideAngular(() => {
      if (this.bufferGeometry) {
        this.instancesStore.removeBufferGeometry(
          this.ngtId || this.bufferGeometry.uuid
        );
        this.bufferGeometry.dispose();
      }
    });
  }
}
