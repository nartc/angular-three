import { Directive, EventEmitter, Output } from '@angular/core';
import { NgtRender } from '../types';

@Directive()
export abstract class NgtSobaExtender<TEntity> {
  @Output() ready = new EventEmitter<TEntity>();
  @Output() animateReady = new EventEmitter<NgtRender>();

  #object!: TEntity;

  set object(value: TEntity) {
    this.#object = value;
    this.ready.emit(value);
  }

  get object(): TEntity {
    return this.#object;
  }
}
