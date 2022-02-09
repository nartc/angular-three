import { Directive, EventEmitter, Output, Provider, Type } from '@angular/core';
import type { NgtRender } from '../types';

@Directive()
export abstract class NgtExtender<TEntity> {
  @Output() ready = new EventEmitter<TEntity>();
  @Output() animateReady = new EventEmitter<{
    entity: TEntity;
    state: NgtRender;
  }>();

  private _object!: TEntity;

  set object(value: TEntity) {
    this._object = value;
    this.ready.emit(value);
  }

  get object(): TEntity {
    return this._object;
  }
}

export function createExtenderProvider<TType extends NgtExtender<any>>(
  type: Type<TType>
): Provider {
  return {
    provide: NgtExtender,
    useExisting: type,
  };
}
