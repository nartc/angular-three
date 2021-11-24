import { NgtAnimationReady } from '@angular-three/core';
import { Directive, EventEmitter, Output } from '@angular/core';

@Directive()
export abstract class NgtCoreExtender<TEntity> {
  @Output() ready = new EventEmitter<TEntity>();
  @Output() animateReady = new EventEmitter<NgtAnimationReady<TEntity>>();
}
